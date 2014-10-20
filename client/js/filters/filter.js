(function() {
  'use strict';

  angular.module('project-staffing').filter('firstLetterUppercase', function() {
    return function(input) {
      if( input.length === 0 ) {
        return '';
      }
      var array = input.split(/[ ]+/);
      var result = '';
      for(var i = 0; i < array.length; i++) {
        result += array[i].charAt(0).toUpperCase() + array[i].slice(1) + ' ';
      }
      return result.trim();
    };
  });

})();
