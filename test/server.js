
const
	config = require('./config'),
	express = require('express'),
	fs = require('fs'),
	http = require('http'),
	path = require('path'),
	pug = require('pug')

let app = express(),
	getTemplate = pug.compileFile(path.join(__dirname, './index.pug')),
	template = getTemplate({bundleLink: `http://127.0.0.1:${config.devserverPort}/dist/main.js`})
app.get('/', (req, res) => res.send(template))
app.get('/static/:fileName', (req, res) => res.sendFile(path.join(__dirname, '/static', decodeURIComponent(req.params.fileName))))
app.get('/storage/tmp/:fileName', (req, res) => res.sendFile(path.join(__dirname, '/static/randomImage.jpeg')))
app.get('/testModel/selectList', (req, res) => res.json([
	{text: 'Option 1', value: 1},
	{text: 'Option 2', value: 2},
	{text: 'Option 3', value: 3},
	{text: 'Different Name 4', value: 4},
	{text: 'Different Name 5', value: 5},
	{text: 'Different Name 6', value: 6}
]))
app.post('/files', (req, res) => {
	console.log(req.files)
	res.status(200).end()
})
// app.post('/files', (req, res) => res.pipe(path.join(__dirname, '/static', decodeURIComponent(req.params.fileName))))
let server = http.createServer(app)
server.listen(config.serverPort, () => {
	console.log(`[RUI testApp] Server started.`)
	console.log(`[RUI testApp] Port:`, config.serverPort)
})