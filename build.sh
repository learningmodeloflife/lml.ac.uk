#!/bin/bash

git config --file=.gitmodules submodule.shared-files.url "https://$GITHUB_TOKEN@github.com/learningmodeloflife/shared-files.git"

git submodule sync
git submodule update --init --remote --merge

jekyll JEKYLL_ENV=production build