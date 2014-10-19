describe('Manage Employees Page', function() {

  var ptor;

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();

    element(by.id('navEmployees')).click();
    element(by.id('navManageEmployees')).click();
  });

  it('should navigate to manage employees', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/add-employee/);
  });

  it('should delete all existing employees', function() {
    var list = element.all(by.css('.btn-danger')).each(function(element) {
      element.click();
    });

    list = element.all(by.css('.btn-danger'));
    expect(list.count()).toBe(0);
  });

});