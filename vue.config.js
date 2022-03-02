module.exports = {
    outputDir: 'dist/client',
    pages: {
        index: {
            entry: 'src/client/app/main.ts',
            template: 'public/index.html',
            filename: 'index.html',
        },
    },
    filenameHashing: true,
    devServer: {
        host: '0.0.0.0',
        port: 6789,
        before: (app) => {
            app.get('/env', (req, res) => {
                res.json({
                    STATUS_THRESHOLD_CROWDED: process.env.STATUS_THRESHOLD_CROWDED,
                    STATUS_THRESHOLD_OUTOFDATE: process.env.STATUS_THRESHOLD_OUTOFDATE,
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
