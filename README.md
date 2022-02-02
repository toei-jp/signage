# toei_signage_frontend
TOEIサイネージ用フロントエンド(サーバの環境変数を読むための単品PHP以外は全て静的ファイル)
前提としてデプロイ先にはBasic認証をかける(`/public/web.config`で設定)
→STBは入力装置を持たないのでURLにIDとパスを載せる形で認証する

Cinerinoクライアントはラッパー(`/src/plugins/cinerio.js`)を介して利用する
- Cognito認証処理は確実化のため全て`aws-amplify`で行う(ユーザープールに専用クライアントとユーザーを作成してUSER_PASSWORD_AUTH認証する)

CinerinoAPI利用のためのCognito認証情報はサーバの環境変数にしてアプリ初期化時に`GET /env`(`/public/env/index.php`)で取得する。
→ローカル開発時はdevServerのbeforeフックで値を拾う

CinerinoクライアントはfetchAPIを使っているので外付けタイムアウトを`CINERINO_SCHEDULE_FETCH_TIMEOUT`ミリ秒で設定する

現場に再起動操作を強いる状況を減らすため、認証や情報取得に失敗しても1分おきにリトライし続ける
環境変数を3分おきに取得して、変更を検知したらリロードする

BrightSignは`window.navigator.onLine`とOnline/Offlineイベントが機能しないので注意する
(LANケーブルが抜けている状況でタイムアウト設定の無い通信をすると永久に通信を試みて詰む)

フォントファイル(`TTHiraginoUDSansFStdN-W3.ttf`)はBrightSign本体に埋め込んでアップロードはしない。

## Usage
Auzre Web Appsにgitデプロイ、ドキュメントルートを`site\wwwroot\dist`に設定、次項の環境変数をセット。
STBで開くURLに`https://${basic認証ID}:${basic認証パスワード}@********.azurewebsites.net/#/view/${劇場のbranchCode}`を指定。

## Environment Variables
```
set STATUS_THRESHOLD_CROWDED=**********「〇」が「△」になる残席閾パーセント(デフォルト=30)**********
set STATUS_THRESHOLD_OUTOFDATE=**********上映開始(`startDate`)の何分後にその枠を表示から消すか(※販売の`validThrough`が表示リミット時刻なのは不変)(デフォルト=20)**********
set CINERINO_SCHEDULE_FETCH_TIMEOUT=**********CinerinoAPIへの上映情報のfetchのタイムアウトms(デフォルト=50000)**********
set CINERINO_API_ENDPOINT=**********CinerinoAPIのエンドポイント**********
set ENV_LAST_MODIFIED=**********遠隔リロード命令用の適当な文字列**********
set CLIENT_CREDENTIALS_CLIENT_ID=**********認証クライアントID**********
set CLIENT_CREDENTIALS_CLIENT_SECRET=**********認証クライアントシークレット**********
set CLIENT_CREDENTIALS_DOMAIN=**********認可サーバードメイン**********
set PROJECT_ID=**********プロジェクトID**********
set APP_ENV=**********アプリケーション環境**********
```

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
