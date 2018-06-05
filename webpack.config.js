const path = require('path');

module.exports = {
    mode: 'development',
    entry: ['babel-polyfill', './src/emiya-canvas.js'],
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'emiya-canvas.bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: /src/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    }
};