describe('Project Staffing Start Page', function() {

  var ptor;

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();
  });

  it('should load the home page', function() {
    var ele = by.id('main');
    expect(ptor.isElementPresent(ele)).toBe(true);
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Project Staffing');
  });

  it('Startpage should have "Transparency, Satisfaction, Optimization" title', function() {
    var child = element(by.css('.panel-body h2'));
    expect(child.getText()).toBe('Transparency, Satisfaction, Optimization');
  });

});