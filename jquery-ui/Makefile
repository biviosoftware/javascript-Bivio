# $Id$
include ../makefile.defs
PACKAGE=jquery-ui

all:: $(PACKAGE_JS_PATH) $(PACKAGE_CSS_PATH)
	$(MAKE_JS_INSTALL_DIR)
	$(MAKE_CSS_INSTALL_DIR)
	$(INSTALL_JS)
	$(INSTALL_CSS)
	mkdir -p $(INSTALL_PACKAGE_DIR)/images
	find images -type f ! -path '*CVS*' -exec cp {} $(INSTALL_PACKAGE_DIR)/images \;
	chmod 444 $(INSTALL_PACKAGE_DIR)/images/*

clean::
	$(RM_PACKAGE)
