((() => {
  'use strict';

  angular
    .module('project-staffing')
    .controller('AddressController', function($scope, ActivityService, EmployeeService) {

      $scope.result = '';
      $scope.details = {};
      $scope.options = {};

      $scope.form = {
        type: 'geocode',
        watchEnter: true
      };

      this.saveAddress = employee => {
        var keys = Object.keys($scope.details.geometry.location);
        employee.homeaddress = {};
        employee.homeaddress.longitude = $scope.details.geometry.location[keys[0]];
        employee.homeaddress.latitude = $scope.details.geometry.location[keys[1]];
        EmployeeService.saveAddress(employee._id, employee);

        // TODO: get userid from session
        var user = 'max';
        var msg = 'updated the address of an existing employee';
        ActivityService.saveActivity(user, msg, employee.name);
      };

    });

}))();
