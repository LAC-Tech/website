INPUT_DIR = static
OUTPUT_DIR = www

INPUT_FILES = $(wildcard $(INPUT_DIR)/*.md) $(INPUT_DIR)/landing.html
OUTPUT_FILES = $(patsubst $(INPUT_DIR)/%.md, $(OUTPUT_DIR)/%.html, $(wildcard $(INPUT_DIR)/*.md)) $(OUTPUT_DIR)/index.html

all: $(OUTPUT_FILES)

$(OUTPUT_DIR)/index.html: $(INPUT_DIR)/landing.html
	pandoc -f html -t html+raw_html --metadata title="Lewis Campbell Technologies" --template=$(INPUT_DIR)/template.html -o $@ $<

$(OUTPUT_DIR)/%.html: $(INPUT_DIR)/%.md
	pandoc -f markdown+smart -t html --template=$(INPUT_DIR)/template.html -o $@ $<

.PHONY: all clean

clean:
	rm -f $(OUTPUT_FILES)
