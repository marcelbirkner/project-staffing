(function() {
  'use strict';

  angular.module('project-staffing').filter('firstLetterUppercase', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    };
  });

})();
