(function () {
  'use strict';

  //console.log( 'iscAnimationService Tests' );

  describe ('iscAnimationService', function () {
    var service,
        $window;


    beforeEach (module ('isc.common'));

    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach (module ('isc.templates'));

    // show $log statements
    beforeEach (module ('isc.common', function ($provide) {
      $provide.value ('$log', console);
    }));

    beforeEach (inject (function (_$window_, iscAnimationService) {
      service = iscAnimationService;
      $window = _$window_;
    }));

    // -------------------------
    describe ('getAppWidth tests ', function () {

      it ('should have a function getAppWidth', function () {
        expect (angular.isFunction (service.getAppWidth)).toBe (true);
      });

      it ('should get the app width', function () {
        $window.innerWidth = 100;

        var result = service.getAppWidth ();
        expect (result).toBe (100);
      });
    });

    // -------------------------
    describe ('getAppHeight tests ', function () {

      it ('should have a function getAppHeight', function () {
        expect (angular.isFunction (service.getAppHeight)).toBe (true);
      });

      it ('should get the app height', function () {
        $window.innerHeight = 100;

        var result = service.getAppHeight ();
        expect (result).toBe (100);
      });
    });

    // -------------------------
    describe ('isPhone tests ', function () {

      it ('should have a function isPhone', function () {
        expect (angular.isFunction (service.isPhone)).toBe (true);
      });

      it ('should know when its a phone', function () {
        $window.innerWidth = 640;

        var result = service.isPhone ();
        expect (result).toBe (true);

        $window.innerWidth = 641;

        var result = service.isPhone ();
        expect (result).toBe (false);
      });
    });

    // -------------------------
    describe ('isTablet tests ', function () {

      it ('should have a function isTablet', function () {
        expect (angular.isFunction (service.isTablet)).toBe (true);
      });

      it ('should know when its a tablet', function () {
        $window.innerWidth = 960;

        var result = service.isTablet ();
        expect (result).toBe (true);

        $window.innerWidth = 961;

        var result = service.isTablet ();
        expect (result).toBe (false);
      });
    });

    // -------------------------
    describe ('getElementXPos tests ', function () {

      it ('should have a function getElementXPos', function () {
        expect (angular.isFunction (service.getElementXPos)).toBe (true);
      });

      it ('should get the yPos', function () {
        $window.innerWidth = 960;

        var result = service.getElementXPos (400, 0); // less than, no offset
        expect (result).toBe (280);

        var result = service.getElementXPos (400, 100); // less than, offset
        expect (result).toBe (180);

        var result = service.getElementXPos (960, 0); // equals, no offset
        expect (result).toBe (0);

        var result = service.getElementXPos (960, 100); // equals, offset
        expect (result).toBe (-100);

        var result = service.getElementXPos (1000, 0); // greater than, no offset
        expect (result).toBe (0);

        var result = service.getElementXPos (1000, 100); // greater than, offset
        expect (result).toBe (-100);
      });
    });

    // -------------------------
    describe ('getElementYPos tests ', function () {

      it ('should have a function getElementYPos', function () {
        expect (angular.isFunction (service.getElementYPos)).toBe (true);
      });

      it ('should get the yPos', function () {
        $window.innerHeight = 960;

        var result = service.getElementYPos (400, 0); // less than, no offset
        expect (result).toBe (280);

        var result = service.getElementYPos (400, 100); // less than, offset
        expect (result).toBe (180);

        var result = service.getElementYPos (960, 0); // equals, no offset
        expect (result).toBe (0);

        var result = service.getElementYPos (960, 100); // equals, offset
        expect (result).toBe (-100);

        var result = service.getElementYPos (1000, 0); // greater than, no offset
        expect (result).toBe (0);

        var result = service.getElementYPos (1000, 100); // greater than, offset
        expect (result).toBe (-100);
      });
    });

    // -------------------------
    describe ('getNavWidth tests ', function () {

      it ('should have a function getNavWidth', function () {
        expect (angular.isFunction (service.getNavWidth)).toBe (true);
      });

      it ('should get the nav width', function () {
        $window.innerWidth = 960;

        var result = service.getNavWidth ();
        expect (result).toBe (370);

        $window.innerWidth = 480;

        var result = service.getNavWidth ();
        expect (result).toBe (480);
      });
    });

    // -------------------------
    describe ('getSideNavHeight tests ', function () {

      it ('should have a function getSideNavHeight', function () {
        expect (angular.isFunction (service.getSideNavHeight)).toBe (true);
      });

      it ('should get the nav height, phab plus, MIN is smaller than elem', function () {
        $window.innerWidth  = 960;
        $window.innerHeight = 1000;

        spyOn (service, 'getFullHeight').and.returnValue (1000);

        var result = service.getSideNavHeight (500);
        expect (result).toBe (500);
        expect (service.getFullHeight).not.toHaveBeenCalled ();
      });

      it ('should get the nav height, phab plus, MIN (450) is bigger than elem', function () {
        $window.innerWidth  = 960;
        $window.innerHeight = 1000;

        spyOn (service, 'getFullHeight').and.returnValue (1000);

        var result = service.getSideNavHeight (300);
        expect (result).toBe (450);
        expect (service.getFullHeight).not.toHaveBeenCalled ();
      });

      it ('should get the nav height, phone, fullHeight is bigger than elem', function () {
        $window.innerWidth  = 600;
        $window.innerHeight = 1000;

        spyOn (service, 'getFullHeight').and.returnValue (1000);

        var result = service.getSideNavHeight (300);
        expect (result).toBe (1000);
        expect (service.getFullHeight).toHaveBeenCalled ();
      });

      it ('should get the nav height, phone, fullHeight is less than elem', function () {
        $window.innerWidth  = 600;
        $window.innerHeight = 1000;

        spyOn (service, 'getFullHeight').and.returnValue (400);

        var result = service.getSideNavHeight (500);
        expect (result).toBe (500);
        expect (service.getFullHeight).toHaveBeenCalled ();
      });
    });

    // -------------------------
    describe ('getSecondaryNavHeight tests ', function () {

      it ('should have a function getSecondaryNavHeight', function () {
        expect (angular.isFunction (service.getSecondaryNavHeight)).toBe (true);
      });

      it ('should get the nav height, phab plus, MIN is smaller than elem', function () {
        $window.innerWidth  = 960;
        $window.innerHeight = 1000;

        spyOn (service, 'getFullHeight').and.returnValue (1000);

        var result = service.getSideNavHeight (500);
        expect (result).toBe (500);
        expect (service.getFullHeight).not.toHaveBeenCalled ();
      });

      it ('should get the nav height, phab plus, MIN (450) is bigger than elem', function () {
        $window.innerWidth  = 960;
        $window.innerHeight = 1000;

        spyOn (service, 'getFullHeight').and.returnValue (1000);

        var result = service.getSideNavHeight (300);
        expect (result).toBe (450);
        expect (service.getFullHeight).not.toHaveBeenCalled ();
      });

      it ('should get the nav height, phone, fullHeight is bigger than elem', function () {
        $window.innerWidth  = 600;
        $window.innerHeight = 1000;

        spyOn (service, 'getFullHeight').and.returnValue (1000);

        var result = service.getSideNavHeight (300);
        expect (result).toBe (1000);
        expect (service.getFullHeight).toHaveBeenCalled ();
      });

      it ('should get the nav height, phone, fullHeight is less than elem', function () {
        $window.innerWidth  = 600;
        $window.innerHeight = 1000;

        spyOn (service, 'getFullHeight').and.returnValue (400);

        var result = service.getSideNavHeight (500);
        expect (result).toBe (500);
        expect (service.getFullHeight).toHaveBeenCalled ();
      });
    });

    // -------------------------
    describe ('full height / width tests ', function () {

      it ('should have a function getFullHeight', function () {
        expect (angular.isFunction (service.getFullHeight)).toBe (true);
      });

      it ('should have a function getFullHeight', function () {
        expect (angular.isFunction (service.getFullWidth)).toBe (true);
      });
    });

  });

}) ();

