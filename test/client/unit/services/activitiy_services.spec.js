((() => {
  'use strict';

  var expect = chai.expect;

  describe('Activity Service Test', () => {

    beforeEach(module('project-staffing'));

    var ActivityService;
    var $http;

    beforeEach(inject((_ActivityService_, _$http_) => {
      ActivityService = _ActivityService_;
      $http = _$http_;
      sinon.stub($http, 'post', () => {});
    }));

    describe('Activity Service', () => {

      it('should contain empty list of activities by default', inject(ActivityService => {
        expect(ActivityService.getActivities().length).to.equal(0);
      }));

      it('should contain one item in list after saving one activity', inject(ActivityService => {
        ActivityService.saveActivity('user', 'action', 'object');
        expect(ActivityService.getActivities().length).to.equal(1);
      }));

      it('should have send http POST to backend after saving one activity', inject(ActivityService => {
        ActivityService.saveActivity('user', 'action', 'object');
        expect($http.post.callCount).to.equal(1);
      }));

      it('should contain five items in list after saving five activities', inject(ActivityService => {
        ActivityService.saveActivity('user 1', 'action 1', 'object 1');
        ActivityService.saveActivity('user 2', 'action', 'object');
        ActivityService.saveActivity('user 3', 'action', 'object');
        ActivityService.saveActivity('user 4', 'action', 'object');
        ActivityService.saveActivity('user 5', 'action', 'object');
        expect(ActivityService.getActivities().length).to.equal(5);
        expect(ActivityService.getActivities()[0].subject).to.equal('user 1');
        expect(ActivityService.getActivities()[0].action).to.equal('action 1');
        expect(ActivityService.getActivities()[0].object).to.equal('object 1');
      }));

    });

  });
}))();
