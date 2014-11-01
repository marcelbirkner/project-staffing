#!/bin/sh

ARTIFACT_VERSION=$1
SERVER=$2
TEST_SERVER=$3

echo "Downloading project-staffing-$ARTIFACT_VERSION.zip"
wget $SERVER/nexus/service/local/repositories/releases/content/de/codecentric/js/project-staffing/$ARTIFACT_VERSION/project-staffing-$ARTIFACT_VERSION.zip 2> wget.log

echo "Stopping NodeJS App"
KEYPAIR=/var/lib/jenkins/.ssh/eu-west-keypair-1.pem
ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$TEST_SERVER 'sudo service project-staffing status'
ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$TEST_SERVER "sudo bash -s" < infrastructure/killNodeProcess.sh

echo "Deploying NodeJS App"
ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$TEST_SERVER 'sudo rm -rf project-staffing*'
scp -i $KEYPAIR -o StrictHostKeyChecking=no project-staffing-$ARTIFACT_VERSION.zip ubuntu@$TEST_SERVER:

echo "Unpacking NodeJS App"
ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$TEST_SERVER 'sudo unzip project-staffing-*.zip -d project-staffing > unzip.log'

# echo "Starting NodeJS App"
# ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$TEST_SERVER 'sudo service project-staffing start'
