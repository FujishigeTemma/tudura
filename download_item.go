package function

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
)


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

	var err error
	// TODO: コネクションの効率化
	storageClient, err = storage.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer storageClient.Close()

	Trace.Printf("Debug: %v", r.URL.Path)
	boxID := strings.TrimPrefix(r.URL.Path, "/boxes/")

	var boxInfo boxInfo
	err = dbPool.Get(&boxInfo, "SELECT hashed_pass FROM boxes WHERE id = ? AND deleted_at IS NULL", boxID)
	if err == sql.ErrNoRows {
		http.Error(w, "Box Not Found", http.StatusNotFound)
		Info.Printf("box not found: %v", boxID)
		return
	}
	if err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when SELECT box record: %v", err)
		return
	}

	// TODO: Boxのauth時にcookieを付与→cookieがない場合はBoxのauthにリダイレクト
	//if len(boxInfo.HashedPass) != 0 {
	//
	//}

	var req postItemRequest

	mediaType, params, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil {
		http.Error(w, "Invalid Content-Type", http.StatusBadRequest)
		Error.Printf("mime.ParseMediaType: %v", err)
		return
	}
	if strings.HasPrefix(mediaType, "multipart/") {
		mr := multipart.NewReader(r.Body, params["boundary"])
		for {
			p, err := mr.NextPart()
			if err == io.EOF {
				break
			}
			if err != nil {
				http.Error(w, "Invalid Form Data", http.StatusBadRequest)
				Error.Printf("mr.NextPart: %v", err)
				return
			}
			Trace.Printf("Dubug: %v", p.Header)
			if p.FormName() == "json" {
				if err := json.NewDecoder(p).Decode(&req); err != nil {
					http.Error(w, "Invalid JSON format", http.StatusBadRequest)
					Error.Printf("json.NewDecoder: %v", err)
					return
				}

				if len(req.Name) <= 0 || len(req.Name) > 32 {
					http.Error(w, "Item Name must be between 1 and 32 characters.", http.StatusBadRequest)
					Info.Printf("item name length error: %v", req.Name)
					return
				}
			}
			if p.FormName() == "file" {
				if err := uploadFile(p, bucketName, req.Name, req.Duration); err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					Error.Printf("uploadFile(): %v", err)
					return
				}
			}
		}
	}

	// transactionを取る
	itemID, err := uuid.NewRandom()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		Error.Printf("uuid.NewRandom: %v", err)
		return
	}
	var expirationDate time.Time
	if req.Duration == 0 {
		expirationDate = time.Now().Add(time.Minute * 30)
	} else {
		expirationDate = time.Now().Add(time.Minute * time.Duration(req.Duration))
	}
	if _, err := dbPool.Exec("INSERT INTO items(`id`, `box_id`, `name`, `expires_at`) VALUES (?, ?, ?, ?)", itemID.String(), boxID, req.Name, expirationDate); err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when INSERT item record: %v", err)
	}
	var uploadedFile uploadedFile
	if err := dbPool.Get(&uploadedFile, "SELECT id, box_id, name, expires_at FROM items WHERE id = ?", itemID.String()); err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when SELECT uploaded item record: %v", err)
		return
	}

	res, err := json.Marshal(uploadedFile)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		Error.Printf("json.Marshal: %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

// TODO: bucketをout of factorする
func downloadFile(bucket, object string) (io.Writer, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*50)
	defer cancel()

	// TODO: gzip
	// TODO: durationに応じてbucketを振り分ける(HotSpotになってよくなさそう)
	rc, err := storageClient.Bucket(bucket).Object(object).NewReader(ctx)
	if err != nil {
		return nil, fmt.Errorf("Object(%q).NewReader: %v", object, err)
	}
	defer rc.Close()

	data, err := ioutil.ReadAll(rc)
	if err != nil {
		return nil, fmt.Errorf("ioutil.ReadAll: %v", err)
	}
	return data, nil
}
