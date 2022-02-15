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
 * 認証API
 */
const express = require("express");
const base_1 = require("../../functions/base");
const util_1 = require("../../functions/util");
const axios_1 = require("axios");
const querystring_1 = require("querystring");
const router = express.Router();
/**
 * 認証情報取得(API版)
 */
router.post('/getCredentailsApi', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `${process.env.SMART_THEATER_AUTH_ENDPOINT}/oauth2/token`;
        const form = {
            state: util_1.generateUuid(),
            grant_type: 'client_credentials',
        };
        const secret = Buffer.from(`${process.env.CLIENT_CREDENTIALS_CLIENT_ID}:${process.env.CLIENT_CREDENTIALS_CLIENT_SECRET}`, 'utf8').toString('base64');
        const result = (yield axios_1.default.post(url, querystring_1.stringify(form), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${secret}`,
            },
        })).data;
        res.json({ accessToken: result.access_token, tokenType: result.token_type, expiryDate: result.expires_in });
    }
    catch (error) {
        base_1.errorProsess(res, error);
    }
}));
exports.authorizeRouter = router;
