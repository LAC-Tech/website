convert: www/hire.html

www/hire.html: input/hire.md
	pandoc -f markdown -t html -s -o $@ $<

.PHONY: convert
