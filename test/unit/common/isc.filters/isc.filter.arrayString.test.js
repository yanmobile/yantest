/**
 * Created by hzou on 4/24/16.
 */

(function () {
  'use strict';

  describe('iscArrayStringFilter', function () {
    var scope,
        filter;

    // setup devlog
    beforeEach(module('isc.core', 'isc.filters', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach(inject(function ($rootScope, $injector) {
      scope  = $rootScope.$new();
      filter = $injector.get('$filter')('arrayString');
    }));

    // -------------------------
    describe('arrayString filter tests ', function () {

      it("should return empty string if not array type", function () {
        var expected = '';
        var actual;

        actual = filter(0);
        expect(actual).toBe(expected);

        actual = filter({});
        expect(actual).toBe(expected);

        actual = filter(arguments);
        expect(actual).toBe(expected);

        actual = filter("hello");
        expect(actual).toBe(expected);

        actual = filter(null);
        expect(actual).toBe(expected);

        actual = filter(undefined);
        expect(actual).toBe(expected);

      });

      describe("parameter is of type array", function () {
        it('should treat ["1"] and Array("1") the same', function () {
          var primative = filter(["1"]);
          var object    = filter(Array("1"));

          expect(primative).toBe(object);
        });

        it('should return "1, 2" when ["1", "2"] is passed', function () {
          var actual,
              expected = "1, 2";

          actual = filter(["1", "2"]);
          expect(actual).toBe(expected);
        });
      });

      describe("duplicate of [].join()", function () {
        it('should behave the same as [].join', function () {
          var array,
              filterRet,
              arrayRet;

          array     = ["1", "2"];
          filterRet = filter(array);
          arrayRet  = array.join(", ");
          expect(filterRet).toBe(arrayRet);

          array     = Array(["1", "2"]);
          filterRet = filter(array);
          arrayRet  = array.join(", ");
          expect(filterRet).toBe(arrayRet);

          array     = Array(["1"]);
          filterRet = filter(array);
          arrayRet  = array.join(", ");
          expect(filterRet).toBe(arrayRet);
        });
      });
    });

  });
})();

