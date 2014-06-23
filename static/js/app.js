(function() {
  'use strict';

  angular.module('project-staffing', [
    'ngRoute',
    'ngAutocomplete',
    'employee-directives',
  ]);

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('AddressController', function($http, $scope){

    $scope.result = '';
	  $scope.details = {};
    $scope.options = {};

    $scope.form = {
      type: 'geocode',
      watchEnter: true
    };

    this.saveAddress = function(employee) {
      console.log('update existing employee');
      console.log($scope.details);
      employee.homeaddress = $scope.details.geometry.location;
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id, JSON.stringify(employee));
    };

  });

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('EmployeeController', function($http) {

    var company = this;

    this.tab = 1;
    this.employees = company.employees;
    this.employee = {};

    company.employees = [];

    $http.get('http://localhost:9000/api/mongo/employees').success(function(data) {
      console.log('Get all employees from backend');
      company.employees = data;
    });

    this.showTabs = function(){
      console.log('show tabs');
      if( this.employee._id === undefined ) {
        return false;
      }
      return true;
    };

    this.editEmployee = function(id) {
      for (var i in this.employees){
        if( this.employees[i]._id === id ) {
          console.log('Edit Employee');
          this.employee = this.employees[i];
        }
      }
    };

    this.resetForm = function() {
      this.employee = {};
    };

    this.addEmployee = function() {
      if( this.employee._id === undefined ) {
        console.log('add new employee');
        $http.post('http://localhost:9000/api/mongo/employees', JSON.stringify(this.employee));
      } else {
        console.log('update existing employee');
        $http.post('http://localhost:9000/api/mongo/employees/' + this.employee._id, JSON.stringify(this.employee));
      }
      $http.get('http://localhost:9000/api/mongo/employees').success(function(data) {
        console.log('Update all employees from backend');
        company.employees = data;
      });
      this.employee = {};
    };

    this.deleteEmployee = function(id) {
      console.log('Delete employee with id: ' + JSON.stringify(id));
      $http.delete('http://localhost:9000/api/mongo/employees/' + id);

      for (var i in this.employees){
        console.log(this.employees[i]);
        console.log(i);
        if( this.employees[i]._id === id ) {
          console.log('Delete item from array');
          this.employees.splice(i,1);
        }
      }
    };

    });

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('NavigationController', function($scope){
    $scope.active = '';

    $scope.set = function(active) {
      $scope.active = active;
    };
  });

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('ProjectController', function($http){

    this.deleteProject = function(id, employee) {
      console.log('delete project ' + id);
      console.log(employee.projects[id]);
      employee.projects.splice(id,1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
    };

    this.addProject = function(employee) {
      console.log(employee);
      if( employee.projects == null ) {
        employee.projects = [];
      }
      employee.projects.push(this.project);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
      this.project = {};
    };
  });

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('SkillController', function($http){

    this.skill = '';

    this.deleteSkill = function(id,employee) {
      console.log('delete skill ' + id);
      console.log(employee.skills[id]);
      employee.skills.splice(id,1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));
    };

    this.addSkill = function(employee) {
      for(var skill in employee.skills ) {
        if( skill === this.skill ) {
          return;
        }
      }
      if( employee.skills == null ) {
        employee.skills = [];
      }
      employee.skills.push(this.skill);

      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

      this.skill = '';
    };
  });

})();

(function(){
  'use strict';

  var app = angular.module('employee-directives', []);

  app.directive('navigation', function(){
	return {
		restrict: 'E',
		templateUrl: 'navigation.html'
	};
  });
  app.directive('employeeTable', function(){
	return {
		restrict: 'E',
		templateUrl: 'employee-table.html'
	};
  });
  app.directive('employeeForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'employee-form.html'
	};
  });
  app.directive('skillForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'skill-form.html'
	};
  });
  app.directive('projectForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'project-form.html'
	};
  });
  app.directive('homeaddressForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'homeaddress-form.html'
	};
  });
})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/index.html',
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
    })
    .when('/list-employees', {
      templateUrl: 'views/list_employees.html',
      controller: 'EmployeeController',
      controllerAs: 'employeeCtrl',
    })
    .when('/add-employee', {
      templateUrl: 'views/add_employee.html',
      controller: 'EmployeeController',
      controllerAs: 'employeeCtrl',
    })
    .when('/list-customers', {
      templateUrl: 'views/list_customers.html',
    })
    .when('/add-customer', {
      templateUrl: 'views/add_customer.html',
    })
    .when('/duesseldorf', {
      templateUrl: 'views/duesseldorf.html',
    })
    .when('/help', {
      templateUrl: 'views/help.html',
    })
    .otherwise({
      redirectTo: '/',
    });
  });
})();

