(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('EmployeeController', function($http, Url) {

    var url = Url.getUrl();

    var company = this;

    this.tab = 1;
    this.employees = company.employees;
    this.employee = {};

    company.employees = [];

    $http.get(url + '/api/mongo/employees').success(function(data) {
      company.employees = data;
    });

    this.showTabs = function(){
      if( this.employee._id === undefined ) {
        return false;
      }
      return true;
    };

    this.editEmployee = function(id) {
      for (var i in this.employees){
        if( this.employees[i]._id === id ) {
          this.employee = this.employees[i];
        }
      }
    };

    this.resetForm = function() {
      this.employee = {};
    };

    this.addEmployee = function() {
      if( this.employee._id === undefined ) {
        $http.post(url + '/api/mongo/employees', JSON.stringify(this.employee));
      } else {
        $http.post(url + '/api/mongo/employees/' + this.employee._id, JSON.stringify(this.employee));
      }
      // TODO: get userid from session
      var user = 'jon';
      var msg = 'added a new employee';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: this.employee.name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

      $http.get(url + '/api/mongo/employees').success(function(data) {
        company.employees = data;
      });
    };

    this.deleteEmployee = function(id) {
      $http.delete(url + '/api/mongo/employees/' + id);

      var deletedEmployee;
      for (var i in this.employees){
        if( this.employees[i]._id === id ) {
          deletedEmployee = this.employees[i];
          this.employees.splice(i, 1);
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
