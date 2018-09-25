const path = require('path');

module.exports = {
    // the base directory (absolute path) for resolving the entry option
    context: __dirname,
    // the entry point we created earlier. Note that './' means your current
    // directory. You don't have to specify the extension  now, because you will
    // specify extensions later in the `resolve` section
    entry: './src/index.jsx',

    output: {
        // where you want your compiled bundle to be stored
        path: path.resolve('./dist/'),
        // naming convention webpack should use for your files
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'src'),
                // we definitely don't want babel to transpile all the files in node_modules.
                // That would take a long time.
                exclude: /node_modules/,
                // use the babel loader
                loader: 'babel-loader'
            }
        ]
    },

    resolve: {
        // tells webpack where to look for modules
        modules: ['node_modules'],
        // extensions that should be used to resolve modules
        extensions: ['*', '.js', '.jsx']
    },
    watchOptions: {
        poll: true
    },
    devServer: {
        contentBase: './dist'
    }
};
