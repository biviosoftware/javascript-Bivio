# $Id$
include ../makefile.defs
IMAGES=images

all::
	( for f in */*.js; do $(COMPRESS_JS) $$f; done ) > $(ALL_JS)
#	$(COMPRESS) --type css -o $(ALL_CSS) */*.css
#	install -m 755 -d $(IMAGES)
#	install -m 444 */images/*.* $(IMAGES)

clean::
	-rm -rf $(ALL_JS) $(ALL_CSS) $(IMAGES)
