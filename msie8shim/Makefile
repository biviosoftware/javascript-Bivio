# $Id$
include ../makefile.defs
PACKAGE=msie8shim

all::
	$(MAKE_JS_INSTALL_DIR)
	( for f in *.js; do $(COMPRESS_JS) $$f; done ) > $(INSTALL_JS_PATH)

clean::
	$(RM_PACKAGE)
