describe('filter', function() {

    beforeEach(module('project-staffing'));

    describe('checkmark', function() {

      it('should convert boolean values to unicode checkmark or cross', inject(function(firstLetterUppercaseFilter) {
        expect(firstLetterUppercaseFilter('string')).toBe('String');
        expect(firstLetterUppercaseFilter('a')).toBe('A');
      }));

    });

});
