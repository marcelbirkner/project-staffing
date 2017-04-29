describe('Project Staffing Staff Project Page', () => {

  var ptor;

  beforeEach(() => {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navStaffProject')).click();
  });

  it('should navigate to staffing page', () => {
    expect(ptor.getCurrentUrl()).toMatch(/#\/staffing/);
  });

  it('should find customer location search field', () => {
    var list = element.all(by.id('spanCustomerLocation'));
    expect(list.count()).toBe(1);
  });

  it('should find skill search field', () => {
    var list = element.all(by.id('spanRequiredSkills'));
    expect(list.count()).toBe(1);
  });

});
