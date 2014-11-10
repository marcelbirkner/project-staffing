(function() {
  'use strict';

  angular.module('project-staffing')
    .factory('Url', function($location) {
      return {
        getUrl: function() {
          return $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }
      };
    });

})();
