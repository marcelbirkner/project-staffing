(function() {
  'use strict';

  angular.module('project-staffing').controller('TimelineController', function($http, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    var timeline = this;
    timeline.list = [];

    $http.get(url + '/api/mongo/activities').success(function(data) {
      timeline.list = data;
    });
  });

})();
