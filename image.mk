INPUT_DIR := static/img
OUTPUT_DIR := www/img/hashed

IMAGE_FILES := $(wildcard $(INPUT_DIR)/*.png) $(wildcard $(INPUT_DIR)/*.jpg)

WEBP_FILES := $(IMAGE_FILES:$(INPUT_DIR)/%=$(OUTPUT_DIR)/%)
WEBP_FILES := $(WEBP_FILES:%=%.webp)

all: $(WEBP_FILES)

$(OUTPUT_DIR)/%.webp: $(INPUT_DIR)/% | $(OUTPUT_DIR)
	convert $< $(OUTPUT_DIR)/$(notdir $(basename $*))-$(shell xxhsum $< | cut -d ' ' -f1).webp
	cp $< $(OUTPUT_DIR)/$(notdir $(basename $*))-$(shell xxhsum $< | cut -d ' ' -f1)$(suffix $<)

$(OUTPUT_DIR):
	mkdir -p $(OUTPUT_DIR)

clean:
	rm -rf $(OUTPUT_DIR)

