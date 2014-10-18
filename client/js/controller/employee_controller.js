(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('EmployeeController', function($http, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();
    console.log('URL ' + url);

    var company = this;

    this.tab = 1;
    this.employees = company.employees;
    this.employee = {};

    company.employees = [];

    $http.get(url + '/api/mongo/employees').success(function(data) {
      console.log('Get all employees from backend');
      company.employees = data;
    });

    this.showTabs = function(){
      console.log('show tabs');
      if( this.employee._id === undefined ) {
        return false;
      }
      return true;
    };

    this.editEmployee = function(id) {
      for (var i in this.employees){
        if( this.employees[i]._id === id ) {
          console.log('Edit Employee');
          this.employee = this.employees[i];
        }
      }
    };

    this.resetForm = function() {
      this.employee = {};
    };

    this.addEmployee = function() {
      if( this.employee._id === undefined ) {
        console.log('add new employee');
        $http.post(url + '/api/mongo/employees', JSON.stringify(this.employee));
      } else {
        console.log('update existing employee');
        $http.post(url + '/api/mongo/employees/' + this.employee._id, JSON.stringify(this.employee));
      }
      // TODO: get userid from session
      var user = 'jon';
      var msg = 'added a new employee';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: this.employee.name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

      $http.get(url + '/api/mongo/employees').success(function(data) {
        console.log('Update all employees from backend');
        company.employees = data;
      });
    };

    this.deleteEmployee = function(id) {
      console.log('Delete employee with id: ' + JSON.stringify(id));
      $http.delete(url + '/api/mongo/employees/' + id);

      var deletedEmployee;
      for (var i in this.employees){
        console.log(this.employees[i]);
        console.log(i);
        if( this.employees[i]._id === id ) {
          deletedEmployee = this.employees[i];
          console.log('Delete item from array');
          this.employees.splice(i,1);
        }
      }

      // TODO: get userid from session
      var user = 'max';
      var msg = 'deleted a employee';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: deletedEmployee.name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

    };

    });

})();
