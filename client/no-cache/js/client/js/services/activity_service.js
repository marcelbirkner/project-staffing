(function() {
  'use strict';

  angular.module('project-staffing')
    .factory('Activity', function($http, Url) {
      var activities = [];
      $http.get(Url.getUrl() + '/api/mongo/activities').success(function(activitiesData) {
        activities = activitiesData;
      });
      return {
        saveActivity: function(username, action, object) {
          var activity = {
            timestamp: new Date(),
            subject: username,
            action: action,
            object: object
          };
          activities.push(activity);
          $http.post(Url.getUrl() + '/api/mongo/activities', JSON.stringify(activity));
        },
        getActivities: function() {
          return activities;
        }
      };
    });

})();
