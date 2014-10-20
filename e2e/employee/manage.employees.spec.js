describe('Manage Employees Page', function() {

  var ptor;

  var nameField = element(by.model('employeeCtrl.employee.name'));
  var emailField = element(by.model('employeeCtrl.employee.email'));
  var officeField = element(by.model('employeeCtrl.employee.office'));
  var addressField = element(by.model('employeeCtrl.employee.address'));
  var resumeField = element(by.model('employeeCtrl.employee.resume'));
  var twitterField = element(by.model('employeeCtrl.employee.twitter'));
  var xingField = element(by.model('employeeCtrl.employee.xing'));
  var saveButton = element(by.id('saveButton'));
  var resetButton = element(by.id('resetButton'));

  function createEmployee(name, office) {
    resetButton.click();
    nameField.sendKeys(name);
    emailField.sendKeys(name + '@codecentric.de');
    officeField.sendKeys(office);
    resumeField.sendKeys('http://link.centerdevice.de/downloads/' + name);
    twitterField.sendKeys(name + '-twitter');
    xingField.sendKeys(name + '@xing.de');
    saveButton.click();
  }

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navEmployees')).click();
    element(by.id('navManageEmployees')).click();
    var employees = element.all(by.id('deleteButton'))
    employees.count().then(function(count) {
      while(count > 0) {
        employees.first().click();
        count--;
      }
    });
  });

  it('should navigate to manage employees', function() {
    expect(ptor.getCurrentUrl()).toMatch(/#\/add-employee/);
  });

  it('should delete all existing employees', function() {
    var list = element.all(by.id('deleteButton'));
    expect(list.count()).toBe(0);
  });

  it('should create new employees', function() {
    createEmployee('John', 'Berlin');
    createEmployee('Max', 'Frankfurt');
    createEmployee('Daniel', 'München');
    createEmployee('Maria', 'Solingen');
    var list = element.all(by.id('deleteButton'));
    expect(list.count()).toBe(4);
  });

});