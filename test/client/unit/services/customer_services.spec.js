(function() {
  'use strict';

  var expect = chai.expect;

  describe('CustomerService Test', function() {

    beforeEach(module('project-staffing'));

    var CustomerService;
    var $http;

    beforeEach(inject(function(_CustomerService_, _$http_) {
      CustomerService = _CustomerService_;
      $http = _$http_;
      sinon.stub($http, 'post', function() {});
    }));

    describe('Customer Service', function() {

      it('should call $http post when using addCustomer', inject(function(CustomerService) {
        var customer = {};
        CustomerService.addCustomer(customer);
        expect($http.post.callCount).to.equal(1);
      }));

    });

  });
})();
