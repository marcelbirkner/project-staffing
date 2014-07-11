#!/bin/bash

echo "Killing running Node process"
nodepid=`ps aux | grep node | grep server.js | awk '{print $2}'`
kill -9 $nodepid

echo "Cleanup existing project"
rm -rf project-staffing

echo "Get latest source code"
git clone https://github.com/marcelbirkner/project-staffing.git
cd project-staffing
npm install
cd static

echo "Update IP"
find . -type f -print0 | xargs -0 sed -i 's/localhost:9000/TESTSERVER_IP:9000/g'
cd ..

echo "Start NodeJS Process"
sudo service project-staffing status

sudo service project-staffing restart


