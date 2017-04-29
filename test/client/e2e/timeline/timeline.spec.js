describe('Project Staffing Timeline Page', () => {

  var ptor;

  beforeEach(() => {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navTimeline')).click();
  });

  it('should navigate to timeline page', () => {
    expect(ptor.getCurrentUrl()).toMatch(/#\/timeline/);
  });

  it('should find existing tab activities', () => {
    var list = element.all(by.id('tabActivities'));
    expect(list.count()).toBe(1);
  });

});
