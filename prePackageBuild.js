'use strict'
console.log('[webpackBuild info]: Starting script...')
const
	co = require('co'),
	fs = require('fs-extra'),
	path = require('path'),
	pug = require('pug'),
	sass = require('node-sass')

const
	renderSass = (inputPath) => new Promise((resolve, reject) => {
		sass.render({file: inputPath}, (err, result) => {
			if (err) {
				return reject(err)
			}
			resolve(result)
		})
	})

co(function*() {
	const pugFilePaths = [{
				inputPath: path.join(__dirname, 'src/components/formInjector/formInjector.template.pug'),
				outputPath: path.join(__dirname, 'src/components/formInjector/formInjector.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/components/inputInjector/inputInjector.template.pug'),
				outputPath: path.join(__dirname, 'src/components/inputInjector/inputInjector.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/autocomplete/autocomplete.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/autocomplete/autocomplete.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/base/baseInput.commonElementsTemplate.pug'),
				outputPath: path.join(__dirname, 'src/inputs/base/baseInput.commonElementsTemplate.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/checkbox/checkbox.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/checkbox/checkbox.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/datepicker/datepicker.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/datepicker/datepicker.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/file/file.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/file/file.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/input/input.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/input/input.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/select/select.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/select/select.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/slideToggle/slideToggle.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/slideToggle/slideToggle.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/textarea/textarea.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/textarea/textarea.template.html')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/wysiwyg/wysiwyg.template.pug'),
				outputPath: path.join(__dirname, 'src/inputs/wysiwyg/wysiwyg.template.html')
			}
		],
		sassFilePaths = [{
				inputPath: path.join(__dirname, 'src/components/formInjector/formInjector.styles.scss'),
				outputPath: path.join(__dirname, 'src/components/formInjector/formInjector.styles.css')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/base/baseInput.styles.scss'),
				outputPath: path.join(__dirname, 'src/inputs/base/baseInput.styles.css')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/file/file.styles.scss'),
				outputPath: path.join(__dirname, 'src/inputs/file/file.styles.css')
			}, {
				inputPath: path.join(__dirname, 'src/inputs/wysiwyg/wysiwyg.styles.scss'),
				outputPath: path.join(__dirname, 'src/inputs/wysiwyg/wysiwyg.styles.css')
			}
		]
	for (const i in pugFilePaths) {
		const {inputPath, outputPath} = pugFilePaths[i]
		console.log(`Building the pug file at ${inputPath}...`)
		let data = pug.renderFile(inputPath),
			fd = yield fs.open(outputPath, 'w')
		yield fs.writeFile(fd, data)
		yield fs.close(fd)
		console.log(`Successfully built the html file at ${outputPath}.`)
	}
	for (const i in sassFilePaths) {
		const {inputPath, outputPath} = sassFilePaths[i]
		console.log(`Building the sass file at ${inputPath}...`)
		let data = yield renderSass(inputPath),
			fd = yield fs.open(outputPath, 'w')
		yield fs.writeFile(fd, data.css.toString())
		yield fs.close(fd)
		console.log(`Successfully built the css file at ${outputPath}.`)
	}
	return true
}).then(() => console.log('[prePackageBuild info]: All build completed successfully.'), (error) => {
	console.log('[prePackageBuild info]: Error while building: ', error)
	process.exit(1)
})
