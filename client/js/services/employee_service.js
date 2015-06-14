(function() {
  'use strict';

  angular.module('project-staffing')
    .factory('EmployeeService', function($http, $log, Url) {
      return {
        deleteEmployee: function(id) {
          $log.debug('EmployeeService :: deleteEmployee with id ' + id);
          return $http.delete(Url.getUrl() + '/api/mongo/employees/' + id);
        }
      };
    });

})();
