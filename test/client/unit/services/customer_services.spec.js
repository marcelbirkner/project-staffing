((() => {
  'use strict';

  var expect = chai.expect;

  describe('CustomerService Test', () => {

    beforeEach(module('project-staffing'));

    var CustomerService;
    var $http;

    beforeEach(inject((_CustomerService_, _$http_) => {
      CustomerService = _CustomerService_;
      $http = _$http_;
      sinon.stub($http, 'post', () => {});
    }));

    describe('Customer Service', () => {

      it('should call $http post when using addCustomer', inject(CustomerService => {
        var customer = {};
        CustomerService.addCustomer(customer);
        expect($http.post.callCount).to.equal(1);
      }));

    });

  });
}))();
