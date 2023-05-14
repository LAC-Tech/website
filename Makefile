INPUT_DIR = input
OUTPUT_DIR = www

MARKDOWN_FILES = $(wildcard $(INPUT_DIR)/*.md)
HTML_FILES = $(patsubst $(INPUT_DIR)/%.md, $(OUTPUT_DIR)/%.html, $(MARKDOWN_FILES))

all: $(HTML_FILES)

$(OUTPUT_DIR)/%.html: $(INPUT_DIR)/%.md
	pandoc -f markdown+smart -t html --template=input/template.html -o $@ $<

.PHONY: all clean

clean:
	rm -f $(HTML_FILES)

