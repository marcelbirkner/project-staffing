((() => {
  'use strict';

  angular.module('project-staffing')
    .factory('Activity', ($http, Url) => {
      var activities = [];
      $http.get(Url.getUrl() + '/api/mongo/activities').success(activitiesData => {
        activities = activitiesData;
      });
      return {
        saveActivity(username, action, object) {
          var activity = {
            timestamp: new Date(),
            subject: username,
            action,
            object
          };
          activities.push(activity);
          $http.post(Url.getUrl() + '/api/mongo/activities', JSON.stringify(activity));
        },
        getActivities() {
          return activities;
        }
      };
    });

}))();
