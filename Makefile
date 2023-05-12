convert: www/hire.html

www/hire.html: input/hire.md
	pandoc -f markdown+smart -t html --template=input/template.html -o $@ $<

.PHONY: convert
.PHONY: clean

clean:
	rm -f www/hire.html
