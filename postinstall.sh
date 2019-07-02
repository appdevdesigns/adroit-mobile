#!/usr/bin/env bash

# TEMP (while using a github dependency for react-native-sentry):
# Remove extraneous files in node_modules
# Ref: https://github.com/getsentry/react-native-sentry/issues/590
rm -rf ./node_modules/react-native-sentry/assets
rm -rf ./node_modules/react-native-sentry/examples
rm -rf ./node_modules/react-native-sentry/docs
rm -rf ./node_modules/react-native-sentry/appium

