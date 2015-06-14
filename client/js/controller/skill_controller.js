(function() {
  'use strict';

  angular.module('project-staffing').controller('SkillController', function($http, Url, ActivityService) {

    this.skill = '';

    this.deleteSkill = function(id, employee) {
      employee.skills.splice(id, 1);
      $http.post(Url.getUrl() + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

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

        $http.post(Url.getUrl() + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

        // TODO: get userid from session
        var user = 'jon';
        var msg = 'added skill';
        ActivityService.saveActivity(user, msg, this.skill);

        this.skill = '';
      }

    };

  });

})();
