describe('List customer on map tests:', function() {

  var ptor;

  var customerField = element(by.model('customerCtrl.customer.company'));
  var industryField = element(by.model('customerCtrl.customer.industry'));
  var addressField = element(by.id('searchField'));
  var saveButton = element(by.id('saveButton'));
  var clearButton = element(by.id('clearButton'));

  function createCustomer(company, industry, address) {
    clearButton.click();
    customerField.sendKeys(company);
    industryField.sendKeys(industry);
    addressField.sendKeys(address);
    browser.driver.sleep(500); // for wait search result
    ptor.actions().sendKeys(protractor.Key.DOWN).perform();
    ptor.actions().sendKeys(protractor.Key.TAB).perform();    
    saveButton.click();
  }

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navCustomers')).click();
    element(by.id('navManageCustomers')).click(); 
 	// delete all existing customer
    var customers = element.all(by.id('deleteButton'))
    customers.count().then(function(count) {
      while(count > 0) {
        customers.first().click();
        count--;
      }
    });
    createCustomer('Test Company 1', 'IT', 'Köln');
    element(by.id('navCustomers')).click();
    element(by.id('navListCustomers')).click();
  });

  it('should navigate to manage customers', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/list-customers/);
  });

  it('navigate to cologne should find customer on map', function() {
    var customerField = element(by.model('employeeCtrl.employee.address'));
    customerField.sendKeys('Köln');
	browser.driver.sleep(500);
    ptor.actions().sendKeys(protractor.Key.DOWN).perform();
    var searchButton = element(by.id('searchButton'));
	searchButton.click();
	browser.driver.sleep(500);
	// check that element is present on google map initialized map
	element.all(by.css('.gm-style-mtc')).then(function(items) {
	  expect(items.length > 0).toBeTruthy();
	});
  });

});