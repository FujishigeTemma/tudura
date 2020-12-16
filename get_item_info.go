package function

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"
)

type item struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Size      int       `json:"size" db:"size"`
	ExpiresAt time.Time `json:"expiresAt" db:"expires_at"`
}

// GetItemHandler POST /boxes/{boxId}/{itemId} アイテムの詳細を取得
func GetItemHandler(w http.ResponseWriter, r *http.Request) {
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

	if boxInfo.PasswordRequired {
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

	itemID := r.URL.Path[44:]

	var itemInfo item
	err = dbPool.Get(&itemInfo, "SELECT id, name, size, expires_at FROM items WHERE id = ?", itemID)
	if err == sql.ErrNoRows {
		http.Error(w, "Item Not Found", http.StatusNotFound)
		Info.Printf("item not found: %v", itemID)
		return
	}
	if err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when SELECT the item record: %s", err)
		return
	}

	res, err := json.Marshal(itemInfo)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		Error.Printf("json.Marshal: %s", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}
