require('dotenv').config();

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const plugins = [
    new CleanWebpackPlugin(['static'], { root: __dirname, verbose: false, exclude: ['cache', 'index.htm'] }),
    new CopyWebpackPlugin([
            'assets/index.html',
            'assets/chatstreamed.html',
            'assets/notification-request/notification-request.html'
        ]),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new webpack.DefinePlugin({
        WEBSOCKET_URI: process.env.WEBSOCKET_URI ? `'${process.env.WEBSOCKET_URI}'` : '"wss://www.destiny.gg/ws"',
        API_URI: process.env.API_URI ? `'${process.env.API_URI}'` : '',
        LOGIN_URI: process.env.LOGIN_URI ? `'${process.env.LOGIN_URI}'` : 'false'
    })
];

if( process.env.NODE_ENV !== 'production' ) {
    console.log('\n!!!!!!!!!!!! DEVELOPMENT BUILD !!!!!!!!!!!!\n');
    plugins.push(
        new CopyWebpackPlugin([
            { from: 'assets/dev/chat-embedded.html', to: 'dev/' }
        ])
    );
} else {
    console.log('\n########## PRODUCTION BUILD #############\n');
}

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'static'),
        compress: true,
        port: 8282,
        https: process.env.WEBPACK_DEVSERVER_HTTPS === 'true',
        host: process.env.WEBPACK_DEVSERVER_HOST
    },
    entry: {
        chat: [
            'core-js/es6',
            'jquery',
            'moment',
            'normalize.css',
            'font-awesome/scss/font-awesome.scss',
            './assets/chat/js/notification',
            './assets/chat/img/favicon.png',
            './assets/chat/css/style.scss',
            './assets/chat/css/bbdgg.scss',
            './assets/chat.js'
        ],
        streamchat: [
            'core-js/es6',
            'jquery',
            'moment',
            'normalize.css',
            'font-awesome/scss/font-awesome.scss',
            './assets/chat/js/notification',
            './assets/chat/img/favicon.png',
            './assets/chat/css/style.scss',
            './assets/chat/css/bbdgg.scss',
            './assets/chat/css/onstream.scss',
            './assets/streamchat.js'
        ],
        'notification-request': [
            './assets/notification-request/style.scss',
            './assets/notification-request/persona.png',
            './assets/notification-request/settings-guide.png',
            './assets/notification-request/script.js'
        ]
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: '[name].js'
    },
    plugins: plugins,
    watchOptions: {
        ignored: /node_modules/
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules\/(?!(timestring)\/).*)/,
                loader: 'babel-loader',
                options: { presets: ['es2015'] }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /(-webfont|glyphicons-halflings-regular)\.(eot|svg|ttf|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: { name: 'fonts/[name].[ext]' }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: { name: 'img/[name].[ext]' }
            }
        ]
    },
    resolve: {
        alias: {
            jquery: 'jquery/src/jquery'
        },
        extensions: ['.ts', '.tsx', '.js']
    },
    context: __dirname,
    devtool: false
};
