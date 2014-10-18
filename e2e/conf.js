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
  onPrepare: function() {
    browser.driver.manage().window().maximize();
  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
}