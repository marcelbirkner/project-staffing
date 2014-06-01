(function(){
  var app = angular.module('tab-controller', []);

  /**
   * Project Tab Controller
   */
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

  /**
   * Skill Tab Controller
   */
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

	  $http.post('http://localhost:9000/api/mongo/employees/'+employee._id+'/skills',JSON.stringify(employee));

	  this.skill = "";
    };
  }]);
  
})();