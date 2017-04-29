((() => {
  'use strict';

  angular.module('project-staffing').controller('NavigationController', $scope => {
    $scope.active = '';

    $scope.set = active => {
      $scope.active = active;
    };
  });

}))();
