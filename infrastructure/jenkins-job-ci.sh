#!/bin/sh

NEXUS_SERVER=$1
NEXUS_CREDENTIALS=$2
BUILD_NUMBER=$3

echo "Install dependencies using npm"
npm install

echo "Build static client assets by running Grunt"
grunt --force

echo "Store Build Version in Navigation"
find static/navigation.html -type f -print0 | xargs -0 sed -i "s/Company Projects/Version $BUILD_NUMBER/g"

echo "Package JS App; remove unneccessary packages beforehand"
rm -rf node_modules/grunt*
rm -rf node_modules/karma*
rm -rf node_modules/mocha*
rm -rf node_modules/sinon*
rm -rf node_modules/chai* 
rm -rf node_modules/jasmine-reporters*

zip -r project-staffing.zip server.js static/ node_modules/ data/ lib/ 2> zip.log

echo "Upload JS App to Artifact Server"
curl -v -u $NEXUS_CREDENTIALS --upload-file project-staffing.zip $NEXUS_SERVER/nexus/content/repositories/releases/de/codecentric/js/project-staffing/$BUILD_NUMBER/project-staffing-$BUILD_NUMBER.zip
