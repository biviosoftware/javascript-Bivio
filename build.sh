#!/bin/sh
INSTALL_BASE_DIR="$1"
test "x$INSTALL_BASE_DIR" = x && {
    echo "usage: make <install_dir>" 1>&2
    exit 1
}
set -e
make="make INSTALL_BASE_DIR=$INSTALL_BASE_DIR"
for m in */Makefile; do
    cd $(dirname $m)
    $make clean && $make
    cd ..
done
