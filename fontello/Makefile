# $Id$
include ../makefile.defs
DEP_CSS=css/b_icon.css
OUT_CSS=css/b_icon.min.css

all:: $(DEP_CSS)
	$(COMPRESS_CSS) -o $(OUT_CSS) $(DEP_CSS)
	ln -fs $(OUT_CSS) $(ALL_CSS)
	chmod 444 font/b_icon.*

clean::
	-unlink $(ALL_CSS)
	-rm -f $(OUT_CSS)
