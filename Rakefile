require 'date'
require 'erb'
require 'json'
require 'rake/clean'
require 'redcarpet'

#MD = FileList['input/**/*.md']
#Template = ERB.new(File.read("template/index.erb"))

MARKDOWN_TO_HTML = Redcarpet::Markdown.new(Redcarpet::Render::HTML)
def md_to_html(md) = MMARKDOWN_TO_HTML.render md

INPUT_DIR = 'static'
OUTPUT_DIR = 'www'

task default: "#{OUTPUT_DIR}/index.html"

file "#{OUTPUT_DIR}/index.html" => [
  "#{INPUT_DIR}/template.html.erb",
  "#{INPUT_DIR}/landing.html"
] do |t|
  template_path, landing_path = t.prerequisites

  template = ERB.new(File.read(template_path))
  landing = File.read(landing_path)
  html = template.result_with_hash(body: landing)

  File.write(t.name, html)
end
