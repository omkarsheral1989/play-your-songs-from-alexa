#!/bin/bash -el
set -e


rm -rf $OUTPUT_DIR
mkdir $OUTPUT_DIR

yarn tsc --outDir $OUTPUT_DIR

cp ./package.json $OUTPUT_DIR/
cp ./yarn.lock $OUTPUT_DIR/


