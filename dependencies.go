package function

import (
	"github.com/jmoiron/sqlx"
	"log"
	"os"
	"sync"
)

// projectID is set from the GCP_PROJECT environment variable,
// which is automatically set by the Cloud Functions runtime.

var (
	clientOnce sync.Once
	dbPool     *sqlx.DB

	Trace   *log.Logger
	Info    *log.Logger
	Warning *log.Logger
	Error   *log.Logger
)

func init() {
	Trace = log.New(os.Stdout, "TRACE: ", log.Ldate|log.Ltime|log.Lshortfile)
	Info = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	Warning = log.New(os.Stdout, "WARNING: ", log.Ldate|log.Ltime|log.Lshortfile)
	Error = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Llongfile)
}
