(function() {
  'use strict';

  angular.module('project-staffing').controller('SkillController', function($http) {

    this.skill = '';

    this.deleteSkill = function(id, employee) {
      console.log('delete skill ' + id);
      console.log(employee.skills[id]);
      employee.skills.splice(id, 1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));
    };

    this.addSkill = function(employee) {
      for ( var skill in employee.skills) {
        if (skill === this.skill) {
          return;
        }
      }
      if (employee.skills == null) {
        employee.skills = [];
      }
      employee.skills.push(this.skill);

      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

      this.skill = '';
    };
  });

})();
