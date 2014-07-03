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
      
      var keys = Object.keys($scope.details.geometry.location);
      employee.homeaddress = {};
      employee.homeaddress.longitude = $scope.details.geometry.location[keys[0]];
      employee.homeaddress.latitude = $scope.details.geometry.location[keys[1]];

      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id, JSON.stringify(employee));
    };

  });

})();
