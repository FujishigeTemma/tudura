package function

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type postBoxRequest struct {
	Name     string `json:"name" db:"name"`
	Password string `json:"password" db:"password"`
}

type box struct {
	ID               string    `json:"id" db:"id"`
	Name             string    `json:"name" db:"name"`
	PasswordRequired bool      `json:"passwordRequired" db:"password_required"`
	UpdatedAt        time.Time `json:"updatedAt" db:"updated_at"`
}

// PostBoxHandler POST /boxes ボックスの作成
func PostBoxHandler(w http.ResponseWriter, r *http.Request) {
	clientOnce.Do(func() {
		var err error
		dbPool, err = getDBPool()
		if err != nil {
			http.Error(w, "Error initializing database", http.StatusInternalServerError)
			Error.Printf("getDBPool(): %s", err)
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

	var req postBoxRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		Error.Printf("json.NewDecoder: %s", err)
		return
	}

	if len(req.Name) <= 0 || len(req.Name) > 32 {
		http.Error(w, "Box Name must be between 1 and 32 characters.", http.StatusBadRequest)
		Info.Printf("box name length error: %s", req.Name)
		return
	}

	if len(req.Password) != 0 {
		if len(req.Password) < 8 {
			http.Error(w, "Password must be at least 8 characters.", http.StatusBadRequest)
			Info.Printf("password length error: %s", req.Name)
			return
		}
		hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Internl Server Error", http.StatusInternalServerError)
			Error.Printf("bcrypt.GenerateFromPassword: %s", err)
			return
		}
		id, err := uuid.NewRandom()
		if err != nil {
			http.Error(w, "Internl Server Error", http.StatusInternalServerError)
			Error.Printf("uuid.NewRandom: %s", err)
			return
		}
		if _, err := dbPool.Exec("INSERT INTO boxes(`id`, `name`, `hashed_pass`) VALUES (?, ?, ?)", id.String(), req.Name, hashed); err != nil {
			http.Error(w, "DB Error", http.StatusInternalServerError)
			Error.Printf("error occured when INSERT box record: %s", err)
			return
		}
		var createdBox box
		if err := dbPool.Get(&createdBox, "SELECT id, name, CASE WHEN hashed_pass IS NOT NULL THEN 1 ELSE 0 END AS password_required, updated_at FROM boxes WHERE id = ?", id.String()); err != nil {
			http.Error(w, "DB Error", http.StatusInternalServerError)
			Error.Printf("error occured when SELECT created box record: %s", err)
			return
		}

		res, err := json.Marshal(createdBox)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			Error.Printf("json.Marshal: %s", err)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(res)
	}

	id, err := uuid.NewRandom()
	if err != nil {
		http.Error(w, "Internl Server Error", http.StatusInternalServerError)
		Error.Printf("uuid.NewRandom: %s", err)
		return
	}
	if _, err := dbPool.Exec("INSERT INTO boxes(`id`, `name`) VALUES (?, ?)", id.String(), req.Name); err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when INSERT box record: %s", err)
	}
	var createdBox box
	if err := dbPool.Get(&createdBox, "SELECT id, name, CASE WHEN hashed_pass IS NOT NULL THEN 1 ELSE 0 END AS password_required, updated_at FROM boxes WHERE id = ?", id.String()); err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		Error.Printf("error occured when SELECT created box record: %s", err)
		return
	}

	res, err := json.Marshal(createdBox)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		Error.Printf("json.Marshal: %s", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}
