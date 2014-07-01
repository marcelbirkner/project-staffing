(function() {
  'use strict';

  angular.module('project-staffing').controller('NavigationController', function($scope) {
    $scope.active = '';

    $scope.set = function(active) {
      $scope.active = active;
    };
  });

})();
