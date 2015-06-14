(function() {
  'use strict';

  angular.module('project-staffing').controller('SkillController', function($http, Url, ActivityService, EmployeeService) {

    this.skill = '';

    this.deleteSkill = function(id, employee) {
      employee.skills.splice(id, 1);
      EmployeeService.deleteSkill(employee);

      // TODO: get userid from session
      var user = 'julia';
      var msg = 'deleted skill';
      var object = employee.skills[id];
      ActivityService.saveActivity(user, msg, object);
    };

    this.addSkill = function(employee) {
      for (var skill in employee.skills) {
        if (skill === this.skill) {
          return;
        }
      }

      if (employee.skills == null) {
        employee.skills = [];
      }

      if (this.skill.length > 0) {
        employee.skills.push(this.skill);
        EmployeeService.addSkill(employee);

        // TODO: get userid from session
        var user = 'jon';
        var msg = 'added skill';
        ActivityService.saveActivity(user, msg, this.skill);

        this.skill = '';
      }
    };
  });
})();
