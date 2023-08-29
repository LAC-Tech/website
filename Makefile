INPUT_DIR = static
OUTPUT_DIR = www

INPUT_FILES = $(wildcard $(INPUT_DIR)/*.md) $(INPUT_DIR)/landing.html
OUTPUT_FILES = $(patsubst $(INPUT_DIR)/%.md, $(OUTPUT_DIR)/%.html, $(wildcard $(INPUT_DIR)/*.md)) $(OUTPUT_DIR)/index.html

all: $(OUTPUT_FILES)

$(OUTPUT_DIR)/index.html: $(INPUT_DIR)/landing.json $(INPUT_DIR)/landing.html 
	scripts/build_landing.js $(INPUT_DIR)/template.html.ejs $^ $@

$(OUTPUT_DIR)/%.html: $(INPUT_DIR)/%.md
	scripts/build.js $(INPUT_DIR)/template.html.ejs $^ $@

.PHONY: all clean

clean:
	rm -f $(OUTPUT_FILES)
