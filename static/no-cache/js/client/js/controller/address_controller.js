(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('AddressController', function($http, $scope, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' +
      $location.port();

    $scope.result = '';
    $scope.details = {};
    $scope.options = {};

    $scope.form = {
      type : 'geocode',
      watchEnter : true
    };

    this.saveAddress = function(employee) {
      var keys = Object.keys($scope.details.geometry.location);
      employee.homeaddress = {};
      employee.homeaddress.longitude =
        $scope.details.geometry.location[keys[0]];
      employee.homeaddress.latitude = $scope.details.geometry.location[keys[1]];

      $http.post(url + '/api/mongo/employees/' + employee._id,
        JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'max';
      var msg = 'updated the address of an existing employee ';
      var activity = {
        timestamp: new Date(),
        subject: user,
        action: msg,
        object: employee.name
      };
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

    };

  });

})();
