#
# $Id$
#
BIN=ckeditor.js

BWDP=java -jar t/js.jar t/convert.js

all:: test build

build:: ckeditor.pack
	java -jar ckpackager.jar ckeditor.pack  

test:: clean_test_results \
       test1.out test2.out test3.out test4.out test5.out \
       test6.out test7.out test8.out test9.out test10.out \
       test11.out


clean:: clean_test_results
	-rm -f $(BIN)

clean_test_results::
	-rm -f test*.out

%.out: t/%.html
	$(BWDP) -tobwiki $+ >$@
	diff t/$*.ref $@

%.out: t/%.bwiki
	$(BWDP) -tohtml $+ >$@
	diff t/$*.ref $@
