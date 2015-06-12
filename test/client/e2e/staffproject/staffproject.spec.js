describe('Project Staffing Timeline Page', function() {

  var ptor;

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navStaffProject')).click();
  });

  it('should navigate to staffing page', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/staffing/);
  });

  it('should find customer location search field', function() {
    var list = element.all(by.id('spanCustomerLocation'));
    expect(list.count()).toBe(1);
  });

  it('should find skill search field', function() {
    var list = element.all(by.id('spanRequiredSkills'));
    expect(list.count()).toBe(1);
  });

});
