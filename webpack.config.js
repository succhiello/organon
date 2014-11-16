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
        'lodash': '_',
        'jquery': 'jQuery',
        'baconjs': 'Bacon',
        'bacon.localforage': 'Bacon.localforage'
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            Bacon: 'baconjs',
            'Bacon.localforage': 'bacon.localforage'
        })
    ]
};
