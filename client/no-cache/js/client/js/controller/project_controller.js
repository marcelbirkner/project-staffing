((() => {
  'use strict';

  angular.module('project-staffing').controller('ProjectController', function($http, Url) {

    var url = Url.getUrl();

    this.deleteProject = (id, employee) => {
      employee.projects.splice(id, 1);
      $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'julia';
      var msg = 'deleted a project';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: employee.projects[id].name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));
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
      var activity = {timestamp: new Date(), subject: user, action: msg, object: this.project.name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));
    };

  });

}))();
