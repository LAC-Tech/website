import { globSync } from 'glob'
import path from 'node:path'

const mdInput = globSync('static/*.md')

const htmlOutput = mdInput.map(mdPath => {
	return mdPath.replace(/^static/, 'www').replace(/\.md$/, '.html')
})

const mdBlogInput = globSync('static/blog/*.md')
const htmlBlogOutput = mdBlogInput.map(mdPath => {
	const p = path.parse(mdPath)
	const filename = p.name
	const [_, date, title] = filename.match(/^(\d{6}) (.+)$/)

	const newPath = path.format({
		dir: p.dir.replace(/^static/, 'www'),
		base: `${date}.html`
	})

	const [year, month, day] = date.match(/.{1,2}/g).map(s => parseInt(s))

	const newDate = new Date(2000 + year, month - 1, day + 1)
	
	return [newPath, title, newDate]
})

console.log('md -> html')
console.log(mdInput)
console.log(htmlOutput)
console.log(mdBlogInput)
console.log(htmlBlogOutput)
