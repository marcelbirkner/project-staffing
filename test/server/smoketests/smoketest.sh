#!/bin/sh
# 
# Smoketests for REST API

# define variables
SERVER=$1:9000

# helper methods
validate() {
    echo "Response HTTP Code: $1"
    if [ $1 != $2 ]; then
      echo "Expected $2";
	  echo "Exit after error";
      exit 1;
    fi
	echo "";
}

#######################################################
# Basic Smoketests

echo "Get REST API Version"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/version`
validate $httpcode "200"

echo "Init MongoDB"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/mongo/init`
validate $httpcode "200"
sleep 2 # wait a moment for MongoDB to initialize the testdata

#######################################################
# Customer Smoketests

echo "GET all customers"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/mongo/customers`
validate $httpcode "200"


#######################################################
# Project Smoketests

echo "GET all projects"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/mongo/projects`
validate $httpcode "200"


#######################################################
# Employee Smoketests

echo "GET all employees"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/mongo/employees`
validate $httpcode "200"

echo "GET employee by id, that is too short, expect 500"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/mongo/employees/101010`
validate $httpcode "500"

echo "GET employee by id, that does not exist, expect 404"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/mongo/employees/1089dee9edcd86a419e8d9f1`
validate $httpcode "404"

echo "Search employee by email"
httpcode=`curl -i -o timmiller.tmp -w "%{http_code}" -X GET "$SERVER/api/mongo/search/employee?email=Tim.Miller@company.com" 2>/dev/null`
validate $httpcode "200"
id=`cat timmiller.tmp | grep "_id" | awk '{print $2}' | sed 's/"\|,//g'`

echo "Get employee with id $id"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/mongo/employees/$id`
validate $httpcode "200"

#########################################################
# Add new employee, search employee by name=smoketest to find id, delete employee by id
 
echo "POST new employee"
httpcode=`curl -H "Content-Type: application/json" -w "%{http_code}" -X POST $SERVER/api/mongo/employees -d @testEmployee.json 2>/dev/null`
validate $httpcode "200"

echo "Search employee by name=smoketest"
httpcode=`curl -i -o smoketest.tmp -w "%{http_code}" -X GET "$SERVER/api/mongo/search/employee?name=smoketest" 2>/dev/null`
validate $httpcode "200"
id=`cat smoketest.tmp | grep "_id" | awk '{print $2}' | sed 's/"\|,//g'`

echo "Get employee with id $id"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X GET $SERVER/api/mongo/employees/$id`
validate $httpcode "200"

echo "Delete employee with id $id"
httpcode=`curl -s -o /dev/null -w "%{http_code}" -X DELETE $SERVER/api/mongo/employees/$id`
validate $httpcode "200"

#########################################################
# Update existing employee - create employee, search employee by name=smoketest to find id, update employee by id with new data

echo "POST new employee"
httpcode=`curl -H "Content-Type: application/json" -w "%{http_code}" -X POST $SERVER/api/mongo/employees -d @testEmployee.json 2>/dev/null`
validate $httpcode "200"

echo "Search employee by name=smoketest"
httpcode=`curl -i -o smoketest.tmp -w "%{http_code}" -X GET "$SERVER/api/mongo/search/employee?name=smoketest" 2>/dev/null`
validate $httpcode "200"
id=`cat smoketest.tmp | grep "_id" | awk '{print $2}' | sed 's/"\|,//g'`

echo "Update existing employee with id $id"
httpcode=`curl -H "Content-Type: application/json" -w "%{http_code}" -X POST $SERVER/api/mongo/employees/$id -d @testUpdateEmployee.json 2>/dev/null`
validate $httpcode "200"

#########################################################
# Update existing employee with array of skills - search employee by name=smoketest to find id, add skills to employee

echo "Search employee by name=smoketest"
httpcode=`curl -i -o smoketest.tmp -w "%{http_code}" -X GET "$SERVER/api/mongo/search/employee?name=smoketest" 2>/dev/null`
validate $httpcode "200"
id=`cat smoketest.tmp | grep "_id" | awk '{print $2}' | sed 's/"\|,//g'`

echo "Update skills of existing employee with id $id"
httpcode=`curl -H "Content-Type: application/json" -w "%{http_code}" -X POST $SERVER/api/mongo/employees/$id/skills -d @testSkills.json 2>/dev/null`
validate $httpcode "200"

#########################################################
# Update existing employee with array of projects - search employee by name=smoketest to find id, add projects array to employee

echo "Search employee by name=smoketest"
httpcode=`curl -i -o smoketest.tmp -w "%{http_code}" -X GET "$SERVER/api/mongo/search/employee?name=smoketest" 2>/dev/null`
validate $httpcode "200"
id=`cat smoketest.tmp | grep "_id" | awk '{print $2}' | sed 's/"\|,//g'`

echo "Update projects of existing employee with id $id"
httpcode=`curl -H "Content-Type: application/json" -w "%{http_code}" -X POST $SERVER/api/mongo/employees/$id/projects -d @testProjects.json 2>/dev/null`
validate $httpcode "200"


#########################################################
# Search list of employees that have certain skills 

echo "Search employees with skills: java & tdd"
httpcode=`curl -i -o smoketest.tmp -w "%{http_code}" -X GET "$SERVER/api/mongo/search/employees/skills?skills=java&skills=tdd" 2>/dev/null`
validate $httpcode "200"

#########################################################

echo "Clean temporary test data"
rm -rf *.tmp

echo "Done"
