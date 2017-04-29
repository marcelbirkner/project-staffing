describe('Project Staffing Start Page', () => {

  var ptor;

  beforeEach(() => {
    browser.get('/');
    ptor = protractor.getInstance();
  });

  it('should load the home page', () => {
    var ele = by.id('main');
    expect(ptor.isElementPresent(ele)).toBe(true);
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Project Staffing');
  });

  it('Startpage should have "Transparency, Satisfaction, Optimization" title', () => {
    var child = element(by.css('.panel-body h2'));
    expect(child.getText()).toBe('Transparency, Satisfaction, Optimization');
  });

});