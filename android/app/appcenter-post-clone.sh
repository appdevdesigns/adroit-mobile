#!/usr/bin/env bash

echo "Creating an .env file"
echo "ADROIT_GMAPS_API_KEY=${ADROIT_GMAPS_API_KEY}" > .env.test

echo "Creating a react native bundle"
npm run bundle