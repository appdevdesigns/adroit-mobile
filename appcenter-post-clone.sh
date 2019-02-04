#!/usr/bin/env bash

if [ ! -f .env ]; then
  echo "Creating an .env file"
  echo "APPCENTER_KEYSTORE_PASSWORD=${APPCENTER_KEYSTORE_PASSWORD}" >> .env
  echo "APPCENTER_KEY_ALIAS=${APPCENTER_KEY_ALIAS}" >> .env
  echo "APPCENTER_KEY_PASSWORD=${APPCENTER_KEY_PASSWORD}" >> .env
  echo "SENTRY_ENDPOINT=${SENTRY_ENDPOINT}" >> .env
  echo "COUNTLY_HOST=${COUNTLY_HOST}" >> .env
  echo "COUNTLY_APP_KEY=${COUNTLY_APP_KEY}" >> .env
  echo "FORCE_REMOTE_MONITORING=${FORCE_REMOTE_MONITORING}" >> .env
else
  echo ".env file already exists - not updated"
fi

echo "Setting the Sentry Auth token"
sed -i'' -e "s/<SENTRY_AUTH_TOKEN>/${SENTRY_AUTH_TOKEN}/" android/sentry.properties
sed -i'' -e "s/<SENTRY_AUTH_TOKEN>/${SENTRY_AUTH_TOKEN}/" ios/sentry.properties

echo "Setting gradle.properties entries"
sed -i'' -e "s/<CODE_PUSH_KEY_ANDROID_STAGING>/${CODE_PUSH_KEY_ANDROID_STAGING}/" android/app/gradle.properties
sed -i'' -e "s/<CODE_PUSH_KEY_ANDROID_PRODUCTION>/${CODE_PUSH_KEY_ANDROID_PRODUCTION}/" android/app/gradle.properties

echo "Setting iOS Project variables"
sed -i'' -e "s/<CODE_PUSH_KEY_IOS_STAGING>/${CODE_PUSH_KEY_IOS_STAGING}/" ios/adroit.xcodeproj/project.pbxproj
sed -i'' -e "s/<CODE_PUSH_KEY_IOS_PRODUCTION>/${CODE_PUSH_KEY_IOS_PRODUCTION}/" ios/adroit.xcodeproj/project.pbxproj
