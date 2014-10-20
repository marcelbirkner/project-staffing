describe('Test Filter', function() {

  beforeEach(module('project-staffing'));

  describe('UpperCase Test', function() {

    it('should convert first charactor of string to UpperCase', inject(function(firstLetterUppercaseFilter) {
      expect(firstLetterUppercaseFilter('string')).toBe('String');
      expect(firstLetterUppercaseFilter('a')).toBe('A');
    }));

  });

});
