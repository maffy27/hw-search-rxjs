const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//тзь const LinkTypePlugin = require('html-webpack-link-type-plugin').HtmlWebpackLinkTypePlugin;
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    mode: 'none',
    entry: './src',
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts', '.js', '.json', '.css']
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: "ts-loader"},
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
}
