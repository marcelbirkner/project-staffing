(function() {
  'use strict';

  var expect = chai.expect;

  describe('UrlService Test', function() {

    beforeEach(module('project-staffing'));

    var UrlService;
    var $location;

    beforeEach(inject(function(_UrlService_, _$location_) {
      UrlService = _UrlService_;
      $location = _$location_;
      sinon.stub($location, 'protocol', function() {return 'http'});
      sinon.stub($location, 'host', function() {return 'host'});
      sinon.stub($location, 'port', function() {return 'port'});
    }));

    describe('URL Service', function() {

      it('should return url with location, host and port', inject(function(CustomerService) {
        var url = UrlService.getUrl();
        expect(url).to.equal('http://host:port');
      }));

    });

  });
})();
