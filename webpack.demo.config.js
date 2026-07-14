// Builds a self-contained bundle of the real SeqViz component for the static
// docs explorer (docs/assets/seqviz-standalone.js). Unlike the package build,
// this inlines React, ReactDOM and seqviz (no externals) and imports the
// component implementation directly (no async chunk), so it runs on a plain
// HTML page with no Dash runtime.
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/demo/standalone.js',
    output: {
        path: path.resolve(__dirname, 'docs/assets'),
        filename: 'seqviz-standalone.js',
        library: 'DashSeqVizStandalone',
        libraryTarget: 'window',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {loader: 'babel-loader'},
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    performance: {hints: false},
};
