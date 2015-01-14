#!/bin/sh

npm install
cd modules

for mod in *; do
  cd $mod
  npm install
  cd -
done
