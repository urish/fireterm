'use strict';

var path = require('path');
var webpack = require('webpack');

var appDir = path.join(__dirname, 'app');

module.exports = {
	context: appDir,
	entry: './index.js',
	output: {
		path: "./dist",
		publicPath: "/",
		filename: "bundle.js"
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel'
		}]
	},
	devServer: {
        contentBase: "./app"
    }
};
