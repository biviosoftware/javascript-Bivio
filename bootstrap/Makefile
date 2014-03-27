# $Id$
include ../makefile.defs
DEP_JS=dist/js/bootstrap.min.js

all:: $(DEP_JS)
	ln -fs $(DEP_JS) $(ALL_JS)

clean::
	-unlink $(ALL_JS)
