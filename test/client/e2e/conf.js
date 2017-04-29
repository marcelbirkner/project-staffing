exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:9000/',
  specs: ['./**/*.spec.js'],
  capabilities : {
    browserName : 'chrome',
    'chromeOptions': {
        args: ['--test-type']
    }
  },
  onPrepare() {
    browser.driver.manage().window().maximize();
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter('xmloutput', true, true)
    );
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
}