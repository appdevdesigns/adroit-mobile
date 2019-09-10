#!/usr/bin/env bash

# Usage: .\bump_version.sh #.#.#
#
# where #.#.# is the version number to apply

if [ -z $1 ]; then 
  echo "ERROR: Version number not provided"
  exit -1
fi

echo "Updating the version number"
sed -i'' -e "s/\"version\": \"[0-9]\+.[0-9]\+.[0-9]\+\"/\"version\": \"$1\"/" package.json
sed -i'' -e "s/versionName \"[0-9]\+.[0-9]\+.[0-9]\+\"/versionName \"$1\"/" android/app/build.gradle
sed -i'' -e "/<key>CFBundleShortVersionString<\/key>/!b;n;c\\\t<string>$1</string>" ios/adroit/info.plist
sed -i'' -e "/<key>CFBundleVersion<\/key>/!b;n;c\\\t<string>$1</string>" ios/adroit/info.plist