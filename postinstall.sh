#!/bin/bash
set -e

# Make RNCamera search paths non-recursive for ios to avoid recursion overflow in build
sed -i -e 's/ios\/\*\*/ios\/\*/g' ./node_modules/react-native-camera/ios/RNCamera.xcodeproj/project.pbxproj