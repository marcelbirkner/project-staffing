((() => {
  'use strict';

  var app = angular.module('employee-directives', []);

  app.directive('navigation', () => ({
    restrict: 'E',
    templateUrl: 'navigation.html'
  }));
  app.directive('employeeTable', () => ({
    restrict: 'E',
    templateUrl: 'employee-table.html'
  }));
  app.directive('employeeList', () => ({
    restrict: 'E',
    templateUrl: 'employee-list.html'
  }));
  app.directive('employeeForm', () => ({
    restrict: 'E',
    templateUrl: 'employee-form.html'
  }));
  app.directive('skillForm', () => ({
    restrict: 'E',
    templateUrl: 'skill-form.html'
  }));
  app.directive('projectForm', () => ({
    restrict: 'E',
    templateUrl: 'project-form.html'
  }));
  app.directive('homeaddressForm', () => ({
    restrict: 'E',
    templateUrl: 'homeaddress-form.html'
  }));
  app.directive('searchaddressForm', () => ({
    restrict: 'E',
    templateUrl: 'searchaddress-form.html'
  }));
  app.directive('customerTable', () => ({
    restrict : 'E',
    templateUrl : 'customer-table.html'
  }));
  app.directive('searchCustomerAddressForm', () => ({
    restrict: 'E',
    templateUrl: 'searchcustomeraddress-form.html'
  }));
}))();
