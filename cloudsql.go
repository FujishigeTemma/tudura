package function

import (
	"github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func getDBPool() (*sqlx.DB, error) {
	mysqlConfig := mysql.NewConfig()
	mysqlConfig.Net = "tcp"
	mysqlConfig.Addr = getEnv("MYSQL_HOST", "127.0.0.1") + ":" + getEnv("MYSQL_PORT", "3306")
	mysqlConfig.User = getEnv("MYSQL_USER", "tudura")
	mysqlConfig.Passwd = getEnv("MYSQL_PASS", "password")
	mysqlConfig.DBName = getEnv("MYSQL_DATABASE", "tudura")
	mysqlConfig.Params = map[string]string{
		"charset":   "utf8mb4",
		"collation": "utf8mb4_bin",
	}
	mysqlConfig.ParseTime = true
	mysqlConfig.InterpolateParams = true

	dbx, err := sqlx.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Set maximum number of connections in idle connection pool.
	dbx.SetMaxIdleConns(5)

	// Set maximum number of open connections to the database.
	dbx.SetMaxOpenConns(7)

	// Set Maximum time (in seconds) that a connection can remain open.
	dbx.SetConnMaxLifetime(1800)

	return dbx, nil
}
