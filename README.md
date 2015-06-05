# Project overview

- Getting started - http://marcelbirkner.github.io/project-staffing/quickstart.html
- Features & Screenshots - http://marcelbirkner.github.io/project-staffing/slides/application-intro-slides/#1
- REST API - http://marcelbirkner.github.io/project-staffing/rest-api.html
- Frontend Tests
 - End-2-End Integration Tests - http://marcelbirkner.github.io/project-staffing/e2e-tests.html
 - Unit Tests - http://marcelbirkner.github.io/project-staffing/unit-tests.html

# Dockerized App

- Requirement: Docker >1.0.0 needs to be installed.
- For Linux add "sudo" before each docker command

## Starting MongoDB

```
docker run --name mongodb -d mongo
```

## Starting NodeJS Server-Side WebApp

The first command builds a new docker image named *<username>/centos-nodejs-projectstaffing* based on the provided source code. The second command starts the new docker container and links it together with the *mongodb* docker container. That allows the nodejs app to connect to the mongodb database.

```
docker build -t <username>/centos-nodejs-projectstaffing .
docker run -p 9000:9000 --name staffingapp --link mongodb:MONGODB -d <username>/centos-nodejs-projectstaffing
```

# Conferences

- Continuous Lifecycle 2014 
 - Agenda - http://www.continuouslifecycle.de/lecture.php?id=4566
 - Slides - http://marcelbirkner.github.io/project-staffing/slides/introduction/
 
# License (MIT)

Copyright (c) 2015 codecentric AG

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
