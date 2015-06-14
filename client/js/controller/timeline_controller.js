(function() {
  'use strict';

  angular.module('project-staffing')
    .controller('TimelineController', function($scope, ActivityService) {

      $scope.activityCtrl = ActivityService;

    });

})();
