((() => {
  'use strict';

  angular.module('project-staffing')
    .factory('Url', $location => ({
    getUrl() {
      return $location.protocol() + '://' + $location.host() + ':' + $location.port();
    }
  }));

}))();
