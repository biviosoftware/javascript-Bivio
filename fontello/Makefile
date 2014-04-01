# $Id$
include ../makefile.defs
PACKAGE=b_icon
PACKAGE_DIR=fontello
PACKAGE_CSS_DIR=css
PACKAGE_FONT_PATHS=font/b_icon.eot font/b_icon.svg font/b_icon.ttf font/b_icon.woff

all:: $(PACKAGE_CSS_PATH) $(PACKAGE_FONT_PATHS)
	$(MAKE_CSS_INSTALL_DIR)
	$(INSTALL_CSS)
	mkdir -p $(INSTALL_PACKAGE_DIR)/font
	cp -r $(PACKAGE_FONT_PATHS) $(INSTALL_PACKAGE_DIR)/font
	chmod 444 $(INSTALL_PACKAGE_DIR)/font/b_icon.*

clean::
	$(RM_PACKAGE)

