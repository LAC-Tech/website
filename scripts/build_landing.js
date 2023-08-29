#!/usr/bin/env node

import fs from 'fs/promises';
import render from './render.js'

const [templatePath, inputDataPath, inputHtmlPath, outputPath] = 
	process.argv.slice(2)

if (!templatePath || !inputDataPath || !inputHtmlPath || !outputPath) {
  console.error('Usage: ./my_script.mjs template input_data input_html output')
  process.exit(1)
}
const [rawData, body] = await Promise.all([
	fs.readFile(inputDataPath, 'utf-8'),
	fs.readFile(inputHtmlPath, 'utf-8')
])

const data = JSON.parse(rawData)

render({templatePath, outputPath, data, body})
