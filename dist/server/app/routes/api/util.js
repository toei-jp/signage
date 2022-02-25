"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * API
 */
const debug = require("debug");
const express = require("express");
const httpStatus = require("http-status");
const moment = require("moment");
const log = debug('application: /api/util');
const router = express.Router();
/**
 * プロジェクト設定取得
 */
router.post('/project', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    log('project', req.body);
    if (process.env.PROJECT_ID !== undefined && process.env.PROJECT_ID !== '') {
        res.json({
            projectId: process.env.PROJECT_ID,
            projectName: process.env.PROJECT_NAME,
            storageUrl: process.env.PROJECT_STORAGE_URL,
            gmoTokenUrl: process.env.GMO_TOKEN_URL,
            env: process.env.APP_ENV,
        });
        return;
    }
    res.json({
        storageUrl: process.env.STORAGE_URL,
        gmoTokenUrl: process.env.GMO_TOKEN_URL,
        env: process.env.APP_ENV,
    });
}));
/**
 * サーバータイム取得
 */
router.get('/serverTime', (_req, res) => {
    log('serverTime');
    res.json({ date: moment().toISOString() });
});
/**
 * バージョン取得
 */
router.get('/version', (_req, res) => {
    log('version');
    res.json({ version: process.env.VERSION });
});
/**
 * ヘルスチェック
 */
router.get('/health', (_req, res) => {
    res.status(httpStatus.OK);
    res.send(`${httpStatus.OK} ${httpStatus[200]}`);
});
/**
 * 設定取得
 */
router.get('/config', (_req, res) => {
    // 以下の値を削除する場合は、クライアント側の判定文(misc.tsのfetchEnv())更新がデプロイされた後に
    // 削除されるようにすること。そうしないとクライアントのオートリロードがうまくいかなくなる。
    res.json({
        STATUS_THRESHOLD_CROWDED: process.env.STATUS_THRESHOLD_CROWDED,
        STATUS_THRESHOLD_OUTOFDATE: process.env.STATUS_THRESHOLD_OUTOFDATE,
        CINERINO_SCHEDULE_FETCH_TIMEOUT: process.env.CINERINO_SCHEDULE_FETCH_TIMEOUT,
        authConfig: {
            userPoolId: process.env.COGNITO_USER_POOL_ID,
            userPoolWebClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        },
        cognitoUser: {
            userId: process.env.COGNITO_USER_ID,
            password: process.env.COGNITO_USER_PASSWORD,
        },
        SMART_THEATER_API_ENDPOINT: process.env.SMART_THEATER_API_ENDPOINT,
        CINERINO_API_ENDPOINT: process.env.CINERINO_API_ENDPOINT,
        BUILD_TIMESTAMP: process.env.BUILD_TIMESTAMP,
        ENV_LAST_MODIFIED: process.env.ENV_LAST_MODIFIED,
        ENV: process.env.APP_ENV,
        PROJECT_ID: process.env.PROJECT_ID,
    });
});
exports.utilRouter = router;
