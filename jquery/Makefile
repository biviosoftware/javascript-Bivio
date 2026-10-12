include ../makefile.defs
PACKAGE=jquery

# jquery.min.js is the upstream minified release, so COMPRESS_JS is not applied
all:: jquery.min.js
	$(MAKE_JS_INSTALL_DIR)
	cp --force jquery.min.js $(INSTALL_JS_PATH)
	chmod 444 $(INSTALL_JS_PATH)

clean::
	$(RM_PACKAGE)
