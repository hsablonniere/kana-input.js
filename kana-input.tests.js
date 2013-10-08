/*global jasmine, describe, beforeEach, it, expect, kanaInput */

'use strict';

describe('utils', function () {
  var _ = kanaInput.utils;

  describe('insert()', function () {

    it('should insert text at various positions', function () {

      expect(_('abcdefg').insert('123', 3)).toBe('abc123defg');
      expect(_('abcdefg').insert('えおか', 10)).toBe('abcdefgえおか');
      expect(_('abcdefg').insert('エオカ', 0)).toBe('エオカabcdefg');
      expect(_('abcdefg').insert('XYZ', -3)).toBe('XYZabcdefg');
    });
  });

  describe('remove()', function () {

    it('should remove text at various positions and lengths', function () {

      expect(_('abc123defg').remove(3, 6)).toBe('abcdefg');
      expect(_('abcdefgえおか').remove(3, 13)).toBe('abcdefg');
      expect(_('エオカabcdefg').remove(3, 3)).toBe('abcdefg');
      expect(_('XYZabcdefg').remove(3, 3)).toBe('abcdefg');
    });
  });
});

describe('insertNewLetter()', function () {
  var insertNewLetter;

  beforeEach(function () {

    insertNewLetter = function (text, position, newLetter) {

      var spy = jasmine.createSpy('insertNewLetterCallback');

      return {
        shouldCallSpyWith: function (newText, newPosition) {

          kanaInput.insertNewLetter('hiragana', text, position, newLetter, spy);
          expect(spy).toHaveBeenCalledWith(newText, newPosition);
          spy.reset();
        }
      };
    };
  });

  it('should insert letter without translating and give correct new position', function () {

    insertNewLetter('', 0, 'k').shouldCallSpyWith('k', 1);
    insertNewLetter('か', 1, 'k').shouldCallSpyWith('かk', 2);
    insertNewLetter('かき', 1, 'k').shouldCallSpyWith('かkき', 2);
    insertNewLetter('かcき', 2, 'h').shouldCallSpyWith('かchき', 3);
    insertNewLetter('かtき', 2, 's').shouldCallSpyWith('かtsき', 3);
    insertNewLetter('かkき', 2, 'y').shouldCallSpyWith('かkyき', 3);
    insertNewLetter('かchき', 3, 'h').shouldCallSpyWith('かchhき', 4);
    insertNewLetter('かtsき', 3, 's').shouldCallSpyWith('かtssき', 4);
    insertNewLetter('かkyき', 3, 'y').shouldCallSpyWith('かkyyき', 4);
  });

  it('should translate 3 letters hiraganas and give correct new position', function () {

    insertNewLetter('かchき', 3, 'i').shouldCallSpyWith('かちき', 2);
    insertNewLetter('かtsき', 3, 'u').shouldCallSpyWith('かつき', 2);
    insertNewLetter('かkyき', 3, 'o').shouldCallSpyWith('かきょき', 3);
  });

  it('should translate 2 letters hiraganas and give correct new position', function () {

    insertNewLetter('かsき', 2, 'a').shouldCallSpyWith('かさき', 2);
    insertNewLetter('かtき', 2, 'e').shouldCallSpyWith('かてき', 2);
    insertNewLetter('かkき', 2, 'o').shouldCallSpyWith('かこき', 2);
  });

  it('should translate a, i, u, o and n to あ, い, う, え, お or ん and give correct new position', function () {

    insertNewLetter('かき', 1, 'a').shouldCallSpyWith('かあき', 2);
    insertNewLetter('かき', 1, 'i').shouldCallSpyWith('かいき', 2);
    insertNewLetter('かき', 1, 'u').shouldCallSpyWith('かうき', 2);
    insertNewLetter('かき', 1, 'e').shouldCallSpyWith('かえき', 2);
    insertNewLetter('かき', 1, 'o').shouldCallSpyWith('かおき', 2);
    insertNewLetter('かき', 1, 'n').shouldCallSpyWith('かんき', 2);
  });

  it('should translate ん with a, i, u, or o to な, に, ぬ, ね, or の and give correct new position', function () {

    insertNewLetter('かんき', 2, 'a').shouldCallSpyWith('かなき', 2);
    insertNewLetter('かんき', 2, 'i').shouldCallSpyWith('かにき', 2);
    insertNewLetter('かんき', 2, 'u').shouldCallSpyWith('かぬき', 2);
    insertNewLetter('かんき', 2, 'e').shouldCallSpyWith('かねき', 2);
    insertNewLetter('かんき', 2, 'o').shouldCallSpyWith('かのき', 2);
  });

  it('should translate sokuon hiraganas', function () {

    insertNewLetter('かkkき', 3, 'a').shouldCallSpyWith('かっかき', 3);
    insertNewLetter('かsshき', 4, 'i').shouldCallSpyWith('かっしき', 3);
    insertNewLetter('かcchき', 4, 'i').shouldCallSpyWith('かっちき', 3);
    insertNewLetter('かppき', 3, 'e').shouldCallSpyWith('かっぺき', 3);
    insertNewLetter('かggき', 3, 'o').shouldCallSpyWith('かっごき', 3);
  });
});

describe('removeLetter()', function () {
  var removeLetter;

  beforeEach(function () {

    removeLetter = function (text, position) {

      var spy = jasmine.createSpy('removeLetterCallback');

      return {
        shouldCallSpyWith: function (newText, newPosition) {

          kanaInput.removeLetter(text, position, spy);
          expect(spy).toHaveBeenCalledWith(newText, newPosition);
          spy.reset();
        }
      };
    };
  });

  it('should remove normal letter', function () {

    removeLetter('k', 1).shouldCallSpyWith('', 0);
    removeLetter('かk', 2).shouldCallSpyWith('か', 1);
    removeLetter('かkき', 2).shouldCallSpyWith('かき', 1);
    removeLetter('かchき', 3).shouldCallSpyWith('かcき', 2);
    removeLetter('かtsき', 3).shouldCallSpyWith('かtき', 2);
    removeLetter('かkyき', 3).shouldCallSpyWith('かkき', 2);
    removeLetter('かchhき', 4).shouldCallSpyWith('かchき', 3);
    removeLetter('かtssき', 4).shouldCallSpyWith('かtsき', 3);
    removeLetter('かkyyき', 4).shouldCallSpyWith('かkyき', 3);
  });

  it('should remove first letter of 3 letters single hiragana', function () {

    removeLetter('かちき', 2).shouldCallSpyWith('かchき', 3);
    removeLetter('かつき', 2).shouldCallSpyWith('かtsき', 3);
    removeLetter('かきょき', 3).shouldCallSpyWith('かkyき', 3);
  });

  it('should remove first letter of 2 letters single hiragana', function () {

    removeLetter('かさき', 2).shouldCallSpyWith('かsき', 2);
    removeLetter('かてき', 2).shouldCallSpyWith('かtき', 2);
    removeLetter('かこき', 2).shouldCallSpyWith('かkき', 2);
  });

  it('should remove first letter of 3 letters double hiragana', function () {

    removeLetter('かきょき', 3).shouldCallSpyWith('かkyき', 3);
    removeLetter('かりゃき', 3).shouldCallSpyWith('かryき', 3);
    removeLetter('かにゅき', 3).shouldCallSpyWith('かnyき', 3);
  });

  it('should remove first letter of sokuon hiraganas', function () {

    removeLetter('かっかき', 3).shouldCallSpyWith('かkkき', 3);
    removeLetter('かっしき', 3).shouldCallSpyWith('かsshき', 4);
    removeLetter('かっちき', 3).shouldCallSpyWith('かcchき', 4);
    removeLetter('かっぺき', 3).shouldCallSpyWith('かppき', 3);
    removeLetter('かっごき', 3).shouldCallSpyWith('かggき', 3);
  });

  it('should transform な, に, ぬ, ね, or の to ん', function () {

    removeLetter('かなき', 2).shouldCallSpyWith('かんき', 2);
    removeLetter('かにき', 2).shouldCallSpyWith('かんき', 2);
    removeLetter('かぬき', 2).shouldCallSpyWith('かんき', 2);
    removeLetter('かねき', 2).shouldCallSpyWith('かんき', 2);
    removeLetter('かのき', 2).shouldCallSpyWith('かんき', 2);
  });
});
