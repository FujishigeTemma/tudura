package function

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
)

type postItemRequest struct {
	Name     string `json:"name" db:"name"`
	Duration int    `json:"duration" db:"duration"`
}

type boxInfo struct {
	HashedPass sql.NullString `json:"hashedPass" db:"hashed_pass"`
}

type uploadedFile struct {
	ID        string    `json:"id" db:"id"`
	BoxID     string    `json:"boxId" db:"box_id"`
	Name      string    `json:"name" db:"name"`
	Size      int64     `json:"size" db:"size"`
	ExpiresAt time.Time `json:"expiresAt" db:"expires_at"`
}

// TODO: 一括アップロード可能に
// PostItemHandler POST /boxes/{boxId} アイテムのアップロード
func PostItemHandler(w http.ResponseWriter, r *http.Request) {
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

	boxID := strings.TrimPrefix(r.URL.Path, "/boxes/")

	var boxInfo boxInfo
	err := dbPool.Get(&boxInfo, "SELECT hashed_pass FROM boxes WHERE id = ? AND deleted_at IS NULL", boxID)
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
	//if boxInfo.HashedPass.Valid() {
	//
	//}

	itemID, err := uuid.NewRandom()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		Error.Printf("uuid.NewRandom: %v", err)
		return
	}

	var req postItemRequest
	var fileInfo *storage.ObjectAttrs

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

				if len([]rune(req.Name)) <= 0 || len([]rune(req.Name)) > 32 {
					http.Error(w, "Item Name must be between 1 and 32 characters.", http.StatusBadRequest)
					Info.Printf("item name length error: %v", req.Name)
					return
				}
			}
			if p.FormName() == "file" {
				fileInfo, err = uploadFile(p, bucketName, itemID.String(), req.Duration)
				if err != nil {
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					Error.Printf("uploadFile(): %v", err)
					return
				}
			}
		}
	}

	// transactionを取る
	var expirationDate time.Time
	if req.Duration == 0 {
		expirationDate = time.Now().Add(time.Minute * 30)
	} else {
		expirationDate = time.Now().Add(time.Minute * time.Duration(req.Duration))
	}
	if _, err := dbPool.Exec("INSERT INTO items(`id`, `box_id`, `name`, `size`, `expires_at`) VALUES (?, ?, ?, ?, ?)", itemID.String(), boxID, req.Name, fileInfo.Size, expirationDate); err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when INSERT item record: %v", err)
	}
	var uploadedFile uploadedFile
	if err := dbPool.Get(&uploadedFile, "SELECT id, box_id, name, size, expires_at FROM items WHERE id = ?", itemID.String()); err != nil {
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

func uploadFile(r io.Reader, bucket, object string, duration int) (*storage.ObjectAttrs, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*50)
	defer cancel()

	// TODO: gzip
	// TODO: durationに応じてbucketを振り分ける(HotSpotになってよくなさそう)
	wc := storageClient.Bucket(bucket).Object(object).NewWriter(ctx)
	if _, err := io.Copy(wc, r); err != nil {
		return nil, fmt.Errorf("io.Copy: %v", err)
	}
	if err := wc.Close(); err != nil {
		return nil, fmt.Errorf("Writer.Close: %v", err)
	}
	return &wc.ObjectAttrs, nil
}
