describe('Manage Customer Page', function() {

  var ptor;

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();

    element(by.id('navCustomers')).click();
    element(by.id('navManageCustomers')).click();
  });

  it('should navigate to manage customers', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/add-customer/);
  });

});