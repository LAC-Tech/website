import * as fs from 'node:fs/promises'

const templatePath = "../static/template.html.ejs"

const html = (title, body) => {
	ejs.renderFile(templatePath, {title, body})
}

if (4 > process.argv.length) {
	console.error("expecting 3 args: type, input path, output path")
	process.exit(1)
}

const [_, type, outputPath, contentsPath, metaDataPath] = process.argv

if (type == 'html') {
	if (!metaDataPath) {
		console.error("html requires associated json metadata file")
		process.exit(1)
	}
	const metaData = fs.readFile(metaDataPath)
	const contents = html(

	fs.writeFile(
} else if (type == 'md') {
	fs
} else {
	console.error("type must be either html or md")
	process.exit(1)
}
