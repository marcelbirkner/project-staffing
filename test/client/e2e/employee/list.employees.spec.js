describe('Listing Employees Page', () => {

  var ptor;

  beforeEach(() => {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navEmployees')).click();
    element(by.id('navListEmployees')).click();
  });

  it('should navigate to list employees page', () => {
    expect(ptor.getCurrentUrl()).toMatch(/#\/list-employees/);
  });

  it('should delete all existing employees', () => {
    var employees = element.all(by.id('deleteButton'))
    employees.count().then(count => {
      while(count > 0) {
        employees.first().click();
        count--;
      }
    });
    list = element.all(by.id('employees'));
    expect(list.count()).toBe(0);
  });

});