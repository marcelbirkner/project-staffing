(function() {
  'use strict';

  angular.module('project-staffing')
    .controller('TimelineController', function($scope, $http, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    $http.get(url + '/api/mongo/activities').success(function(activitiesData) {
      $scope.activities = activitiesData;
    });
  });

})();
