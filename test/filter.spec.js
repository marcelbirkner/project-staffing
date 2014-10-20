describe('Filter Test', function() {

  beforeEach(module('project-staffing'));

  describe('UpperCase Test', function() {

    it('should convert first charactor of string to UpperCase', inject(function(firstLetterUppercaseFilter) {
      expect(firstLetterUppercaseFilter('')).toBe('');
      expect(firstLetterUppercaseFilter('a')).toBe('A');
      expect(firstLetterUppercaseFilter('string')).toBe('String');
    }));

    it('should convert first charactor of each whitespace separated string to UpperCase', inject(function(firstLetterUppercaseFilter) {
      expect(firstLetterUppercaseFilter('hello world')).toBe('Hello World');
      expect(firstLetterUppercaseFilter('hello  world')).toBe('Hello World');
      expect(firstLetterUppercaseFilter('  hello  world  ')).toBe('Hello World');
      expect(firstLetterUppercaseFilter('  hello  world  hello world')).toBe('Hello World Hello');
    }));

  });

});
