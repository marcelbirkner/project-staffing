(function() {
  'use strict';

  angular.module('project-staffing').controller('ProjectController', function($http, UrlService, EmployeeService, ActivityService) {

    this.deleteProject = function(id, employee) {
      employee.projects.splice(id, 1);
      EmployeeService.deleteProject(employee);

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
      EmployeeService.addProject(employee);
      this.project = {};

      // TODO: get userid from session
      var user = 'maria';
      var msg = 'added a new project';
      ActivityService.saveActivity(user, msg, this.project.name);
    };

  });

})();
