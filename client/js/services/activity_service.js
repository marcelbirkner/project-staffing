(function() {
  'use strict';

  angular.module('project-staffing')
    .factory('ActivityService', function($http, Url, $log) {
      var activities = [];
      $http.get(Url.getUrl() + '/api/mongo/activities').success(function(
        activitiesData) {
        activities = activitiesData;
      });
      return {
        saveActivity: function(username, action, object) {
          $log.debug('ActivityService :: saveActivity');
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
          $log.debug('ActivityService :: getActivities');
          return activities;
        }
      };
    });

})();
