const webpack = require('./node_modules/webpack');

module.exports = {
    filenameHashing: false,
    devServer: {
        host: '0.0.0.0',
        port: 6789,
        before: (app) => {
            app.get('/env.php', (req, res) => {
                res.json({
                    authConfig: {
                        identityPoolId: 'ap-northeast-1:49f4caee-80e0-429a-8f8d-4850b626d96d',
                        region: 'ap-northeast-1',
                        userPoolId: 'ap-northeast-1_R3R4XRoqu',
                        userPoolWebClientId: '23up1g9t83rqdnimn1gluv9a4o',
                    },
                    cognitoUser: {
                        userId: 'signage-development',
                        password: 'M0P!X-signage',
                    },
                    CINERINO_API_ENDPOINT: 'https://toei-cinerino-api-development.azurewebsites.net',
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
    chainWebpack: (config) => {
        config.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/]);
    },
};
