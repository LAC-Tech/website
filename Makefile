INPUT_DIR = static
OUTPUT_DIR = www

TEMPLATE_FILE = $(INPUT_DIR)/template.html.ejs
LANDING_FILES = $(INPUT_DIR)/landing.json $(INPUT_DIR)/landing.html 

INPUT_FILES = $(wildcard $(INPUT_DIR)/*.md) $(INPUT_DIR)/landing.html
OUTPUT_FILES = $(patsubst $(INPUT_DIR)/%.md, $(OUTPUT_DIR)/%.html, $(wildcard $(INPUT_DIR)/*.md)) $(OUTPUT_DIR)/index.html

all: $(OUTPUT_FILES)

$(OUTPUT_DIR)/index.html: $(TEMPLATE_FILE) $(LANDING_FILES)
	scripts/build_landing.js $^ $@

$(OUTPUT_DIR)/%.html: $(TEMPLATE_FILE) $(INPUT_DIR)/%.md
	scripts/build.js $^ $@

.PHONY: all clean

clean:
	rm -f $(OUTPUT_FILES)
