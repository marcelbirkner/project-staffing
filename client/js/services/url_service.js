(function() {
  'use strict';

  angular.module('project-staffing')
    .factory('UrlService', function($location) {
      return {
        getUrl: function() {
          return $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }
      };
    });

})();
