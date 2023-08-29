require 'date'
require 'erb'
require 'json'
require 'rake/clean'
require 'redcarpet'

MARKDOWN_TO_HTML = Redcarpet::Markdown.new(Redcarpet::Render::HTML)

INPUT_DIR = 'static'
MARKDOWN_FILES = "#{INPUT_DIR}/**/*.md"
TEMPLATE = "#{INPUT_DIR}/template.html.erb"
LANDING = "#{INPUT_DIR}/landing.html"
INPUT_FILES = [TEMPLATE, LANDING]

OUTPUT_DIR = 'www'
HTML_FILES = "#{OUTPUT_DIR}/**/*.html"
INDEX = "#{OUTPUT_DIR}/index.html"

task :default => :html
task :html => FileList[HTML_FILES]

puts FileList[HTML_FILES]

def output_html (name, body)
  template = ERB.new(File.read(TEMPLATE))
  html = template.result_with_hash({body: body})
  File.write(name, html)
end

=begin
file INDEX => LANDING do |t|
  output_html(t.name, File.read(LANDING))
end
=end

rule ".html" => ".md" do |t|
  body = MARKDOWN_TO_HTML.render(t.source)
  output_html(t.name, body)
end

CLEAN.add(HTML_FILES)
