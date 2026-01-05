'use strict';

const path = require('path');

module.exports = {
    mode: 'development',
    entry: './js/script.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/js'
    },
    resolve: {
        extensions: ['.js']
    },

    watch: true,

    devtool: "source-map",

    module: {
        rules: []
    }
};