const path = require('path');

module.exports = {
    entry: {
        game: './src/public/tsrc/app.ts'
    },
    output: {
        filename: 'tscgame.js',
        path: path.join(__dirname , '/src/public/scripts')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};