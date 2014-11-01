#!/bin/sh

NEXUS_SERVER=$1
NEXUS_CREDENTIALS=$2
BUILD_NUMBER=$3

echo "Build static client assets and run gulp"
cd client
npm install
gulp

echo "Install server side dependencies"
cd ..
npm install

echo "Package JS App"
zip -r project-staffing.zip server.js static/ node_modules/ data/ lib/

echo "Upload JS App to Artifact Server"
curl -v -u $NEXUS_CREDENTIALS --upload-file project-staffing.zip $NEXUS_SERVER/nexus/content/repositories/releases/de/codecentric/js/project-staffing/$BUILD_NUMBER/project-staffing-$BUILD_NUMBER.zip
