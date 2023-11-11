import path from 'node:path'
import fs from 'node:fs/promises';

import ejs from 'ejs'
import { globSync } from 'glob'

import phash from 'sharp-phash'

/* Command Line Arguments ****************************************************/
const command = process.argv[2]

if (command !== 'build' && command !== 'clean') {
  console.error('Usage: ./index.js build|clean')
  process.exit(1)
}

const mdInputPaths = globSync('static/*.md')

/** 
 * Tasks
 * 
 * These represent a unit of work
 * Tasks have a src path, a destination path, and optional metadata
 */
const mdToHtmlTasks = globSync('static/*.md').map(src => {
	const dest = src.replace(/^static/, 'www').replace(/\.md$/, '.html')
	return {src, dest}
})


const blogMdToHtmlTasks = globSync('static/blog/*.md').map(src => {
	const p = path.parse(src)
	const filename = p.name
	const [_, date, title] = filename.match(/^(\d{6}) (.+)$/)

	const [year, month, day] = date.match(/.{1,2}/g).map(s => parseInt(s))

	return {
		src,
		dest: path.format({
			dir: p.dir.replace(/^static/, 'www'),
			base: `${date}.html`
		}),
		title,
		date: new Date(2000 + year, month - 1, day + 1)
	}
})

const outputImgTasks = await Promise.all(globSync('static/img/*').map(src => {
	const p = path.parse(src)

	return fs.readFile(src).then(img => phash(img)).then(hash => {
		const hexHash = parseInt(hash, 2).toString(16)

		const dest = path.format({
			dir: p.dir.replace(/^static/, 'www/hashed'),
			base: `${p.name}-${hexHash}${p.ext}`
		})

		return {src, dest}
	})
}))

/* Clean *********************************************************************/

if (command === 'clean') {
	console.log("Cleaning...")

	for (const tasks of [mdToHtmlTasks, blogMdToHtmlTasks]) {
		const outputPaths = tasks.map(({dest}) => dest)
		await outputPaths.map(path => fs.rm(path))
	}

	console.log('Done.')
	process.exit()
}

const renderPage = opts => {
	const {
		templatePath,
		outputPath,
		data,
		body
	} = opts

	ejs.renderFile(templatePath, {...data, body}, async (err, str) => {
		if (err) {
			console.error('Error rendering template:', err)
			process.exit(1)
		}

		fs.writeFileSync(outputPath, str, 'utf-8');
	})
}

console.log('TASKS:')
console.log(mdToHtmlTasks)
console.log(blogMdToHtmlTasks)
console.log(outputImgTasks)
