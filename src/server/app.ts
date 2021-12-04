import express from 'express';
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { App } from '../frontend/components/app'

const app = express();
const port = 3000;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use('/', express.static(path.join(__dirname, 'static')))

const manifest = fs.readFileSync(
    path.join(__dirname, 'static/manifest.json'),
    'utf-8'
)
const assets = JSON.parse(manifest)


app.get('/', (req, res) => {
    const component = ReactDOMServer.renderToString(React.createElement(App))
    res.render('app', { assets, component })
})

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});

