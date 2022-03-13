# Signage

APIの認証情報はサーバの環境変数にしてアプリ初期化時に`GET /env`で取得する。
→ローカル開発時はdevServerのbeforeフックで値を拾う

現場に再起動操作を強いる状況を減らすため、認証や情報取得に失敗しても1分おきにリトライし続ける
環境変数を3分おきに取得して、変更を検知したらリロードする

BrightSignは`window.navigator.onLine`とOnline/Offlineイベントが機能しないので注意する
(LANケーブルが抜けている状況でタイムアウト設定の無い通信をすると永久に通信を試みて詰む)

フォントファイル(`TTHiraginoUDSansFStdN-W3.ttf`)はBrightSign本体に埋め込んでアップロードはしない。

## Usage
STBで開くURLに`https://exmaple.com/#/view/${施設のbranchCode}`を指定。

## Environment Variables

| Name                               | Default | Purpose                                  |
| ---------------------------------- | ------- | ---------------------------------------- |
| `STATUS_THRESHOLD_CROWDED`         | 30      | 「〇」が「△」になる残席閾パーセント      |
| `STATUS_THRESHOLD_OUTOFDATE`       | 20      | 上映開始の何分後にその枠を表示から消すか |
| `SMART_THEATER_API_ENDPOINT`       |         | APIエンドポイント                        |
| `CLIENT_CREDENTIALS_CLIENT_ID`     |         | 認証クライアントID                       |
| `CLIENT_CREDENTIALS_CLIENT_SECRET` |         | 認証クライアントシークレット             |
| `SMART_THEATER_AUTH_ENDPOINT`      |         | 認可サーバードメイン                     |
| `PROJECT_ID`                       |         | プロジェクトID                           |
| `ENV_LAST_MODIFIED`                |         | 遠隔リロード命令用の適当な文字列         |
| `APP_ENV`                          |         | アプリケーション環境                     |

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
