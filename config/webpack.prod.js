const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin')
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const API_URL = process.env.API_URL || 'api';
const METADATA = webpackMerge(commonConfig({
    env: ENV
}).metadata, {
        host: HOST,
        port: PORT,
        ENV: ENV,
        HMR: false,
        API_URL: API_URL
    });

module.exports = function (env) {

    return webpackMerge(commonConfig({
        env: ENV
    }), {

            devtool: 'source-map',

            output: {

                path: helpers.root('wwwroot'),

                filename: '[name].[chunkhash].bundle.js',

                sourceMapFilename: '[file].map',

                chunkFilename: '[id].[chunkhash].chunk.js'

            },

            module: {

                rules: [

                    {
                        test: /\.css$/,
                        loader: ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            use: 'css-loader'
                        }),
                        include: [helpers.root('src', 'styles')]
                    },

                    {
                        test: /\.scss$/,
                        loader: ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            use: 'css-loader!sass-loader'
                        }),
                        include: [helpers.root('src', 'styles')]
                    },

                ]

            },

            plugins: [

                new OptimizeJsPlugin({
                    sourceMap: false
                }),

                new ExtractTextPlugin('[name].[contenthash].css'),
                
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

                new UglifyJsPlugin({
                    beautify: false, //prod
                    output: {
                        comments: false
                    },
                    mangle: {
                        screw_ie8: true
                    },
                    compress: {
                        screw_ie8: true,
                        warnings: false,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true,
                        negate_iife: false
                    }
                }),

                new NormalModuleReplacementPlugin(
                    /angular2-hmr/,
                    helpers.root('config/empty.js')
                ),

                new NormalModuleReplacementPlugin(
                    /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
                    helpers.root('config/empty.js')
                ),

                new HashedModuleIdsPlugin(),

                new LoaderOptionsPlugin({
                    minimize: true,
                    debug: false,
                    options: {

                        htmlLoader: {
                            minimize: true,
                            removeAttributeQuotes: false,
                            caseSensitive: true,
                            customAttrSurround: [
                                [/#/, /(?:)/],
                                [/\*/, /(?:)/],
                                [/\[?\(?/, /(?:)/]
                            ],
                            customAttrAssign: [/\)?\]?=/]
                        }
                    }
                }),
            ],
            
            node: {
                global: true,
                crypto: 'empty',
                process: false,
                module: false,
                clearImmediate: false,
                setImmediate: false
            }

        });
}
