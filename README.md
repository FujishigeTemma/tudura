# tudura

## How to Deploy
GCPの以下のサービスを使用するので有効化しておいてください。
- Cloud Functions
- Cloud SQL
- Cloud Storage
- Firestore
- VPC Network
  - Serverless VPC Access

[gcloud](https://cloud.google.com/functions/docs/quickstart)コマンドラインツールを使用するのでインストールしておいてください。

以下、共通のリージョンを使用してください。

1. VPCネットワークの作成
VPCネットワークから新しいネットワークを作成します。
サブネットは作成しなくて構いません。
プライベートサービス接続からIP範囲の割り当てを作成します。
この時、既存のネットワークと重複しないようにしてください。

2. DBの作成
新しいインスタンスを`MySQL 8.0`, プライベートネットワーク(上記で作成したコネクタを使用)で作成します。
CloudStorage上の適当な場所にアップロードした`init.sql`をインポートし、DBの初期化を行います。

3. バケットの作成
Storageから新しいバケットを作成してください。

4. 設定ファイルの作成
`.env.yaml`をプロジェクトルートに作成し、以下の項目を埋めてください。
- PROJECT_ID: プロジェクト名
- BUCKET: バケット名
- INSTANCE_CONNECTION_NAME: サーバレスVPCコネクション名
- MYSQL_HOST: DBのプライベートIP
- MYSQL_PASS: DBのパスワード

例:
```
PROJECT_ID: "tudura"
BUCKET: "tudura"
INSTANCE_CONNECTION_NAME: "tudura:asia-northeast1:tudura-staging"
MYSQL_HOST: "192.168.1.3"
MYSQL_PASS: "p4s5w0rd"
```

5. 関数のデプロイ
`make deploy f={{ 関数名 }}`でデプロイできます。
