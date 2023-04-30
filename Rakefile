require 'date'
require 'erb'
require 'json'
require 'rake/clean'
require 'redcarpet'

MD = FileList['input/**/*.md']

Template = ERB.new(File.read("template/index.erb"))
BlogTemplate = ERB.new(File.read("template/blog.erb"))

MDToHTML = Redcarpet::Markdown.new(Redcarpet::Render::HTML)

Blog = "public/blog.html"

Outputs = MD.map do |md|
  html_path = md.pathmap("%{input,public}d/%n-old.html")
  if html_path.include? '/blog/'
    html_path.pathmap("%d%{.*,*}n%x") { |n| "/#{n[0..5]}" }
  else
    html_path
  end
end

task :default => ["public/blog", :create_outputs]
multitask :create_outputs => Outputs.include(Blog)

directory "public/blog"

# TODO each page should have its own tags
# TODO this should be a rule..
DefaultOG = JSON.load(File.open "input/og.json")

rule /public\/.+.html/ => MD.each.method(:next) do |t|
  md = File.read(t.source)

  title, date = if t.source.include? '/blog' then 
    name = t.source.pathmap('%n')
    title = name[7..]
    date = Date.strptime(name[0..5], "%y%m%d").strftime("%B %d, %Y")
    [title, date]
  end

  # TODO: doesn't work for blogs, if there's no .json the html has no content
  og = begin
    JSON.load(File.open t.source.ext(".json")).merge({"title" => title})
  rescue
    DefaultOG
  end

  html_snippet = MDToHTML.render(md)

  html = Template.result_with_hash(html_snippet:, title:, date:, og:)
  File.write(t.name, html)
end

# Generates the blog listings
file Blog => FileList["input/blog/*.md"] do |t|
  # extracts filename from path, then extracts yymmdd for the html link
  links = t.prerequisites.map do |md|
    n = md.pathmap("%n")
    href = "/blog/#{n[0..5]}.html"
    "<a href=#{href}>#{n[7..]}</a>"
  end
  html_snippet = BlogTemplate.result_with_hash(links:)
  og, date = nil
  html = Template.result_with_hash(
    html_snippet:,
    title: "Blog",
    date: nil,
    og: DefaultOG
  )
  File.write(t.name, html)
end

CLEAN.include(Outputs, "public/blog")
