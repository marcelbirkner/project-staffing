(function() {
  'use strict';

  angular.module('project-staffing')
    .factory('CustomerService', function($http, $log, UrlService) {
      var url = UrlService.getUrl();
      return {
        getCustomer: function() {
          $log.debug('CustomerService :: getCustomers');
          $http.get(url + '/api/mongo/customers').success(function(customer) {
            return customer;
          });
        },
        addCustomer: function(customer) {
          $log.debug('CustomerService :: addCustomer ' + JSON.stringify(customer));
          return $http.post(url + '/api/mongo/customers', JSON.stringify(customer));
        }
      };
    });
})();
