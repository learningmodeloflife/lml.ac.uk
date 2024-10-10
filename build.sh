#!/bin/bash

# Fail the build if anything goes wrong
set -e

echo "Initializing and updating Git submodules..."
git submodule init
git submodule update --recursive

jekyll build 

