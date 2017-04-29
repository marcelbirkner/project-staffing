((() => {
  'use strict';

  angular.module('project-staffing')
    .factory('CustomerService', ($http, $log, UrlService) => {
      var url = UrlService.getUrl();
      return {
        getCustomer() {
          $log.debug('CustomerService :: getCustomers');
          $http.get(url + '/api/mongo/customers').success(customer => customer);
        },
        addCustomer(customer) {
          $log.debug('CustomerService :: addCustomer ' + JSON.stringify(customer));
          return $http.post(url + '/api/mongo/customers', JSON.stringify(customer));
        }
      };
    });
}))();
