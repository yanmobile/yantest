/**
 * Created by hzou on 4/7/16.
 */

(function () {
  'use strict';

  describe('iscLodashFilter', function () {
    var scope,
        filter;

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    // show $log statements
    beforeEach(module('isc.filters', function ($provide) {
      $provide.value('$log', console);
    }));

    beforeEach(inject(function ($rootScope, $injector) {
      scope  = $rootScope.$new();
      filter = $injector.get('$filter')('lodash');
    }));

    // -------------------------
    describe('lodash filter tests ', function () {

      it("should return 'child' when using _.get(obj, 'parent.child.name')", function () {
        var myObj    = { parent: { child: { name: "child" }, name: "parent" } };
        var expected = filter(myObj, "get", "parent.child.name");
        expect(expected).toBe("child");
      });

    });


  });
})();

