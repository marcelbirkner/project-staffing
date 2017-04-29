((() => {
  'use strict';

  angular.module('project-staffing')
    .controller('TimelineController', ($scope, ActivityService) => {

      $scope.activityCtrl = ActivityService;

    });

}))();
