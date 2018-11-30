var express = require('express');
var webpack = require('webpack');
var webpackConfig = require('./webpack.development');
var colors = require('colors');
var proxy = require("http-proxy-middleware");
var config = require('../configs');
const openBrowser = require('react-dev-utils/openBrowser');
var app = express();
var compiler = webpack(webpackConfig);

compiler.plugin('done', (status) => {
    let message = status.toJson();
    if (!message.errors.length && !message.warnings.length) {
        console.log('\r\n编译完成');
        var url = `http://localhost:${app.get('port')}${webpackConfig.output.publicPath}`;
        console.log(url);
    }
    else {
        if (message.errors.length) {
            console.log('--------------------------错误------------------------\r'.red);
            console.log(message.errors.join('\r'));
        }
        if (message.warnings.length) {
            console.log('--------------------------警告------------------------\r'.yellow);
            console.log(message.warnings.join('\r'));
        }
    }
});

compiler.plugin('invalid', () => {
    console.log('开始编译...');
});

app.use(require('webpack-dev-middleware')(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    historyApiFallback: true,
    compress: true,
    noInfo: true,
    logLevel: 'silent',
    stats: "errors-only",
}));

if (config.PROXY_OPTION) {
    for (let key in config.PROXY_OPTION) {
        app.use(key, proxy(config.PROXY_OPTION[key]));
    }
}

app.use(require('webpack-hot-middleware')(compiler, { log: false, publicPath: webpackConfig.output.publicPath }));

app.set('port', process.env.PORT || config.PORT);

if (app.get('env') === 'production') {
    app.use(function (req, res, next) {
        console.log('request');
        var protocol = req.get('x-forwarded-proto');
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}

app.listen(app.get('port'), (err) => {
    if (err) {
        console.log(err);
    }
    var url = `http://localhost:${app.get('port')}${webpackConfig.output.publicPath}`;
    openBrowser(url);
    console.log('编译中，请稍候...        ');
});
