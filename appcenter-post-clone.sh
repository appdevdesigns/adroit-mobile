#!/usr/bin/env bash

echo "Creating an .env file"
echo "ADROIT_GMAPS_API_KEY=${ADROIT_GMAPS_API_KEY}" > .env
echo "APPCENTER_KEYSTORE_PASSWORD=${APPCENTER_KEYSTORE_PASSWORD}" >> .env
echo "APPCENTER_KEY_ALIAS=${APPCENTER_KEY_ALIAS}" >> .env
echo "APPCENTER_KEY_PASSWORD=${APPCENTER_KEY_PASSWORD}" >> .env
echo "SENTRY_ENDPOINT=${SENTRY_ENDPOINT}" >> .env
echo "COUNTLY_HOST=${COUNTLY_HOST}" >> .env
echo "COUNTLY_APP_KEY=${COUNTLY_APP_KEY}" >> .env
echo "FORCE_REMOTE_MONITORING=${FORCE_REMOTE_MONITORING}" >> .env

echo "Adding the Sentry Auth token"
echo "auth.token=${SENTRY_AUTH_TOKEN}" >> android/sentry.properties