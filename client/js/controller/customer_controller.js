(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('CustomerController', function($http, $scope, $filter){

    console.log('Customer Controller');
 
    this.customer = {};
    
	$scope.details = {};
    $scope.options = {};
    
    $scope.form = {
      type: 'geocode',
      watchEnter: true
    };
    
    this.addCustomer = function() {
        console.log('add customer');
        this.customer.companyaddress = $scope.details.geometry.location;
        $http.post('http://localhost:9000/api/mongo/customers', JSON.stringify(this.customer));
    };
    
    this.resetForm = function() {
        console.log('reset form');    
        this.customer = {};
    };
    
  });

})();