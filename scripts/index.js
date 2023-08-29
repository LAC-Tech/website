#!/usr/bin/env node

import fs from 'fs/promises';
import { marked } from 'marked';
import matter from 'gray-matter';
import ejs from 'ejs';

// Parse command line arguments
const [templateFilePath, inputFilePath, outputFilePath] = process.argv.slice(2);

if (!templateFilePath || !inputFilePath || !outputFilePath) {
  console.error('Usage: ./my_script.mjs template source target');
  process.exit(1);
}

// Read template file
const templateContent = await fs.readFile(templateFilePath, 'utf-8');

// Read input Markdown file and extract front matter
const inputContent = await fs.readFile(inputFilePath, 'utf-8');
const { data, content } = matter(inputContent);

// Convert Markdown content to HTML
const body = marked(content);

// Render the template using EJS
const renderedTemplate = ejs.render(templateContent, {
  title: data.title || '',
  body,
});

// Write the final HTML to the output file
await fs.writeFile(outputFilePath, renderedTemplate, 'utf-8');

console.log(`File '${outputFilePath}' generated successfully.`);
