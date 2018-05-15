let config;

if (process.env.NODE_ENV === 'development') {
    config = require('./node_modules/butter-component-builder/webpack/webpack.dev.config.js')
} else {
    config = require('./node_modules/butter-component-builder/webpack/webpack.build.config.js')
}

module.exports = Object.assign(config, {
    target: 'electron-main',
    entry: Object.assign(config.entry, {index: `${__dirname}/electron/index.js`}),
    externals: {},
    output: {
        path: __dirname + '/build',
        publicPath: 'build/',
        filename: '[name].js'
    },
})
