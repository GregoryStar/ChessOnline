const spawn = require('cross-spawn')
const path = require('path')
const webpack = require('webpack')
const webpackConfigFrontend = require('./webpack.config.frontend')
const webpackConfigServer = require('./webpack.config.server')

const compiler = webpack([
    {
        ...webpackConfigFrontend,
        mode: 'development',
        devtool: 'source-map',
        output: {
            ...webpackConfigFrontend.output,
            filename: '[name].js',
        },
    },
    {
        ...webpackConfigServer,
        mode: 'development',
        devtool: 'source-map',
    },
])

let node

compiler.hooks.watchRun.tap('Dev', (compiler) => {
    console.log(`Compiling ${compiler.name} ...`)
    if (compiler.name === 'server' && node) {
        node.kill()
        node = undefined
    }
})

compiler.watch({}, (err, stats) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(stats?.toString('minimal'))
    const compiledSuccessfully = !stats?.hasErrors()
    if (compiledSuccessfully && !node) {
        console.log('Starting Node.js ...')
        node = spawn(
            'node',
            ['--inspect', path.join(__dirname, 'dist/server.js')],
            {
                stdio: 'inherit',
            }
        )
    }
})