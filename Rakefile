require 'rake'
require 'fileutils'

INPUT_DIR = 'static'
OUTPUT_DIR = 'www'

TEMPLATE_FILE = "#{INPUT_DIR}/template.html.ejs"

HTML_FILES = Dir.glob("#{INPUT_DIR}/*.md").map do |md_file|
  "#{OUTPUT_DIR}/#{File.basename(md_file, '.md')}.html"
end

IMG_INPUT_DIR = 'static/img'
IMG_OUTPUT_DIR = 'www/img/hashed'

IMG_FILES = Dir.glob("#{IMG_INPUT_DIR}/*.png #{IMG_INPUT_DIR}/*.jpg")
WEBP_FILES = IMG_FILES.map do |img_file|
  "#{IMG_OUTPUT_DIR}/#{File.basename(img_file, '.*')}.webp"
end
PNG_FILES = IMG_FILES.select { |img_file| img_file.end_with?('.png') }.map do |img_file|
  "#{IMG_OUTPUT_DIR}/#{File.basename(img_file, '.*')}.png"
end

directory IMG_OUTPUT_DIR

desc 'Build HTML and image files'
task :all => HTML_FILES + WEBP_FILES + PNG_FILES

HTML_FILES.each do |html_file|
  file html_file => [TEMPLATE_FILE, html_file.sub(OUTPUT_DIR, INPUT_DIR)] do |t|
    sh "scripts/build.js #{TEMPLATE_FILE} #{t.name}"
  end
end

rule '.webp' => ['.png'] do |t|
  sh "your_webp_conversion_command #{t.source} #{t.name}"
end

rule '.png' => ['.png'] do |t|
  sh "cp #{t.source} #{t.name}"
end

desc 'Clean generated files'
task :clean do
  rm HTML_FILES
  rm_rf IMG_OUTPUT_DIR
end
