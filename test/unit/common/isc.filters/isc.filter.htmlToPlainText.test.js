(function () {
  'use strict';
  //console.log( 'iscHtmlToPlainText Tests' );

  describe('iscHtmlToPlainText', function () {
    var scope,
        filter;

    // setup devlog
    beforeEach(module('isc.core', 'isc.filters', function (devlogProvider, $provide) {
      $provide.value('$log', mock$log);
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach(inject(function ($rootScope, $injector) {
      scope  = $rootScope.$new();
      filter = $injector.get('$filter')('iscHtmlToPlainText');

      //"2014-12-08 04:57:00" - expected format
    }));

    // -------------------------
    describe('iscHtmlToPlainText filter tests ', function () {

      it('should return the right string string', function () {
        var htmlStr = '<div class="foobar"><p>This is a <br><span><strong>test </strong></span>of <i>HTML</i></p></div>';
        var actual  = filter(htmlStr);
        expect(actual).toBe('This is a test of HTML');
      });

      it('should return String(text) value of non-string params', function () {
        var actual, expected;

        expected = "55";
        actual   = filter(55);
        expect(actual).toBe(expected);

        expected = '[object Object]';
        actual   = filter({});
        expect(actual).toBe(expected);

        expected = '1,2,3';
        actual   = filter([1, 2, 3]);
        expect(actual).toBe(expected);

      });
    });


  });
})();

