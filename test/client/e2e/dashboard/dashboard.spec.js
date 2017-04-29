describe('Project Staffing Dashboard Page', () => {

  var ptor;

  beforeEach(() => {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navDashboard')).click();
  });

  it('should navigate to dashboard page', () => {
    expect(ptor.getCurrentUrl()).toMatch(/#\/dashboard/);
  });

  it('should find map div', () => {
    var list = element.all(by.id('map_div'));
    expect(list.count()).toBe(1);
  });

  it('should find latest project div', () => {
    var list = element.all(by.id('latestprojects_div'));
    expect(list.count()).toBe(1);
  });
});
