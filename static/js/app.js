(function() {
  var app = angular.module('employee', []);

  app.controller('ProjectController', ['$http', function($http) {
    var customerproject = {};

    this.addProject = function(employee) {
	  console.log(employee);
	  if( employee.customerprojects == null ) {
		employee.customerprojects = [];
	  }
	  employee.customerprojects.push(customerproject);
	  
	  $http.post('http://localhost:9000/api/mongo/employees/'+employee._id+'/project',JSON.stringify(employee));
    };
  }]);

  app.controller('SkillController', ['$http', function($http) {
    var skill = "";

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

	  $http.post('http://localhost:9000/api/mongo/employees/'+employee._id+'/skill',JSON.stringify(employee));

	  this.skill = "";
    };
  }]);
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
  app.controller('EmployeeController', ['$http', function($http){
    var company = this;
	
	company.employees = [];
	$http.get('http://localhost:9000/api/mongo/employees').success(function(data) {
		company.employees = data;
	});
	
	this.employees = company.employees;
	
	this.employee = {};
	this.editEmployee = function(email) {
		for (var i in this.employees){
			if( this.employees[i].email === email ) {
				console.log('Edit Employee');
				this.employee = this.employees[i];			
			}
		} 
	};
	this.addEmployee = function(employees) {
		this.employee.createdOn = Date.now();
		employees.push(this.employee);
		
		console.log(this.employee);
		$http.post('http://localhost:9000/api/mongo/employees',JSON.stringify(this.employee));
		this.employee = {};
	};  
	this.deleteEmployee = function(id) {
		console.log(JSON.stringify(id));		
		$http.delete('http://localhost:9000/api/mongo/employees/'+id);		
		
		for (var i in this.employees){
			console.log(this.employees[i]);
			console.log(i);
			if( this.employees[i].email === email ) {
				console.log('Delete item from array');
				this.employees.splice(i,1);				
			}
		}
	};
	
  } ] );
})();
