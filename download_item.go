package function

import (
	"context"
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"cloud.google.com/go/storage"
)

type itemInfo struct {
	Name      string `json:"name" db:"name"`
	IsExpired bool   `db:"is_expired"`
}

// TODO: 一括アップロード可能に
// DownloadItemHandler POST /boxes/{boxId}/d/{itemId} アイテムのダウンロード
func DownloadItemHandler(w http.ResponseWriter, r *http.Request) {
	clientOnce.Do(func() {
		if err := setup(); err != nil {
			http.Error(w, "Error initializing context", http.StatusInternalServerError)
			return
		}
	})

	// Set CORS headers for the preflight request
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.WriteHeader(http.StatusNoContent)
		return
	}
	// Set CORS headers for the main request.
	w.Header().Set("Access-Control-Allow-Origin", "*")

	boxID := r.URL.Path[7:42]

	var boxInfo boxInfo
	err := dbPool.Get(&boxInfo, "SELECT hashed_pass FROM boxes WHERE id = ?", boxID)
	if err == sql.ErrNoRows {
		http.Error(w, "Box Not Found", http.StatusNotFound)
		Info.Printf("box not found: %v", boxID)
		return
	}
	if err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when SELECT the box record: %s", err)
		return
	}

	if boxInfo.HashedPass.Valid {
		err := checkAuth(boxID, r)
		if err == UnauthorizedError {
			http.Error(w, "Authentication failed", http.StatusUnauthorized)
			return
		}
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}

	itemID := r.URL.Path[46:]

	var itemInfo itemInfo
	err = dbPool.Get(&itemInfo, "SELECT name, CASE WHEN expires_at <= ? THEN 1 ELSE 0 END AS is_expired FROM items WHERE id = ?", time.Now(), itemID)
	if err == sql.ErrNoRows {
		http.Error(w, "Item Not Found", http.StatusNotFound)
		Info.Printf("item not found: %v", itemID)
		return
	}
	if err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when SELECT box record: %v", err)
		return
	}
	if itemInfo.IsExpired {
		http.Error(w, "Resource Is Expired", http.StatusGone)
		Info.Printf("expired resource access: %v", itemID)
		return
	}

	file, err := getDownloadStream(bucketName, itemID)
	if err != nil {
		http.Error(w, "Resource Error", http.StatusInternalServerError)
		Error.Printf("downloadFile(): %v", err)
		return
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename= %s", itemInfo.Name))
	w.Header().Set("Content-Length", strconv.FormatInt(file.Attrs.Size, 10))
	if _, err := io.Copy(w, file); err != nil {
		http.Error(w, "I/O Error", http.StatusInternalServerError)
		Error.Printf("io.Copy(): %v", err)
		return
	}
}

// TODO: bucketをout of factorする
func getDownloadStream(bucket, object string) (*storage.Reader, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*50)
	defer cancel()

	// TODO: gzip
	// TODO: durationに応じてbucketを振り分ける(HotSpotになってよくなさそう)
	return storageClient.Bucket(bucket).Object(object).NewReader(ctx)
}
