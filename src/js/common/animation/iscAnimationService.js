/**
 * Created by dgoodman on 2/12/15.
 */
/**
 * Created by douglas goodman on 2/12/15.
 */

(function(){
  'use strict';

  iscAnimationService.$inject = [ '$log', '$window'];

  function iscAnimationService( $log, $window ){
//    $log.debug( 'iscAnimationService.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var X_OFFSET = 50;

    var PHONE_MAX = 640;
    var TABLET_MAX = 960;

    var SIDE_NAV_MIN_H = 450;
    var SECONDARY_NAV_MIN_H = 600;
    var NAV_MAX_W = 370;

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      getAppWidth: getAppWidth,
      getAppHeight: getAppHeight,

      isPhone: isPhone,
      isTablet: isTablet,

      getElementXPos: getElementXPos,
      getElementYPos: getElementYPos,

      getNavWidth: getNavWidth,
      getSideNavHeight: getSideNavHeight,
      getSecondaryNavHeight: getSecondaryNavHeight,

      getFullHeight: getFullHeight,
      getFullWidth: getFullWidth
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function getAppWidth(){
      return $window.innerWidth;
    }

    function getAppHeight(){
      return $window.innerHeight;
    }

    function isPhone(){
      return getAppWidth() <= PHONE_MAX;
    }

    function isTablet(){
      var appW = getAppWidth();
      return appW <= TABLET_MAX && appW > PHONE_MAX;
    }

    function getElementXPos( elemW, offset ){
      //$log.debug( 'iscAnimationService.getElementCenterXpos, elemW', elemW );
      //$log.debug( '...elemW',elemW );
      //$log.debug( '...getAppWidth()',getAppWidth() );

      return doPositionCalc( elemW, getAppWidth(), offset );
    }

    function getElementYPos( elemH, offset ){
      //$log.debug( 'iscAnimationService.getElementYPos' );
      //$log.debug( '............elemH',elemH );
      //$log.debug( '...offset', offset );
      //$log.debug( '...getAppHeight()',getAppHeight() );

      return doPositionCalc( elemH, getAppHeight(), offset );
    }

    function doPositionCalc( elemSize, appSize, offset ){
      if( !offset ){
        offset = 0;
      }

      if( elemSize >= appSize ){
        return -offset;
      }

      var center = (appSize - elemSize) / 2;
      center -= offset;

      return Math.max( 0, center );
    }

    function getNavWidth(){
      var appW = getAppWidth();

      if( isPhone() ){
        //$log.debug( '..returning appW', appW);
        return appW;
      }
      else{
        //$log.debug( '..returning NAV_MAX_W', NAV_MAX_W);
        return NAV_MAX_W;
      }
    }

    function getSideNavHeight( elemH ){
      return getNavHeight( elemH, SIDE_NAV_MIN_H );
    }

    function getSecondaryNavHeight( elemH ){
      return getNavHeight( elemH, SECONDARY_NAV_MIN_H );
    }

    function getFullHeight(){
      var body = document.body,
          html = document.documentElement;

      return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    }

    function getFullWidth(){
      var body = document.body,
          html = document.documentElement;

      return Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
    }


    /*
     private
     */
    function getNavHeight( elemH, MIN ){
      var appH = getAppHeight();

      //$log.debug( '...elemH',elemH );
      //$log.debug( '...MIN',MIN );

      if( isPhone() ){
        //$log.debug( '...returning appH',appH );
        return appH; // fill the screen for phones
      }
      else{
        var h = Math.max( elemH , MIN );
        //$log.debug( '...returning h', h );
        return h; // or set it to this
      }
    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( 'iscAnimationService', iscAnimationService );

})();
