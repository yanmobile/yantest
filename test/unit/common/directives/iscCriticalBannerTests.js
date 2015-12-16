(function () {
  'use strict';

  describe('iscCriticalBanner', function () {
    var $compile,
        $rootScope,
        element,
        bannerScope,
        label;

    var html = '<isc-critical-banner message="{{message}}"></isc-critical-banner>';

    beforeEach(module('isc.directives'));

    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach(module('isc.templates'));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile   = _$compile_;
    }));

    function compileDirective(template, scopeParams) {
      var elem = angular.element(template || html);
      angular.extend($rootScope, scopeParams);
      element  = $compile(elem)($rootScope);
      $rootScope.$digest();

      bannerScope = element.isolateScope();

      label = element.find('label');
    }


    // -------------------------
    describe('iscCriticalBanner tests ', function () {
      it('sanity check', function () {
        compileDirective();
        expect(element.length).toBe(1);
        expect(label.length).toBe(0);
        expect(bannerScope.iscBannerCtrl).toBeDefined();
      });

      it('should not show message if no message is defined', function () {
        compileDirective();
        expect(element.length).toBe(1);
        expect(label.length).toBe(0);
      });

      it('should show message if iscBannerCtrl.message is defined', function () {
        compileDirective(null, { message: 'hello' });
        expect(element.length).toBe(1);
        expect(label.length).toBe(1);
        expect(label.text()).toBe('hello');
      });

      it('should use isc-banner css class by default', function () {
        compileDirective(null, { message: 'hello' });
        expect(element.find('.isc-banner').length).toBe(1);
      });

      it('should be abe to override class', function () {
        var template = '<isc-critical-banner message="message" css-class="isc-test"></isc-critical-banner>';
        compileDirective(template, { message: 'hello' });
        expect(element.find('.isc-banner').length).toBe(0);
        expect(element.find('.isc-test').length).toBe(1);
      });

    });
  });
})();

