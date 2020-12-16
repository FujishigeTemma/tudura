package function

import (
	"context"
	"log"
	"os"
	"sync"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	fg "github.com/GoogleCloudPlatform/firestore-gorilla-sessions"
	"github.com/jmoiron/sqlx"
)

// projectID is set from the GCP_PROJECT environment variable,
// which is automatically set by the Cloud Functions runtime.

var (
	clientOnce    sync.Once
	dbPool        *sqlx.DB
	storageClient *storage.Client
	session       *fg.Store

	Trace   *log.Logger
	Info    *log.Logger
	Warning *log.Logger
	Error   *log.Logger
)

var ctx = context.Background()
var bucketName = getEnv("BUCKET", "tudura")
var projectID = getEnv("PROJECT_ID", "tudura")
var tuduraSessionName = getEnv("TUDURA_SESSION_NAME", "t_session")

func init() {
	Trace = log.New(os.Stdout, "TRACE: ", log.Ldate|log.Ltime|log.Lshortfile)
	Info = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	Warning = log.New(os.Stdout, "WARNING: ", log.Ldate|log.Ltime|log.Lshortfile)
	Error = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Llongfile)
}

func setup() error {
	var err error
	dbPool, err = getDBPool()
	if err != nil {
		Error.Printf("getDBPool(): %s", err)
		return err
	}
	storageClient, err = storage.NewClient(ctx)
	if err != nil {
		Error.Printf("storage.NewClient: %v", err)
		return err
	}
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		Error.Printf("firestore.NewClient: %v", err)
		return err
	}
	session, err = fg.New(ctx, client)
	if err != nil {
		Error.Printf("fg.NewClient: %v", err)
		return err
	}
	return nil
}

//http.Error(w, "Error initializing sessionStorage", http.StatusInternalServerError)
