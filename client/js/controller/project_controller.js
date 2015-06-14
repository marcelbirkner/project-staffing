(function() {
  'use strict';

  angular.module('project-staffing').controller('ProjectController', function($http, Url, ActivityService) {

    var url = Url.getUrl();

    this.deleteProject = function(id, employee) {
      employee.projects.splice(id, 1);
      $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'julia';
      var msg = 'deleted a project';
      ActivityService.saveActivity(user, msg, employee.projects[id].name);
    };

    this.addProject = function(employee) {
      if (employee.projects == null) {
        employee.projects = [];
      }
      employee.projects.push(this.project);
      $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
      this.project = {};

      // TODO: get userid from session
      var user = 'maria';
      var msg = 'added a new project';
      ActivityService.saveActivity(user, msg, this.project.name);
    };

  });

})();
