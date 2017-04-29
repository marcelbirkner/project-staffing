((() => {
  'use strict';

  angular
    .module('project-staffing')
    .config($routeProvider => {
      $routeProvider.when('/', {
          templateUrl: 'views/index.html'
        })
        .when('/timeline', {
          templateUrl: 'views/timeline.html',
          controller: 'TimelineController',
          controllerAs: 'timelineCtrl'
        })
        .when('/dashboard', {
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'dashboardCtrl'
        })
        .when('/list-employees', {
          templateUrl: 'views/list_employees.html',
          controller: 'EmployeeController',
          controllerAs: 'employeeCtrl'
        })
        .when('/add-employee', {
          templateUrl: 'views/add_employee.html',
          controller: 'EmployeeController',
          controllerAs: 'employeeCtrl'
        })
        .when('/list-customers', {
          templateUrl: 'views/list_customers.html',
          controller: 'CustomerController',
          controllerAs: 'customerCtrl'
        })
        .when('/staffing', {
          templateUrl: 'views/staff_project.html',
          controller: 'StaffingController',
          controllerAs: 'staffingCtrl'
        })
        .when('/add-customer', {
          templateUrl: 'views/add_customer.html',
          controller: 'CustomerController',
          controllerAs: 'customerCtrl'
        })
        .when('/help', {
          templateUrl: 'views/help.html'
        })
        .otherwise({
          redirectTo: '/'
        });
    });
}))();
