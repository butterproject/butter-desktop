const path = require('path')
let config;

const bcp_path = path.join(process.cwd(), 'node_modules/butter-component-builder')
if (process.env.NODE_ENV === 'development') {
    config = require(`${bcp_path}/webpack/webpack.dev.config.js`)
} else {
    config = require(`${bcp_path}/webpack/webpack.build.config.js`)
}

module.exports = Object.assign(config, {
    target: 'electron-main',
    entry: Object.assign(config.entry, {index: `${__dirname}/electron/index.js`}),
    externals: {},
    output: {
        path:path.join(process.cwd(), 'build'),
        publicPath: 'build/',
        filename: '[name].js'
    }
})
