# $Id$
JS=all.js
CSS=all.css
IMAGES=images
COMPRESS=java com.yahoo.platform.yui.compressor.Bootstrap --line-break 1000

all::
	( for f in */*.js; do $(COMPRESS) --type js --nomunge --preserve-semi --disable-optimizations $$f; done ) > $(JS)
#	$(COMPRESS) --type css -o $(CSS) */*.css
#	install -m 755 -d images
#	install -m 444 */images/*.* images

clean::
	-rm -rf $(JS) $(CSS) $(IMAGES)
