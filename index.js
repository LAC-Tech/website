import path from 'node:path'
import fs from 'node:fs/promises'

import ejs from 'ejs'
import { globSync } from 'glob'

import phash from 'sharp-phash'
import { marked } from 'marked'
import matter from 'gray-matter'

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
 * Tasks are an intermediate format that contain all the info to modify the FS
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

const blogListingTask = {
	dest: "www/blog.html",
	links: blogMdToHtmlTasks.map(({dest, title, date}) => {
		const url = dest.replace('www/', '/')
		return {url, title, date}
	})
}

const imgTasks = await Promise.all(globSync('static/img/*').map(src => {
	const p = path.parse(src)

	return fs.readFile(src).then(img => phash(img)).then(hash => {
		const hexHash = parseInt(hash, 2).toString(16)

		const dest = path.format({
			dir: p.dir.replace(/^static/, 'www'),
			base: `${p.name}-${hexHash}${p.ext}`
		})

		return {src, dest}
	})
}))

/* Clean *********************************************************************/

if (command === 'clean') {
	console.log("Cleaning...")

	for (const tasks of [
		mdToHtmlTasks,
		blogMdToHtmlTasks,
		[blogListingTask],
		imgTasks
	]) {
		const outputPaths = tasks.map(({dest}) => dest)
		console.log(outputPaths)
		await Promise.all(outputPaths.map(path => fs.rm(path)))
	}

	console.log('Done.')
	process.exit()
}

/* Rendering *****************************************************************/

const render = filename => data => new Promise((resolve, reject) => {
	ejs.renderFile(filename, data, async (err, str) => {
		if (err) {
			reject(err)
		} else {
			resolve(str)
		}
	})
})

const renderPage = render('static/template.html.ejs')
const renderBlogListings = render('static/blog_template.html.ejs')

console.log('TASKS:')
console.log(mdToHtmlTasks)
console.log(blogMdToHtmlTasks)
console.log(imgTasks)
console.log(blogListingTask)

if (command === 'build') {
	console.log('Building...')

	await Promise.all(mdToHtmlTasks.map(({src, dest}) => {
		return fs.readFile(src, 'utf-8').then(inputContent => {
			const { data, content } = matter(inputContent)

			return renderPage({...data, body: marked(content)})
				.then(htmlStr => fs.writeFile(dest, htmlStr, 'utf-8'))
		})
	}))
	console.log("Converted pages to html")

	await Promise.all(blogMdToHtmlTasks.map(({src, dest, title}) => {
		return fs.readFile(src, 'utf-8').then(inputContent => {
			const { data, content } = matter(inputContent)

			return renderPage({
				...data,
				title, 
				type: 'article', 
				body: marked(content)
			}).then(htmlStr => fs.writeFile(dest, htmlStr, 'utf-8'))
		})
	}))
	console.log("Converted blogs to html")

	await renderPage({
		title: 'Blog',
		type: 'website',
		description: "Lewis Campbell's Blog",
		image: null,
		body: await renderBlogListings(blogListingTask)
	})
	.then(htmlStr => fs.writeFile(blogListingTask.dest, htmlStr, 'utf-8'))
	console.log("Generated new blog listing")

	await Promise.all(imgTasks.map(({src, dest}) => fs.copyFile(src, dest)))
	console.log("Hashing images")
	
	console.log('Done.')
}
