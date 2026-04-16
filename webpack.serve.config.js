const configFn = require('./webpack.config.js');
const path = require('path');

const config = configFn(null, { mode: 'development' });

config.entry = { main: './src/demo/index.js' };
config.output = {
    filename: './output.js',
    path: path.resolve(__dirname),
};
config.mode = 'development';
config.externals = undefined; // eslint-disable-line
config.devtool = 'inline-source-map';
module.exports = config;
