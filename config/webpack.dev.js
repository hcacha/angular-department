const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const AutoDllPlugin = require('autodll-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
const API_URL = process.env.API_URL;

const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
    host: HOST,
    port: PORT,
    API_URL: API_URL,
    ENV: ENV,
    HMR: HMR
});

module.exports = function (options) {
    return webpackMerge(commonConfig({ env: ENV }), {

        devtool: 'cheap-module-source-map',

        output: {

            path: helpers.root('wwwroot'),

            filename: '[name].bundle.js',

            sourceMapFilename: '[file].map',

            chunkFilename: '[id].chunk.js',

            library: 'ac_[name]',
            libraryTarget: 'var',
        },

        module: {

            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                    include: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    include: [helpers.root('src', 'styles')]
                },

            ]

        },

        plugins: [
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                    'API_URL': JSON.stringify(METADATA.API_URL)
                }
            }),
            new AutoDllPlugin({
                debug: true,
                inject: true,
                context: helpers.root(),
                filename: '[name]_[hash].js',
                path: './dll',
                entry: {
                    polyfills: [
                        'core-js',
                        'zone.js/dist/zone.js',
                        'zone.js/dist/long-stack-trace-zone'
                    ],
                    vendor: [
                        '@angular/platform-browser',
                        '@angular/platform-browser/animations',
                        '@angular/platform-browser-dynamic',
                        '@angular/core',
                        '@angular/common',
                        '@angular/forms',
                        '@angular/http',
                        '@angular/router',
                        '@angularclass/hmr',
                        'hammerjs',
                        'rxjs'
                    ]
                }
            }),

            new LoaderOptionsPlugin({
                debug: true,
                options: {

                }
            }),

        ],

        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {        
                ignored: /node_modules/
            },
            
            setup: function (app) {
            
            }
        },

        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    });
}
