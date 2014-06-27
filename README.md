# Getting started

## Starting NodeJS Server

```bash
npm install

# start node server
node server.js

# Alternative: start node server via supervisor
supervisor server.js
```

## Build client assets with gulp (streaming build system)

```bash
# install gulp and the gulp plugins
npm install 

# install gulp binary in the path
npm i -g gulp

# running gulp
gulp watch
```

## Starting MongoDB Backend

```bash
// Windows
mongod.exe --dbpath "data\mongodb"

// Linux
mongod --dbpath "data/mongodb"
```

After you started the server, you can access the webapp under: <a href="http://localhost:9000">http://localhost:9000</a>

## Technologies used

* NodeJS, ExpressJS
* Bootstrap CSS/JavaScript
* Google Maps API
* Google Visulization API
* MongoDB

# REST API

* Root Resource: [http://localhost:9000/api/](http://localhost:9000/api/)

## Access MongoDB data

To initialize the MongoDB with test data use: 

* [http://localhost:9000/api/mongo/init](http://localhost:9000/api/mongo/init)

Get all customers that are stored in MongoDB

* [http://localhost:9000/api/mongo/customers](http://localhost:9000/api/mongo/customers)

Get all projects that are stored in MongoDB

* [http://localhost:9000/api/mongo/projects](http://localhost:9000/api/mongo/projects)

Get all employees that are stored in MongoDB

* [http://localhost:9000/api/mongo/employees](http://localhost:9000/api/mongo/employees)

## Search MongoDB data

Find Employees by Twitter handle

* [http://localhost:9000/api/mongo/search/employee?twitter=@maxm](http://localhost:9000/api/mongo/search/employee?twitter=@maxm)

Find Employees by Name

* [http://localhost:9000/api/mongo/search/employee?name=Max%20Mustermann](http://localhost:9000/api/mongo/search/employee?name=Max%20Mustermann)

Find employee by Skill

* [http://localhost:9000/api/mongo/search/employees/skills?skills=neo4j](http://localhost:9000/api/mongo/search/employees/skills?skills=neo4j)

# License (MIT)

Copyright (c) 2013 codecentric AG

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.