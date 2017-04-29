((() => {
  'use strict';

  angular.module('project-staffing').controller('SkillController', function($http, Url, Activity) {

    var url = Url.getUrl();

    this.skill = '';

    this.deleteSkill = (id, employee) => {
      employee.skills.splice(id, 1);
      $http.post(url + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'julia';
      var msg = 'deleted skill';
      var object = employee.skills[id];
      Activity.saveActivity(user, msg, object);
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
      if( this.skill.length > 0 ) {
        employee.skills.push(this.skill);

        $http.post(url + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

        // TODO: get userid from session
        var user = 'jon';
        var msg = 'added skill';
        var object = this.skill;
        Activity.saveActivity(user, msg, object);

        this.skill = '';
      }

    };

  });

}))();
