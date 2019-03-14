'use strict';

const path = require('path');
const webpack = require('webpack');

// Plugins

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Variables

const isDevMode = process.argv[process.argv.indexOf('--mode') + 1] === 'development';

const sources = {
    output: path.resolve(__dirname, 'public')
};

const entry = {
    pollyfill: 'babel-polyfill',
    main: './resources/main.js'
};

const output = {
    publicPath: sources.publicPath,
    filename: isDevMode ? 'js/[name].js' : 'js/[name]-[hash].js',
    path: sources.output
};

const splitChunks = {
    chunks: 'all',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 10,
    maxInitialRequests: 5,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'all',
            reuseExistingChunk: true,
            automaticNameDelimiter: '~'
        }
    }
};

// Plugins

const plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './resources/template.html'
    }),
    new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, 'resources/images/'),
            to: path.resolve(__dirname, 'public/images/'),
            toType: 'dir'
        },
        {
            from: path.resolve(__dirname, 'resources/fonts/'),
            to: path.resolve(__dirname, 'public/fonts/'),
            toType: 'dir'
        }
    ]),

    new CleanWebpackPlugin(),

    new webpack.ProvidePlugin({
        $: 'jquery'
    }),

    new MiniCssExtractPlugin({
        filename: isDevMode ? 'css/[name].css' : 'css/[name].[hash].css',
        // chunkFilename: isDevMode ? 'css/[id].css' : 'css/[id].[hash].css'
    }),
    new WebpackNotifierPlugin({
        excludeWarnings: true,
        title: 'Webpack',
        alwaysNotify: true,
    })
];

// File rules

const jsRules = {
    test: /\.js$/,
    exclude: /node_modules/,
    include: path.resolve(__dirname, 'resources/js/frontend/'),
    use: [
        {
            loader: 'babel-loader'
        },
        {
            loader: 'eslint-loader',
            options: {
                configFile: 'eslint.json',
                formatter: require('eslint-formatter-friendly'),
                failOnError: true,
                parserOptions: {
                    ecmaVersion: 2017
                }
            }
        }
    ]
};

const sassRules = {
    test: /\.scss$/,
    use: [
        isDevMode
            ? {
                loader: "style-loader",
                options: {
                    sourceMap: true
                }
            }
            : MiniCssExtractPlugin.loader,
        {
            loader: "css-loader",
            options: {
                sourceMap: true
            }
        },
        {
            loader: "postcss-loader",
            options: {
                sourceMap: true
            }
        },
        {
            loader: "resolve-url-loader",
            options: {
                keepQuery: true
            }
        },
        {
            loader: "sass-loader",
            options: {
                sourceMap: true
            }
        }

    ]
};

const htmlRules = {
    test: /\.(html)$/,
    include: path.join(__dirname, 'resources'),
    use: {
        loader: 'html-loader',
        options: {
            interpolate: true
        }
    }
};

const imagesRules = {
    test: /\.(svg|gif|png|jpg|jpeg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: {
        loader: 'file-loader',
        options: {
            outputPath: 'images',
            name: '[name].[ext]'
        }
    }
};

const fontsRules = {
    test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: {
        loader: 'file-loader',
        options: {
            outputPath: '/fonts'
        }
    }
};

// Exports

module.exports = {
    entry: entry,
    output: output,
    plugins: plugins,
    optimization: {
        splitChunks: splitChunks
    },
    module: {
        rules: [jsRules, sassRules, htmlRules, imagesRules, fontsRules]
    }
};
