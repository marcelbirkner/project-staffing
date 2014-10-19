describe('List All Employees Page', function() {

  var ptor;

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();

    element(by.id('navEmployees')).click();
    element(by.id('navListEmployees')).click();
  });

  it('should navigate to list employees page', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/list-employees/);
  });

  it('should delete all existing employees', function() {
    var list = element.all(by.css('.btn-danger')).each(function(element) {
      element.click();
    });

    list = element.all(by.css('.btn-danger'));
    expect(list.count()).toBe(0);
  });

});