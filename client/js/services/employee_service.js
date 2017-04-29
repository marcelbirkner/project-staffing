((() => {
  'use strict';

  angular.module('project-staffing')
    .factory('EmployeeService', ($http, $log, UrlService) => {
      var url = UrlService.getUrl();
      return {
        deleteEmployee(id) {
          $log.debug('EmployeeService :: deleteEmployee with id ' + id);
          return $http.delete(url + '/api/mongo/employees/' + id);
        },
        saveAddress(id, employee) {
          $log.debug('EmployeeService :: saveAddress for employee with id ' + id);
          return $http.post(url + '/api/mongo/employees/' + id, JSON.stringify(employee));
        },
        addProject(employee) {
          $log.debug('EmployeeService :: addProject for employee with id ' + employee._id);
          return $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
        },
        deleteProject(employee) {
          $log.debug('EmployeeService :: deleteProject for employee with id ' + employee._id);
          return $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
        },
        deleteSkill(employee) {
          $log.debug('EmployeeService :: deleteSkill');
          return $http.post(url + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));
        },
        addSkill(employee) {
          $log.debug('EmployeeService :: addSkill');
          return $http.post(url + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));
        }
      };
    });

}))();
