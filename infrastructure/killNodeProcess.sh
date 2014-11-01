#!/bin/bash

echo "Killing running Node process"
nodepid=`ps aux | grep node | grep server.js | awk '{print $2}'`
kill -9 $nodepid
