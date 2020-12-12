package cmd

import "cloud.google.com/go/spanner"

// テーブルの作成
var CreateTables = []string{
	`CREATE TABLE Box (
		Id STRING(36) NOT NULL,
		Name STRING(1024) NOT NULL,
		LastName   STRING(1024),
		SingerInfo BYTES(MAX)
	) PRIMARY KEY (SingerId)`,
	`CREATE TABLE Albums (
		SingerId     INT64 NOT NULL,
		AlbumId      INT64 NOT NULL,
		AlbumTitle   STRING(MAX)
	) PRIMARY KEY (SingerId, AlbumId),
	INTERLEAVE IN PARENT Singers ON DELETE CASCADE`,
}

// 初期データの投入
var singerColumns = []string{"SingerId", "FirstName", "LastName"}
var albumColumns = []string{"SingerId", "AlbumId", "AlbumTitle"}
var AddRecords = []*spanner.Mutation{
	spanner.InsertOrUpdate("Singers", singerColumns, []interface{}{1, "Marc", "Richards"}),
	spanner.InsertOrUpdate("Singers", singerColumns, []interface{}{2, "Catalina", "Smith"}),
	spanner.InsertOrUpdate("Singers", singerColumns, []interface{}{3, "Alice", "Trentor"}),
	spanner.InsertOrUpdate("Singers", singerColumns, []interface{}{4, "Lea", "Martin"}),
	spanner.InsertOrUpdate("Singers", singerColumns, []interface{}{5, "David", "Lomond"}),
	spanner.InsertOrUpdate("Albums", albumColumns, []interface{}{1, 1, "Total Junk"}),
	spanner.InsertOrUpdate("Albums", albumColumns, []interface{}{1, 2, "Go, Go, Go"}),
	spanner.InsertOrUpdate("Albums", albumColumns, []interface{}{2, 1, "Green"}),
	spanner.InsertOrUpdate("Albums", albumColumns, []interface{}{2, 2, "Forever Hold Your Peace"}),
	spanner.InsertOrUpdate("Albums", albumColumns, []interface{}{2, 3, "Terrified"}),
}

// 投入データの確認(SQLの実行)
var ExecSQLQuery = spanner.Statement{SQL: `SELECT SingerId, AlbumId, AlbumTitle FROM Albums`}

// カラムの追加
var AddColumnsQuery = []string{
	"ALTER TABLE Albums ADD COLUMN MarketingBudget INT64",
}

// レコードの編集
var cols = []string{"SingerId", "AlbumId", "MarketingBudget"}
var UpdateRecords = []*spanner.Mutation{
	spanner.Update("Albums", cols, []interface{}{1, 1, 100000}),
	spanner.Update("Albums", cols, []interface{}{2, 2, 500000}),
}

// レコードの追加(SQLの実行)
var AddRecordsQuery = spanner.Statement{
	SQL: `INSERT Singers (SingerId, FirstName, LastName) VALUES
				(12, 'Melissa', 'Garcia'),
				(13, 'Russell', 'Morales'),
				(14, 'Jacqueline', 'Long'),
				(15, 'Dylan', 'Shaw')`,
}
