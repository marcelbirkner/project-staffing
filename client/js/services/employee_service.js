(function() {
  'use strict';

  angular.module('project-staffing')
    .factory('EmployeeService', function($http, $log, UrlService) {
      var url = UrlService.getUrl();
      return {
        deleteEmployee: function(id) {
          $log.debug('EmployeeService :: deleteEmployee with id ' + id);
          return $http.delete(url + '/api/mongo/employees/' + id);
        },
        saveAddress: function(id, employee) {
          $log.debug('EmployeeService :: saveAddress for employee with id ' + id);
          return $http.post(url + '/api/mongo/employees/' + id, JSON.stringify(employee));
        },
        addProject: function(employee) {
          $log.debug('EmployeeService :: addProject for employee with id ' + employee._id);
          return $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
        },
        deleteProject: function(employee) {
          $log.debug('EmployeeService :: deleteProject for employee with id ' + employee._id);
          return $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
        },
        deleteSkill: function(employee) {
          $log.debug('EmployeeService :: deleteSkill');
          return $http.post(url + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));
        },
        addSkill: function(employee) {
          $log.debug('EmployeeService :: addSkill');
          return $http.post(url + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));
        }
      };
    });

})();
