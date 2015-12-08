(function () {
  'use strict';
  //console.log( 'iscAutofocus Tests' );

  describe ('iscAutofocus', function () {
    var scope,
        rootScope,
        timeout,
        isolateScope,
        httpBackend,
        elem,
        element;

    var html = '<input isc-autofocus>';

    beforeEach (module ('isc.directives'));


    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach (module ('isc.templates'));

    // show $log statements
    beforeEach (module (function ($provide) {
      $provide.value ('$log', console);
    }));

    beforeEach (inject (function ($rootScope, $compile, $timeout, $httpBackend) {
      rootScope = $rootScope;
      scope     = $rootScope.$new ();

      httpBackend = $httpBackend;
      timeout     = $timeout;

      // dont worry about calls to assets
      httpBackend.when ('GET', 'assets/i18n/en-us.json')
          .respond (200, {});

      elem = angular.element( html );
      element = $compile (elem) (scope);
      scope.$digest ();

      isolateScope = element.isolateScope ();
    }));


    // -------------------------
    describe ('autofocus tests ', function () {

      it ('should set the focus on timeout', function () {
        var tempEl = elem[0];
        spyOn (tempEl, 'focus');
        timeout.flush ();
        expect (tempEl.focus).toHaveBeenCalled ();
      })
    });

  });
}) ();

