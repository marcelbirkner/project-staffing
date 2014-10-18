# End-2-End Integration Tests

## Setup

Use npm to install Protractor globally with:

```
npm install -g protractor
```

The webdriver-manager is a helper tool to easily get an instance of a Selenium Server running. Use it to download the necessary binaries with:

```
webdriver-manager update
```

Now start up a server with:

```
webdriver-manager start
```

This will start up a Selenium Server and will output a bunch of info logs. Your Protractor test will send requests to this server to control a local browser. Leave this server running throughout the tutorial. You can see information about the status of the server at  [http://localhost:4444/wd/hub](http://localhost:4444/wd/hub).

## Run E2E-Tests

Now run the test with

```
protractor e2e/conf.js
```
## E2E Result Example Output

```
$ protractor e2e/conf.js
Using the selenium server at http://localhost:4444/wd/hub
............

Finished in 26.042 seconds
12 tests, 20 assertions, 0 failures
```