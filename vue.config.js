module.exports = {
    filenameHashing: false,
    devServer: {
        host: '0.0.0.0',
        port: 6789,
        before: (app) => {
            app.get('/env', (req, res) => {
                res.json({
                    STATUS_THRESHOLD_CROWDED: process.env.STATUS_THRESHOLD_CROWDED,
                    CINERINO_SCHEDULE_FETCH_TIMEOUT: process.env.CINERINO_SCHEDULE_FETCH_TIMEOUT,
                    authConfig: {
                        userPoolId: process.env.COGNITO_USER_POOL_ID,
                        userPoolWebClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
                    },
                    cognitoUser: {
                        userId: process.env.COGNITO_USER_ID,
                        password: process.env.COGNITO_USER_PASSWORD,
                    },
                    CINERINO_API_ENDPOINT: process.env.CINERINO_API_ENDPOINT,
                });
            });
        },
    },
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: false,
        },
    },
    productionSourceMap: false,
};
