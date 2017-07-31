const webpack = require('webpack');
const helpers = require('./helpers');

const AssetsPlugin = require('assets-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ngcWebpack = require('ngc-webpack');

const HMR = helpers.hasProcessFlag('hot');
const AOT = process.env.BUILD_AOT || helpers.hasNpmFlag('aot');
const METADATA = {
    title: 'Angular department',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer(),
    HMR: HMR
};

module.exports = function (options) {
    isProd = options.env === 'production';
    return {
        entry: {
            'polyfills': './src/polyfills.browser.ts',
            'main': './src/main.browser.ts'
        },
        resolve: {
            extensions: ['.ts', '.js', '.json'],

            modules: [helpers.root('src'), helpers.root('node_modules')],

            alias: {}
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: '@angularclass/hmr-loader',
                            options: {
                                pretty: !isProd,
                                prod: isProd
                            }
                        },
                        {

                            loader: 'ng-router-loader',
                            options: {
                                loader: 'async-import',
                                genDir: 'compiled',
                                aot: AOT
                            }
                        },
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: 'tsconfig.webpack.json',
                                useCache: !isProd
                            }
                        },
                        {
                            loader: 'angular2-template-loader'
                        }
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/]
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.css$/,
                    use: ['to-string-loader', 'css-loader'],
                    exclude: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.scss$/,
                    use: ['to-string-loader', 'css-loader', 'sass-loader'],
                    exclude: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader',
                    exclude: [helpers.root('src/index.html')]
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                    use: 'file-loader'
                }
            ]
        },

        plugins: [
            new CheckerPlugin(),
            new CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills']
            }),
            new CommonsChunkPlugin({
                name: ['polyfills', 'vendor'].reverse()
            }),
            new ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)@angular/,
                helpers.root('src'),
                {
                    // your Angular Async Route paths relative to this root directory
                }
            ),
            new CopyWebpackPlugin([
                { from: 'src/assets', to: 'assets' },
                { from: 'src/meta' }
            ],
                undefined
                // isProd ? { ignore: ['mock-data/**/*'] } : undefined
            ),
            new ScriptExtHtmlWebpackPlugin({
                sync: /polyfill|vendor/,
                defaultAttribute: 'async',
                preload: [/polyfill|vendor|main/],
                prefetch: [/chunk/]
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                title: METADATA.title,
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'body'
            }),
            new HtmlElementsPlugin({
                headTags: require('./head-config.common')
            }),
            new LoaderOptionsPlugin({}),
            new ngcWebpack.NgcWebpackPlugin({
                /**
                 * If false the plugin is a ghost, it will not perform any action.
                 * This property can be used to trigger AOT on/off depending on your build target (prod, staging etc...)
                 *
                 * The state can not change after initializing the plugin.
                 * @default true
                 */
                disabled: !AOT,
                tsConfig: helpers.root('tsconfig.webpack.json'),
                resourceOverride: helpers.root('config/resource-override.js')
            }),
            new InlineManifestWebpackPlugin()
        ],
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    }
}
