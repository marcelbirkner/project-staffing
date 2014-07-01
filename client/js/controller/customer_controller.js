(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('CustomerController', function($http, $scope, $filter){

    console.log('Customer Controller');

    var company = this;
    company.customers = [];

    this.customer = {};

    $scope.details = {};
    $scope.options = {};

    $scope.form = {
      type: 'geocode',
      watchEnter: true
    };

    $http.get('http://localhost:9000/api/mongo/customers').success(function(data) {
        console.log('Get all customers from backend');
        console.log(data);
        company.customers = data;
    });

    this.addCustomer = function() {
        console.log('add customer');
        this.customer.companyaddress = $scope.details.geometry.location;
        $http.post('http://localhost:9000/api/mongo/customers', JSON.stringify(this.customer));

        $http.get('http://localhost:9000/api/mongo/customers').success(function(data) {
            console.log('Get all customers from backend');
            company.customers = data;
            console.log(data);
        });
    };

    this.deleteCustomer = function(id) {
      console.log('delete customer ' + id);
      $http.delete('http://localhost:9000/api/mongo/customers/' + id);

      for (var i in company.customers){
        console.log(company.customers[i]);
        console.log(i);
        if( company.customers[i]._id === id ) {
          console.log('Delete item from array');
          company.customers.splice(i,1);
        }
      }
    };

    this.resetForm = function() {
        console.log('reset form');
        this.customer = {};
    };

  });

})();