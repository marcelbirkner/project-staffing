(function() {
  'use strict';

  angular.module('project-staffing').controller('AddressController', function($http, $scope) {

    $scope.result = '';
    $scope.details = {};
    $scope.options = {};

    $scope.form = {
      type : 'geocode',
      watchEnter : true
    };

    this.saveAddress = function(employee) {
      console.log('update existing employee');
      console.log($scope.details);
      employee.homeaddress = $scope.details.geometry.location;
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id, JSON.stringify(employee));
    };

  });

})();
