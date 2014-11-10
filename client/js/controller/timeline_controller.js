(function() {
  'use strict';

  angular.module('project-staffing')
    .controller('TimelineController', function($scope, Activity) {

    $scope.activityCtrl = Activity;

  });

})();
