var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: './src/main',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'organon.js',
        library: 'organon',
        libraryTarget: 'var'
    },
    externals: {
        lodash: '_',
        jquery: 'jQuery',
        bacon: 'Bacon',
        'html5-history-api': 'history'
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            Bacon: 'bacon',
            history: 'html5-history-api'
        })
    ]
};
