(function() {
  'use strict';

  angular.module('project-staffing').controller('SkillController', function($http) {

    this.skill = '';

    this.deleteSkill = function(id, employee) {
      console.log('delete skill ' + id);
      console.log(employee.skills[id]);
      employee.skills.splice(id, 1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'julia'
      var msg = 'deleted skill';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: employee.skills[id]};
      $http.post('http://localhost:9000/api/mongo/activities', JSON.stringify(activity));

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

      // TODO: get userid from session
      var user = 'jon'
      var msg = 'added skill';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: this.skill};
      $http.post('http://localhost:9000/api/mongo/activities', JSON.stringify(activity));

      this.skill = '';
    };
  });

})();
