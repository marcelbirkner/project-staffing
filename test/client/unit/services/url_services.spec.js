((() => {
  'use strict';

  var expect = chai.expect;

  describe('UrlService Test', () => {

    beforeEach(module('project-staffing'));

    var UrlService;
    var $location;

    beforeEach(inject((_UrlService_, _$location_) => {
      UrlService = _UrlService_;
      $location = _$location_;
      sinon.stub($location, 'protocol', () => 'http');
      sinon.stub($location, 'host', () => 'host');
      sinon.stub($location, 'port', () => 'port');
    }));

    describe('URL Service', () => {

      it('should return url with location, host and port', inject(CustomerService => {
        var url = UrlService.getUrl();
        expect(url).to.equal('http://host:port');
      }));

    });

  });
}))();
