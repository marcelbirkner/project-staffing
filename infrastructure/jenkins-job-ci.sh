#!/bin/sh

NEXUS_SERVER=$1
NEXUS_CREDENTIALS=$2
BUILD_NUMBER=$3

echo "NEXUS_SERVER        [$NEXUS_SERVER]"
echo "NEXUS_CREDENTIALS   [$NEXUS_CREDENTIALS]"
echo "BUILD_NUMBER        [$BUILD_NUMBER]"

echo "Install dependencies using npm"
npm install

echo "Run Grunt build"
grunt ci --force

echo "Store build version in navigation"
find static/navigation.html -type f -print0 | xargs -0 sed -i "s/Company Projects/Version $BUILD_NUMBER/g"

# echo "Rimraf node_modules"
# rm -rf node_modules
# echo "Install dependencies using npm, again, this time no dev dependencies"
# npm install --production

echo "Package app"
zip -r project-staffing.zip server.js static/ node_modules/ data/ lib/

echo "Upload app to artifact server: $NEXUS_SERVER/nexus/content/repositories/releases/de/codecentric/js/project-staffing/$BUILD_NUMBER/project-staffing-$BUILD_NUMBER.zip"
curl -v -u $NEXUS_CREDENTIALS --upload-file project-staffing.zip $NEXUS_SERVER/nexus/content/repositories/releases/de/codecentric/js/project-staffing/$BUILD_NUMBER/project-staffing-$BUILD_NUMBER.zip
