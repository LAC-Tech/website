#!/usr/bin/env node

import fs from 'fs';
import { marked } from 'marked';
import matter from 'gray-matter';
import render from './render.js'

const [templatePath, inputPath, outputPath] = process.argv.slice(2)

if (!templatePath || !inputPath || !outputPath) {
  console.error('Usage: ./my_script.mjs template input output')
  process.exit(1)
}

// Read input Markdown file and extract front matter
const inputContent = fs.readFileSync(inputPath, 'utf-8')
const { data, content } = matter(inputContent)

const body = marked(content)

render({templatePath, outputPath, data, body})
