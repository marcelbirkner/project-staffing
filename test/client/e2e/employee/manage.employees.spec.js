describe('Manage Employees Page', () => {

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
    emailField.sendKeys(name.toLowerCase() + '@codecentric.de');
    officeField.sendKeys(office);
    resumeField.sendKeys('http://link.centerdevice.de/downloads/' + name.toLowerCase());
    twitterField.sendKeys(name.toLowerCase() + '-twitter');
    xingField.sendKeys(name.toLowerCase() + '@xing.de');
    saveButton.click();
  }

  function createMultipleEmployees() {
    createEmployee('John', 'Berlin');
    createEmployee('Max', 'Frankfurt');
    createEmployee('Daniel', 'München');
    createEmployee('Maria', 'Solingen');
  }

  function createSkill(skill) {
    element(by.model('skillCtrl.skill')).sendKeys(skill);
    element(by.id('saveSkillButton')).click();
  }

  beforeEach(() => {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navEmployees')).click();
    element(by.id('navManageEmployees')).click();
    var employees = element.all(by.id('deleteButton'))
    employees.count().then(count => {
      while (count > 0) {
        employees.first().click();
        count--;
      }
    });
  });

  it('should navigate to manage employees', () => {
    expect(ptor.getCurrentUrl()).toMatch(/#\/add-employee/);
  });

  it('should delete all existing employees', () => {
    var list = element.all(by.id('deleteButton'));
    expect(list.count()).toBe(0);
  });

  it('should create new employees', () => {
    createMultipleEmployees()
    var list = element.all(by.id('deleteButton'));
    expect(list.count()).toBe(4);
  });

  it('should find employee John on list search page', () => {
    createMultipleEmployees();
    element(by.id('navEmployees')).click();
    element(by.id('navListEmployees')).click();
    element(by.id('searchText')).sendKeys('Ma');
    var list = element.all(by.id('deleteButton'));
    expect(list.count()).toBe(2);
    element(by.id('searchText')).sendKeys('ria');
    var list = element.all(by.id('deleteButton'));
    expect(list.count()).toBe(1);
  });

});
