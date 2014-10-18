describe('Project Staffing Start Page', function() {

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

});