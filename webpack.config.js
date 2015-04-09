var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: './src',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'organon.js',
        library: 'organon',
        libraryTarget: 'umd'
    },
    externals: [
        {
            lodash: {
                root: '_',
                commonjs: 'lodash',
                commonjs2: 'lodash',
                amd: 'lodash'
            },
            jquery: {
                root: 'jQuery',
                commonjs: 'jquery',
                commonjs2: 'jquery',
                amd: 'jquery'
            },
            bacon: {
                root: 'Bacon',
                commonjs: 'bacon',
                commonjs2: 'bacon',
                amd: 'bacon'
            },
            'bacon.jquery': {
                root: ['Bacon', '$'],
                commonjs: 'bacon.jquery',
                commonjs2: 'bacon.jquery',
                amd: 'bacon.jquery'
            },
            'bacon.matchers': {
                root: 'Bacon',
                commonjs: 'bacon.matchers',
                commonjs2: 'bacon.matchers',
                amd: 'bacon.matchers'
            },
            'html5-history-api': {
                root: 'history',
                commonjs: 'html5-history-api',
                commonjs2: 'html5-history-api',
                amd: 'html5-history-api'
            }
        }
    ],
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            Bacon: 'bacon'
        })
    ]
};
