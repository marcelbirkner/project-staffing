(function() {
  'use strict';

  angular.module('project-staffing').controller('ProjectController', function($http) {

    this.deleteProject = function(id, employee) {
      console.log('delete project ' + id);
      console.log(employee.projects[id]);
      employee.projects.splice(id, 1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'julia'
      var msg = 'deleted a project';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: employee.projects[id].name};
      $http.post('http://localhost:9000/api/mongo/activities', JSON.stringify(activity));
    };

    this.addProject = function(employee) {
      console.log(employee);
      if (employee.projects == null) {
        employee.projects = [];
      }
      employee.projects.push(this.project);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
      this.project = {};

      // TODO: get userid from session
      var user = 'maria'
      var msg = 'added a new project';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: this.project.name};
      $http.post('http://localhost:9000/api/mongo/activities', JSON.stringify(activity));
    };
  });

})();
