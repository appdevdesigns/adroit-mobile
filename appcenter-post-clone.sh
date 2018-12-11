#!/usr/bin/env bash

echo "Creating an .env file"
echo "ADROIT_GMAPS_API_KEY=${ADROIT_GMAPS_API_KEY}" > .env

echo "Adding the Sentry Auth token"
echo "auth.token=${SENTRY_AUTH_TOKEN}" >> android/sentry.properties