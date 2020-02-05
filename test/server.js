const
	bodyParser = require('body-parser'),
	config = require('./config'),
	express = require('express'),
	fs = require('fs-extra'),
	http = require('http'),
	multipart = require('connect-multiparty'),
	path = require('path'),
	pug = require('pug'),
	sharp = require('sharp')

let app = express(),
	getTemplate = pug.compileFile(path.join(__dirname, './index.pug')),
	template = getTemplate({bundleLink: `http://127.0.0.1:${config.devserverPort}/dist/main.js`})
app.use(bodyParser.json()) // for 'application/json' request bodies
app.use(bodyParser.urlencoded({extended: false})) // 'x-www-form-urlencoded' request bodies
app.use(multipart({limit: '10mb', uploadDir: path.join(__dirname, 'uploads')})) // for multipart bodies - file uploads etc.
app.get('/', (req, res) => res.send(template))
app.get('/static/:fileName', (req, res) => res.sendFile(path.join(__dirname, '/static', decodeURIComponent(req.params.fileName))))
app.get('/storage/tmp/:fileName', (req, res) => res.sendFile(path.join(__dirname, '/uploads', decodeURIComponent(req.params.fileName))))
app.get('/testModel/selectList', (req, res) => res.json([
	{text: 'Option 1', value: 1},
	{text: 'Option 2', value: 2},
	{text: 'Option 3', value: 3},
	{text: 'Different Name 4', value: 4},
	{text: 'Different Name 5', value: 5},
	{text: 'Different Name 6', value: 6}
]))
app.post('/files', (req, res) => {
	(async function() {
		const {imageCroppingOptions, outputFileName} = req.body
		let outputFilePath = path.join(__dirname, '/uploads', outputFileName)
		await fs.rename(req.files.file.path, outputFilePath)
		if (imageCroppingOptions) {
			await sharp(await fs.readFile(outputFilePath)).extract({
				left: parseInt(imageCroppingOptions.startX, 10),
				top: parseInt(imageCroppingOptions.startY, 10),
				width: parseInt(imageCroppingOptions.width, 10),
				height: parseInt(imageCroppingOptions.height, 10)
			}).toFile(outputFilePath)
		}
		res.json({success: true})
	})().then(
		() => true,
		(err) => res.json({error: err})
	)
})
let server = http.createServer(app)
server.listen(config.serverPort, () => {
	console.log(`[RUI testApp] Server started.`)
	console.log(`[RUI testApp] Port:`, config.serverPort)
})