const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/GrassMain.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.obj$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(vert|frag)$/i,
                type: 'asset/source',
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'GrassMain.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: path.resolve("/") 
    },
    experiments: {
        topLevelAwait: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '.'),
        },
        port: 8080,
    },
};