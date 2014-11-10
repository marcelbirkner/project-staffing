(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('AddressController', function($http, $scope, Url, Activity) {

    var url = Url.getUrl();

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
      employee.homeaddress.longitude = $scope.details.geometry.location[keys[0]];
      employee.homeaddress.latitude = $scope.details.geometry.location[keys[1]];

      $http.post(url + '/api/mongo/employees/' + employee._id, JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'max';
      var msg = 'updated the address of an existing employee';
      var object = employee.name;
      Activity.saveActivity(user, msg, object);
    };

  });

})();
