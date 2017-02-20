#!/bin/bash
# publish to our coding ide registry
echo "start build packages"
rm -rf dist
npm run build

echo "start publish"