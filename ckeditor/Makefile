# $Id$
include ../makefile.defs
PACKAGE=ckeditor
BWIKI_CONFIG=bwiki_config.js
BWDP=java -jar t/js.jar t/convert.js
export LANG=en_US.UTF-8

all:: test build

build:: ckeditor.pack $(BWIKI_CONFIG)
	java -jar ckpackager.jar ckeditor.pack
	$(MAKE_JS_INSTALL_DIR)
	for a in $(PACKAGE_JS_FILENAME) $(BWIKI_CONFIG) adapters images plugins skins contents.css; do cp -a $$a $(INSTALL_JS_DIR); done
	find $(INSTALL_JS_DIR) -type f -exec chmod 444 {} \;
	find $(INSTALL_JS_DIR) -type d -exec chmod 555 {} \;

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
