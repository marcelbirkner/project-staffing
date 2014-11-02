describe('Delete all customer and add new customer', function() {

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
    var customers = element.all(by.id('deleteButton'))
    customers.count().then(function(count) {
      while(count > 0) {
        customers.first().click();
        count--;
      }
    });
  });

  it('should navigate to manage customers', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/add-customer/);
  });

  it('all customers should have been deleted', function() {
    var list = element.all(by.id('deleteButton'));
    expect(list.count()).toBe(0);
  });

  it('Add new customer', function() {
    createCustomer('Test Company 1', 'IT', 'Köln');
    createCustomer('Test Company 2', 'Telecommunication', 'Bonn');
    createCustomer('Test Company 3', 'Sport', 'Berlin');
    createCustomer('Test Company 4', 'Banking', 'Frankfurt');
    var listAfter = element.all(by.id('deleteButton'));
    expect(listAfter.count()).toBe(4);
  });

});