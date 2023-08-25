INPUT_DIR := static/img
OUTPUT_DIR := www/img/hashed

IMAGE_FILES := $(wildcard $(INPUT_DIR)/*.png $(INPUT_DIR)/*.jpg)
WEBP_FILES := $(patsubst $(INPUT_DIR)/%,$(OUTPUT_DIR)/%.webp,$(IMAGE_FILES))

all: $(WEBP_FILES)

$(OUTPUT_DIR)/%.webp: $(INPUT_DIR)/% | $(OUTPUT_DIR)
	convert $< $(OUTPUT_DIR)/$(notdir $(basename $*))-$(shell xxhsum $< | cut -d ' ' -f1).webp

$(OUTPUT_DIR):
	mkdir -p $(OUTPUT_DIR)

clean:
	rm -rf $(OUTPUT_DIR)

