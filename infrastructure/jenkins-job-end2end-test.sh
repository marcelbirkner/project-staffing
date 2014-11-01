#!/bin/sh

npm install

echo "Kill Selenium Process"
PID=`ps aux | grep node | grep webdriver | awk '{print $2}'`
sudo kill -9 $PID 

echo "Run End2End Test against Server"
webdriver-manager start &
export CHROME_BIN=/usr/bin/chromium-browser

echo "Update IP"
find . -type f -print0 | xargs -0 sed -i 's/localhost:9000/54.220.185.224:9000/g'

npm install jasmine-reporters

echo "Start E2E test"
protractor e2e/conf.js

echo "Kill Selenium Process"
PID=`ps aux | grep node | grep webdriver | awk '{print $2}'`
sudo kill -9 $PID
