/**
 * Created by dgoodman on 2/12/15.
 */
/**
 * Created by douglas goodman on 2/12/15.
 */

(function () {
  'use strict';

  /* @ngInject */
  function iscAnimationService (devlog, $window) {
    //    $log.debug( 'iscAnimationService.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var PHONE_MAX  = 640;
    var TABLET_MAX = 960;

    var SIDE_NAV_MIN_H      = 450;
    var SECONDARY_NAV_MIN_H = 600;
    var NAV_MAX_W           = 370;

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      getAppWidth : getAppWidth,
      getAppHeight: getAppHeight,

      isPhone : isPhone,
      isTablet: isTablet,

      getElementXPos: getElementXPos,
      getElementYPos: getElementYPos,

      getNavWidth          : getNavWidth,
      getSideNavHeight     : getSideNavHeight,
      getSecondaryNavHeight: getSecondaryNavHeight,

      getFullHeight: getFullHeight,
      getFullWidth : getFullWidth
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function getAppWidth () {
      return $window.innerWidth;
    }

    function getAppHeight () {
      return $window.innerHeight;
    }

    function isPhone () {
      return getAppWidth () <= PHONE_MAX;
    }

    function isTablet () {
      var appW = getAppWidth ();
      return appW <= TABLET_MAX && appW > PHONE_MAX;
    }

    function getElementXPos (elemW, offset) {
      devlog.channel('iscAnimationService').debug( 'iscAnimationService.getElementCenterXpos, elemW', elemW );
      devlog.channel('iscAnimationService').debug( '...elemW',elemW );
      devlog.channel('iscAnimationService').debug( '...getAppWidth()',getAppWidth() );

      return doPositionCalc (elemW, getAppWidth (), offset);
    }

    function getElementYPos (elemH, offset) {
      devlog.channel('iscAnimationService').debug( 'iscAnimationService.getElementYPos' );
      devlog.channel('iscAnimationService').debug( '............elemH',elemH );
      devlog.channel('iscAnimationService').debug( '...offset', offset );
      devlog.channel('iscAnimationService').debug( '...getAppHeight()',getAppHeight() );

      return doPositionCalc (elemH, getAppHeight (), offset);
    }

    function doPositionCalc (elemSize, appSize, offset) {
      if (!offset) {
        offset = 0;
      }

      if (elemSize >= appSize) {
        return -offset;
      }

      var center = (appSize - elemSize) / 2;
      center -= offset;

      return Math.max (0, center);
    }

    function getNavWidth () {
      var appW = getAppWidth ();

      if (isPhone ()) {
        devlog.channel('iscAnimationService').debug( '..returning appW', appW);
        return appW;
      }
      else {
        devlog.channel('iscAnimationService').debug( '..returning NAV_MAX_W', NAV_MAX_W);
        return NAV_MAX_W;
      }
    }

    function getSideNavHeight (elemH) {
      return getNavHeight (elemH, SIDE_NAV_MIN_H);
    }

    function getSecondaryNavHeight (elemH) {
      return getNavHeight (elemH, SECONDARY_NAV_MIN_H);
    }

    function getFullHeight () {
      var body = document.body,//jshint ignore:line
          html = document.documentElement;//jshint ignore:line

      return Math.max (body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    }

    function getFullWidth () {
      var body = document.body,//jshint ignore:line
          html = document.documentElement;//jshint ignore:line

      return Math.max (body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    }


    /*
     private
     */
    function getNavHeight (elemH, MIN) {
      devlog.channel('iscAnimationService').debug ('...elemH', elemH);
      devlog.channel('iscAnimationService').debug ('...MIN', MIN);

      var height;

      if (isPhone ()) {
        devlog.channel('iscAnimationService').debug ('...phone');
        devlog.channel('iscAnimationService').debug ('...fullHeight', service.getFullHeight());

        height = Math.max (elemH, service.getFullHeight ());
      }
      else {
        devlog.channel('iscAnimationService').debug ('...bigger');
        height = Math.max (elemH, MIN);
      }

      devlog.channel('iscAnimationService').debug ('...returning height', height);
      return height;

    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module ('isc.animation')
      .factory ('iscAnimationService', iscAnimationService);

}) ();
