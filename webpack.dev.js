'use strict';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    mode: 'development',
    watchOptions: {
        aggregateTimeout: 200,
        ignored: /node_modules/,
        poll: 1000
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public/'),
        open: true,
        compress: true,
        historyApiFallback: true,
        host: 'localhost',
        port: 8080
    },
    stats: {

        // Add asset Information
        assets: false,

        // Sort assets by a field
        // You can reverse the sort with `!field`.
        assetsSort: "field",

        // Add build date and time information
        builtAt: true,

        // Add information about cached (not built) modules
        cached: true,

        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets: false,

        // Add children information
        children: false,

        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: true,

        // Add namedChunkGroups information
        chunkGroups: true,

        // Add built modules information to chunk information
        chunkModules: true,

        // Add the origins of chunks and chunk merging info
        chunkOrigins: false,

        // Sort the chunks by a field
        // You can reverse the sort with `!field`. Default is `id`.
        chunksSort: "field",

        // `webpack --colors` equivalent
        colors: true,

        // Display the distance from the entry point for each module
        depth: false,

        // Display the entry points with the corresponding bundles
        entrypoints: false,

        // Add --env information
        env: false,

        // Add errors
        errors: true,

        // Add details to errors (like resolving log)
        errorDetails: true,

        // Add the hash of the compilation
        hash: true,

        // Add built modules information
        modules: true,

        // Sort the modules by a field
        // You can reverse the sort with `!field`. Default is `id`.
        modulesSort: "field",

        // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
        moduleTrace: true,

        // Show performance hint when file size exceeds `performance.maxAssetSize`
        performance: true,

        // Show the exports of the modules
        providedExports: false,

        // Add public path information
        publicPath: true,

        // Add information about the reasons why modules are included
        reasons: true,

        // Add the source code of modules
        source: false,

        // Add timing information
        timings: true,

        // Show which exports of a module are used
        usedExports: false,

        // Add webpack version information
        version: true,

        // Add warnings
        warnings: true
    },
});

