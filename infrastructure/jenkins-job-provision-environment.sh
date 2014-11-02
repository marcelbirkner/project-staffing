#!/bin/sh

ARTIFACT_VERSION=$1
NEXUS_SERVER=$2
ENVIRONMENT=$3

echo "Downloading project-staffing-$ARTIFACT_VERSION.zip"
wget $NEXUS_SERVER/nexus/service/local/repositories/releases/content/de/codecentric/js/project-staffing/$ARTIFACT_VERSION/project-staffing-$ARTIFACT_VERSION.zip 2> wget.log

echo "Stopping NodeJS App"
KEYPAIR=/var/lib/jenkins/.ssh/eu-west-keypair-1.pem
ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$ENVIRONMENT 'sudo service project-staffing status'
ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$ENVIRONMENT "sudo bash -s" < infrastructure/killNodeProcess.sh

echo "Deploying NodeJS App"
ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$ENVIRONMENT 'sudo rm -rf project-staffing*'
scp -i $KEYPAIR -o StrictHostKeyChecking=no project-staffing-$ARTIFACT_VERSION.zip ubuntu@$ENVIRONMENT:

echo "Unpacking NodeJS App"
ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$ENVIRONMENT 'sudo unzip project-staffing-*.zip -d project-staffing > unzip.log'
# ssh -i $KEYPAIR -o StrictHostKeyChecking=no ubuntu@$ENVIRONMENT 'sudo service project-staffing start'
