describe('Project Staffing Timeline Page', function() {

  var ptor;

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navTimeline')).click();
  });

  it('should navigate to timeline page', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/timeline/);
  });

  it('should delete all existing employees', function() {
    var list = element.all(by.id('tabActivities'));
    expect(list.count()).toBe(1);
  });

});
