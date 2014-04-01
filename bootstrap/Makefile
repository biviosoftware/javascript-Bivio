# $Id$
include ../makefile.defs
PACKAGE=bootstrap
PACKAGE_JS_DIR=dist/js

all:: $(PACKAGE_JS_PATH)
	$(MAKE_JS_INSTALL_DIR)
	$(INSTALL_JS)
	mkdir -p $(INSTALL_PACKAGE_DIR)/less
	cp -r less/*.less $(INSTALL_PACKAGE_DIR)/less
	chmod 444 $(INSTALL_PACKAGE_DIR)/less/*

clean::
	$(RM_PACKAGE)
