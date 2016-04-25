/**
 * Created by hzou on 4/24/16.
 */

(function () {
  'use strict';

  describe('iscHighlightFilter', function () {
    var scope,
        filter;

    // setup devlog
    beforeEach(module('isc.core', 'isc.filters', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach(inject(function ($rootScope, $injector) {
      scope  = $rootScope.$new();
      filter = $injector.get('$filter')('iscHighlight');
    }));

    // -------------------------
    describe('iscHighlight filter tests ', function () {

      it("should highlight single matching word", function () {
        var actual   = filter("This highlights the matching phrase", "highlights");
        actual       = actual.$$unwrapTrustedValue();
        var expected = 'This <span class="isc-highlighted">highlights</span> the matching phrase';
        expect(actual).toBe(expected);
      });

      it("should highlight multiple matching word", function () {
        var expected;
        var actual = filter("This highlights the matching highlighted phrase", "highlight");
        actual     = actual.$$unwrapTrustedValue();
        expected   = 'This <span class="isc-highlighted">highlight</span>s the matching <span class="isc-highlighted">highlight</span>ed phrase';

        expect(actual).toBe(expected);
      });

    });

  });
})();

