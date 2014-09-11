(function() {
  'use strict';

  angular.module('project-staffing').controller('TimelineController', function($http) {

    var timeline = this;

    timeline.list = [];

    $http.get('http://localhost:9000/api/mongo/timeline').success(function(data) {
      console.log('Get recent timeline entries');
      timeline.list = data;
    });
  });

})();
