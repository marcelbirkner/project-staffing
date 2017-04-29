describe('Project Staffing Start Page', () => {

  var ptor;

  beforeEach(() => {
    browser.get('/');
    ptor = protractor.getInstance();
  });

  it('should navigate to timeline', () => {
    element(by.id('navTimeline')).click();
    expect(ptor.getCurrentUrl()).toMatch(/#\/timeline/);
    var child = element(by.id('tabActivities'));
    expect(child.getText()).toBe('All Activities');
  });

  it('should navigate to staff project', () => {
    element(by.id('navStaffProject')).click();
    expect(ptor.getCurrentUrl()).toMatch(/#\/staffing/);
    expect(element(by.id('map-canvas')).isDisplayed()).toBe(true);
  });

  it('should navigate to #/dashboard page when clicking', () => {
    element(by.id('navDashboard')).click();
    expect(ptor.getCurrentUrl()).toMatch(/#\/dashboard/);
    expect(element(by.id('map_div')).isDisplayed()).toBe(true);
    expect(element(by.id('table_div')).isDisplayed()).toBe(true);
    expect(element(by.id('latestprojects_div')).isDisplayed()).toBe(true);
  });

  it('should navigate to list employees', () => {
    expect(element(by.id('navListEmployees')).isDisplayed()).toBe(false);
    element(by.id('navEmployees')).click();
    element(by.id('navListEmployees')).click();
    expect(ptor.getCurrentUrl()).toMatch(/#\/list-employees/);
  });

  it('should navigate to manage employees', () => {
    expect(element(by.id('navManageEmployees')).isDisplayed()).toBe(false);
    element(by.id('navEmployees')).click();
    element(by.id('navManageEmployees')).click();
    expect(ptor.getCurrentUrl()).toMatch(/#\/add-employee/);
  });

  it('should navigate to manage customers', () => {
    element(by.id('navCustomers')).click();
    element(by.id('navManageCustomers')).click();
    expect(ptor.getCurrentUrl()).toMatch(/#\/add-customer/);
  });

  it('should navigate to list customers', () => {
    element(by.id('navCustomers')).click();
    element(by.id('navListCustomers')).click();
    expect(ptor.getCurrentUrl()).toMatch(/#\/list-customers/);
  });

});
