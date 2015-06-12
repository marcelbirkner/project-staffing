#!/bin/sh

TEST_SERVER=$1
export CHROME_BIN=/usr/bin/chromium-browser
E2E_TEST_CONF=test/client/e2e/conf.js

echo "Running End2End Test $TEST_SERVER"
echo "Update IP in base_url"
find $E2E_TEST_CONF -type f -print0 | xargs -0 sed -i "s/localhost:9000/$TEST_SERVER:9000/g"

echo "Kill Selenium Process"
PID=`ps aux | grep node | grep webdriver | awk '{print $2}'`
sudo kill -9 $PID

echo "Install npm packages"
npm install

echo "protractor --version"
node_modules/.bin/protractor --version

echo "Start WebDriver Manager"
node_modules/.bin/webdriver-manager start &
sleep 20

echo "Start E2E test"
node_modules/.bin/protractor $E2E_TEST_CONF

echo "Kill Selenium Process"
PID=`ps aux | grep node | grep webdriver | awk '{print $2}'`
sudo kill -9 $PID
