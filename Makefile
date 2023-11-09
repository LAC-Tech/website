INPUT_DIR = static
OUTPUT_DIR = www

TEMPLATE_FILE = $(INPUT_DIR)/template.html.ejs
LANDING_FILES = $(INPUT_DIR)/landing/data.json $(INPUT_DIR)/landing/index.html 

INPUT_FILES = $(wildcard $(INPUT_DIR)/*.md) $(INPUT_DIR)/landing.html
OUTPUT_FILES = $(patsubst $(INPUT_DIR)/%.md, $(OUTPUT_DIR)/%.html, $(wildcard $(INPUT_DIR)/*.md)) $(OUTPUT_DIR)/index.html

IMG_INPUT_DIR := static/img
IMG_OUTPUT_DIR := www/img/hashed

INPUT_FILES := $(wildcard $(IMG_INPUT_DIR)/*.png $(IMG_INPUT_DIR)/*.jpg)
WEBP_FILES := $(patsubst $(IMG_INPUT_DIR)/%,$(IMG_OUTPUT_DIR)/%.webp,$(INPUT_FILES))
PNG_FILES := $(patsubst $(IMG_INPUT_DIR)/%.png,$(IMG_OUTPUT_DIR)/%.png,$(INPUT_FILES))

all: $(OUTPUT_FILES) $(WEBP_FILES) $(PNG_FILES)

$(OUTPUT_DIR)/index.html: $(TEMPLATE_FILE) $(LANDING_FILES)
	scripts/build_landing.js $^ $@

$(OUTPUT_DIR)/%.html: $(TEMPLATE_FILE) $(INPUT_DIR)/%.md
	scripts/build.js $^ $@

$(IMG_OUTPUT_DIR)/%.webp: $(IMG_INPUT_DIR)/% | $(IMG_OUTPUT_DIR)
	convert $< $(IMG_OUTPUT_DIR)/$(notdir $(basename $*))-$(shell xxhsum $< | cut -d ' ' -f1).webp

$(IMG_OUTPUT_DIR)/%.png: $(IMG_INPUT_DIR)/%.png | $(IMG_OUTPUT_DIR)
	cp $< $(IMG_OUTPUT_DIR)/$(notdir $(basename $*))-$(shell xxhsum $< | cut -d ' ' -f1).png

$(IMG_OUTPUT_DIR):
	mkdir -p $(IMG_OUTPUT_DIR)

.PHONY: all clean

clean:
	rm -f $(OUTPUT_FILES)
	rm -rf $(IMG_OUTPUT_DIR)
