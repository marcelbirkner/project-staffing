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

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();
    element(by.id('navEmployees')).click();
    element(by.id('navManageEmployees')).click();
    var employees = element.all(by.id('deleteButton'))
    employees.count().then(function(count) {
      while (count > 0) {
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
    createMultipleEmployees()
    var list = element.all(by.id('deleteButton'));
    expect(list.count()).toBe(4);
  });

  it('should find employee John on list search page', function() {
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

  it('should create employee John with three skills', function() {
    createEmployee('John', 'Berlin');
    element(by.id('resetButton')).click();
    element(by.id('editButton')).click();
    element(by.id('addSkillTab')).click();
    createSkill('Java');
    createSkill('MongoDB');
    createSkill('JavaScript');
    // var list = element.all(by.id('skill'));
    // expect(list.count()).toBe(3);
  });

});
