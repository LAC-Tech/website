INPUT_DIR = static
OUTPUT_DIR = www

TEMPLATE_FILE = $(INPUT_DIR)/template.html.ejs

HTML_FILES = $(patsubst $(INPUT_DIR)/%.md, $(OUTPUT_DIR)/%.html, $(wildcard $(INPUT_DIR)/*.md))

IMG_INPUT_DIR := static/img
IMG_OUTPUT_DIR := www/img/hashed

INPUT_FILES := $(wildcard $(IMG_INPUT_DIR)/*.png $(IMG_INPUT_DIR)/*.jpg)
WEBP_FILES := $(patsubst $(IMG_INPUT_DIR)/%,$(IMG_OUTPUT_DIR)/%.webp,$(INPUT_FILES))
PNG_FILES := $(patsubst $(IMG_INPUT_DIR)/%.png,$(IMG_OUTPUT_DIR)/%.png,$(INPUT_FILES))

all: $(HTML_FILES) $(WEBP_FILES) $(PNG_FILES)

$(OUTPUT_DIR)/%.html: $(TEMPLATE_FILE) $(INPUT_DIR)/%.md
	scripts/build.js $^ $@

$(OUTPUT_DIR)/blog/%.html: $(TEMPLATE_FILE) $(INPUT_DIR)/blog/%.md
	scripts/build.js $^ $@

$(IMG_OUTPUT_DIR)/%.webp: $(IMG_INPUT_DIR)/% | $(IMG_OUTPUT_DIR)
	convert $< $(IMG_OUTPUT_DIR)/$(notdir $(basename $*))-$(shell xxhsum $< | cut -d ' ' -f1).webp

$(IMG_OUTPUT_DIR)/%.png: $(IMG_INPUT_DIR)/%.png | $(IMG_OUTPUT_DIR)
	cp $< $(IMG_OUTPUT_DIR)/$(notdir $(basename $*))-$(shell xxhsum $< | cut -d ' ' -f1).png

$(IMG_OUTPUT_DIR):
	mkdir -p $(IMG_OUTPUT_DIR)

.PHONY: all clean images

clean:
	rm -f $(HTML_FILES)
	rm -rf $(IMG_OUTPUT_DIR)
