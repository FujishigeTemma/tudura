package function

import (
	"database/sql"
	"encoding/json"
	"github.com/google/uuid"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type postAuthRequest struct {
	Password string `json:"password"`
}

type boxInfo struct {
	HashedPass sql.NullString `json:"hashedPass" db:"hashed_pass"`
}

// AuthBoxHandler /boxes/{boxId}/auth ボックスに対する認証を行い、Cookieを付与
func AuthBoxHandler(w http.ResponseWriter, r *http.Request) {
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

	boxID := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/boxes/"), "/auth")

	session, err := session.Get(r, tuduraSessionName)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		Error.Printf("session.Get: %v", err)
		return
	}

	if !session.IsNew {
		if session.Values[boxID] != nil {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("You are already logged in."))
			return
		}
	}

	var boxInfo boxInfo
	err = dbPool.Get(&boxInfo, "SELECT hashed_pass FROM boxes WHERE id = ? AND deleted_at IS NULL", boxID)
	if err == sql.ErrNoRows {
		http.Error(w, "Box Not Found", http.StatusNotFound)
		Info.Printf("box not found: %v", boxID)
		return
	}
	if !boxInfo.HashedPass.Valid {
		http.Error(w, "This box does not require any authentication.", http.StatusBadRequest)
		Info.Printf("password not required: %v", boxID)
		return
	}
	if err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when SELECT box record: %v", err)
		return
	}

	var req postAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		Info.Printf("json.NewDecoder: %v", err)
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(boxInfo.HashedPass.String), []byte(req.Password)) != nil {
		http.Error(w, "Authentication failed", http.StatusUnauthorized)
		Info.Printf("authentication failed: %v", boxID)
		return
	}

	session.Values[boxID] = uuid.New().String()
	session.Options.HttpOnly = true
	session.Options.Secure = true
	if err := session.Save(r, w); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		Error.Printf("Save: %v", err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
