((() => {
  'use strict';

  angular.module('project-staffing')
    .factory('UrlService', $location => ({
    getUrl() {
      return $location.protocol() + '://' + $location.host() + ':' + $location.port();
    }
  }));

}))();
