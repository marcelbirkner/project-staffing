(function() {
  'use strict';

  var expect = chai.expect;

  describe('Filter Test', function() {

    beforeEach(module('project-staffing'));

    describe('UpperCase Test', function() {

      it('should convert first charactor of string to UpperCase', inject(function(firstLetterUppercaseFilter) {
        expect(firstLetterUppercaseFilter('')).to.equal('');
        expect(firstLetterUppercaseFilter('a')).to.equal('A');
        expect(firstLetterUppercaseFilter('string')).to.equal('String');
      }));

      it('should convert first charactor of each whitespace separated string to UpperCase', inject(function(firstLetterUppercaseFilter) {
        expect(firstLetterUppercaseFilter('hello world')).to.equal('Hello World');
        expect(firstLetterUppercaseFilter('hello  world')).to.equal('Hello World');
        expect(firstLetterUppercaseFilter('  hello  world  ')).to.equal('Hello World');
        expect(firstLetterUppercaseFilter('  hello  world  hello world')).to.equal('Hello World Hello World');
      }));

    });

  });
})();
