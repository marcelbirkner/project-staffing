describe('Project Staffing Timeline Page', function() {

  var ptor;

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navDashboard')).click();
  });

  it('should navigate to dashboard page', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/dashboard/);
  });

  it('should find map div', function() {
    var list = element.all(by.id('map_div'));
    expect(list.count()).toBe(1);
  });

  it('should find latest project div', function() {
    var list = element.all(by.id('latestprojects_div'));
    expect(list.count()).toBe(1);
  });
});
