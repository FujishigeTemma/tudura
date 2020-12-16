package function

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

type boxWithItems struct {
	ID               string    `json:"id" db:"id"`
	Name             string    `json:"name" db:"name"`
	PasswordRequired bool      `json:"passwordRequired" db:"password_required"`
	Items            []item    `json:"items"`
	UpdatedAt        time.Time `json:"updatedAt" db:"updated_at"`
}

// GetBoxHandler POST /boxes/{boxId} ボックスの概要を取得
func GetBoxHandler(w http.ResponseWriter, r *http.Request) {
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

	var boxInfo boxWithItems
	err := dbPool.Get(&boxInfo, "SELECT id, name, CASE WHEN hashed_pass IS NOT NULL THEN 1 ELSE 0 END AS password_required, updated_at FROM boxes WHERE id = ?", boxID)
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

	if err := dbPool.Select(&boxInfo.Items, "SELECT id, name, size, expires_at FROM items WHERE box_id = ? AND expires_at > ?", boxID, time.Now()); err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when SELECT item records: %s", err)
		return
	}

	res, err := json.Marshal(boxInfo)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		Error.Printf("json.Marshal: %s", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}
