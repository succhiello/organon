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
        'lodash': '_',
        'jquery': 'jQuery',
        'bacon': 'Bacon'
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            Bacon: 'bacon'
        })
    ]
};
