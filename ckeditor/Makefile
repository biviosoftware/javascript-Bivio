# $Id$
include ../makefile.defs
PACKAGE=ckeditor
BWIKI_CONFIG=bwiki_config.js
BWDP=java -jar t/js.jar t/convert.js

all:: test build

build:: ckeditor.pack $(BWIKI_CONFIG)
	java -jar ckpackager.jar ckeditor.pack  
	$(MAKE_JS_INSTALL_DIR)
	mv $(PACKAGE_JS_PATH) $(INSTALL_JS_PATH)
	chmod 444 $(INSTALL_JS_PATH)
	cp $(BWIKI_CONFIG) $(INSTALL_JS_DIR)
	chmod 444 $(INSTALL_JS_DIR)/$(BWIKI_CONFIG)

test:: clean_test_results \
       test1.out test2.out test3.out test4.out test5.out \
       test6.out test7.out test8.out test9.out test10.out \
       test11.out

clean:: clean_test_results
	$(RM_PACKAGE)

clean_test_results::
	-rm -f test*.out

%.out: t/%.html
	$(BWDP) -tobwiki $+ >$@
	diff t/$*.ref $@

%.out: t/%.bwiki
	$(BWDP) -tohtml $+ >$@
	diff t/$*.ref $@
