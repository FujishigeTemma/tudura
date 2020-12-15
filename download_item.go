package function

import (
	"context"
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
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
		var err error
		dbPool, err = getDBPool()
		if err != nil {
			http.Error(w, "Error initializing database", http.StatusInternalServerError)
			Error.Printf("getDBPool(): %v", err)
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

	// TODO: Boxのauth時にcookieを付与→cookieがない場合はBoxのauthにリダイレクト
	//if len(boxInfo.HashedPass) != 0 {
	//
	//}

	var err error
	// TODO: コネクションの効率化
	storageClient, err = storage.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer storageClient.Close()

	Trace.Printf("Debug: %v", r.URL.Path)
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
	w.Header().Set("Content-Length", string(file.Attrs.Size))
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
