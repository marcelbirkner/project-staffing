((() => {
  'use strict';

  angular.module('project-staffing')
    .factory('ActivityService', ($http, UrlService, $log) => {
      var url = UrlService.getUrl();
      var activities = [];
      $http.get(url + '/api/mongo/activities').success(activitiesData => {
        activities = activitiesData;
      });
      return {
        saveActivity(username, action, object) {
          $log.debug('ActivityService :: saveActivity');
          var activity = {
            timestamp: new Date(),
            subject: username,
            action,
            object
          };
          activities.push(activity);
          $http.post(url + '/api/mongo/activities', JSON.stringify(activity));
        },
        getActivities() {
          $log.debug('ActivityService :: getActivities');
          return activities;
        }
      };
    });

}))();
