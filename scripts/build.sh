#!/bin/bash -el
set -e

OUTPUT_DIR="lambda"

rm -rf ./$OUTPUT_DIR
mkdir $OUTPUT_DIR

yarn tsc

cp ./package.json ./$OUTPUT_DIR/
cp ./yarn.lock ./$OUTPUT_DIR/


