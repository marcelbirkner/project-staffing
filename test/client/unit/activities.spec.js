(function() {
  'use strict';

  var expect = chai.expect;

  describe('Activity Service Test', function() {

    beforeEach(module('project-staffing'));

    var Activity;
    var $http;

	beforeEach(inject(function(_Activity_, _$http_) {
		Activity = _Activity_;
		$http = _$http_;
		sinon.stub($http, 'post', function(){});
	}));

    describe('Activity Service', function() {

      it('should contain empty list of activities by default', inject(function(Activity) {
        expect(Activity.getActivities().length).to.equal(0);
      }));

      it('should contain one item in list after saving one activity', inject(function(Activity) {
        Activity.saveActivity('user', 'action', 'object');
        expect(Activity.getActivities().length).to.equal(1);
      }));

      it('should have send http POST to backend after saving one activity', inject(function(Activity) {
        Activity.saveActivity('user', 'action', 'object');
        expect($http.post.callCount).to.equal(1);
      }));

      it('should contain five items in list after saving five activities', inject(function(Activity) {
        Activity.saveActivity('user 1', 'action 1', 'object 1');
        Activity.saveActivity('user 2', 'action', 'object');
        Activity.saveActivity('user 3', 'action', 'object');
        Activity.saveActivity('user 4', 'action', 'object');
        Activity.saveActivity('user 5', 'action', 'object');
        expect(Activity.getActivities().length).to.equal(5);
        expect(Activity.getActivities()[0].subject).to.equal('user 1');
        expect(Activity.getActivities()[0].action).to.equal('action 1');
        expect(Activity.getActivities()[0].object).to.equal('object 1');
      }));

    });

  });
})();
