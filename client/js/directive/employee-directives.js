(function(){
  'use strict';

  var app = angular.module('employee-directives', []);

  app.directive('navigation', function(){
	return {
		restrict: 'E',
		templateUrl: 'navigation.html'
	};
  });
  app.directive('employeeTable', function(){
	return {
		restrict: 'E',
		templateUrl: 'employee-table.html'
	};
  });
  app.directive('employeeList', function(){
	return {
		restrict: 'E',
		templateUrl: 'employee-list.html'
	};
  });
  app.directive('employeeForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'employee-form.html'
	};
  });
  app.directive('skillForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'skill-form.html'
	};
  });
  app.directive('projectForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'project-form.html'
	};
  });
  app.directive('homeaddressForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'homeaddress-form.html'
	};
  });
  app.directive('searchaddressForm', function(){
	return {
		restrict: 'E',
		templateUrl: 'searchaddress-form.html'
	};
  });
})();
