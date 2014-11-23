var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: './src/main',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'organon.js',
        library: 'organon',
        libraryTarget: 'umd'
    },
    externals: {
        lodash: true,
        jquery: true,
        bacon: true,
        'bacon.model': 'commonjs bacon.model',
        'bacon.jquery': 'commonjs bacon.jquery',
        'bacon.matchers': 'commonjs bacon.matchers',
        'bacon.localForage': 'commonjs bacon.localForage',
        'html5-history-api': 'amd html5-history-api'
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            Bacon: 'bacon',
            'Bacon.localforage': 'bacon.localForage'
        })
    ]
};
