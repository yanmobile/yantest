/**
 * Created by hzou on 4/24/16.
 */

(function () {
  'use strict';

  describe('iscLocationFilter', function () {
    var scope,
        filter;

    // setup devlog
    beforeEach(module('isc.core', 'isc.filters', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach(inject(function ($rootScope, $injector) {
      scope  = $rootScope.$new();
      filter = $injector.get('$filter')('iscLocation');
    }));

    // -------------------------
    describe('iscHighlight filter tests ', function () {

      it("should return empty string when locationString is falsy", function () {
        var expected = '';

        var actual = filter(0);
        expect(actual).toBe(expected);

        actual = filter(false);
        expect(actual).toBe(expected);

        actual = filter('');
        expect(actual).toBe(expected);

        actual = filter(null);
        expect(actual).toBe(expected);

        actual = filter(undefined);
        expect(actual).toBe(expected);

      });

      it("should return original locationString if defined and not equal 2.16", function () {
        var expected = 'hello';
        var actual   = filter("hello");
        expect(actual).toBe(expected);
      });

      it("should return empty string if locationString is 2.16 and showMessage is falsy", function () {
        var expected = '';
        var actual   = filter(2.16, 0);
        expect(actual).toBe(expected);

        actual = filter(2.16, '');
        expect(actual).toBe(expected);

        actual = filter(2.16, false);
        expect(actual).toBe(expected);

        actual = filter(2.16, null);
        expect(actual).toBe(expected);

        actual = filter(2.16, undefined);
        expect(actual).toBe(expected);

      });

      it("should return ISC_UNKNOWN_LOCATION if locationString is 2.16 or '2.16' and showMessage is truthy", function () {
        var expected = 'ISC_UNKNOWN_LOCATION';
        var actual   = filter(2.16, 1);
        expect(actual).toBe(expected);

        actual = filter(2.16, "1");
        expect(actual).toBe(expected);

        actual = filter(2.16, {});
        expect(actual).toBe(expected);

        actual = filter(2.16, true);
        expect(actual).toBe(expected);

        actual = filter(2.16, []);
        expect(actual).toBe(expected);

        actual = filter("2.16", 1);
        expect(actual).toBe(expected);

        actual = filter("2.16", "1");
        expect(actual).toBe(expected);

        actual = filter("2.16", {});
        expect(actual).toBe(expected);

        actual = filter("2.16", true);
        expect(actual).toBe(expected);

        actual = filter("2.16", []);
        expect(actual).toBe(expected);

      });

    });

  });
})();

