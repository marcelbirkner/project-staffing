(function() {
  'use strict';

  var expect = chai.expect;

  describe('EmployeeService Test', function() {

    beforeEach(module('project-staffing'));

    var EmployeeService;
    var $http;

    beforeEach(inject(function(_EmployeeService_, _$http_) {
      EmployeeService = _EmployeeService_;
      $http = _$http_;
      sinon.stub($http, 'post', function() {});
      sinon.stub($http, 'delete', function() {});
    }));

    describe('Employee Service', function() {

      it('should call $http delete when deleting employee', inject(function(EmployeeService) {
        EmployeeService.deleteEmployee('42');
        expect($http.delete.callCount).to.equal(1);
      }));

      it('should call $http post when saving address of employee', inject(function(EmployeeService) {
        var employee = {};
        EmployeeService.saveAddress('42', employee);
        expect($http.post.callCount).to.equal(1);
      }));

      it('should call $http post when adding project to employee', inject(function(EmployeeService) {
        var employee = {};
        EmployeeService.addProject(employee);
        expect($http.post.callCount).to.equal(1);
      }));

      it('should call $http post when deleting project of employee', inject(function(EmployeeService) {
        var employee = {};
        EmployeeService.deleteProject(employee);
        expect($http.post.callCount).to.equal(1);
      }));

      it('should call $http post when deleting skill of employee', inject(function(EmployeeService) {
        var employee = {};
        EmployeeService.deleteSkill(employee);
        expect($http.post.callCount).to.equal(1);
      }));

      it('should call $http post when adding skill to employee', inject(function(EmployeeService) {
        var employee = {};
        EmployeeService.addSkill(employee);
        expect($http.post.callCount).to.equal(1);
      }));

    });

  });
})();
