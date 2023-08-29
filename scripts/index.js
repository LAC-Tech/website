#!/usr/bin/env node
import fs from 'fs/promises';
import { marked } from 'marked';
import matter from 'gray-matter';
import ejs from 'ejs';

// Parse command line arguments
const args = process.argv.slice(2);
const templateIndex = args.indexOf('--template');
const inputIndex = args.indexOf('--input');
const outputIndex = args.indexOf('--output');

if (templateIndex === -1 || inputIndex === -1 || outputIndex === -1) {
  console.error('Usage: ./my_script.mjs --template a.html --input b.md --output c.html');
  process.exit(1);
}

const templateFilePath = args[templateIndex + 1];
const inputFilePath = args[inputIndex + 1];
const outputFilePath = args[outputIndex + 1];

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

