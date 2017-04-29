((() => {
  'use strict';

  angular.module('project-staffing')
    .controller('TimelineController', ($scope, Activity) => {

    $scope.activityCtrl = Activity;

  });

}))();
