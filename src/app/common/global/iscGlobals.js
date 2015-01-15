/**
 * Created by douglasgoodman on 11/21/14.
 */
(function(){
  'use strict';

  iscGlobals.$inject = [ '$log', '$rootScope', '$document' ];

  function iscGlobals( $log, $rootScope, $document ){

    // --------------------
    //$document.ready( function() {
    //  iscEnquireService.register("screen and (max-width: 767px)", {
    //
    //    match: function () {
    //      $rootScope.$broadcast('globalStyles:maxWidth767', true);
    //    },
    //
    //    unmatch: function () {
    //      $rootScope.$broadcast('globalStyles:maxWidth767', false);
    //    }
    //  });
    //});

    // ----------------------------
    // vars
    // ----------------------------

    var settings = {
      fixedHeader: true,
      headerBarHidden: true,
      leftbarCollapsed: false,
      leftbarShown: false,
      rightbarCollapsed: false,
      fullscreen: false,
      layoutHorizontal: true,
      layoutHorizontalLargeIcons: false,
      layoutBoxed: true,
      showSearchCollapsed: false
    };

    var brandColors = {
      'default':      '#ecf0f1',

      'inverse':      '#95a5a6',
      'primary':      '#3498db',
      'success':      '#2ecc71',
      'warning':      '#f1c40f',
      'danger':       '#e74c3c',
      'info':         '#1abcaf',

      'brown':        '#c0392b',
      'indigo':       '#9b59b6',
      'orange':       '#e67e22',
      'midnightblue': '#34495e',
      'sky':          '#82c4e6',
      'magenta':      '#e73c68',
      'purple':       '#e044ab',
      'green':        '#16a085',
      'grape':        '#7a869c',
      'toyo':         '#556b8d',
      'alizarin':     '#e74c3c'
    };

    // ----------------------------
    // class factory
    // ----------------------------

    var service  = {
      values: values,
      get: get,
      set: set,

      getBrandColor: getBrandColor
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function values() { // should be getSettings or getAllSettings
      return settings;
    }

    function get( key ){ // should be getSetting( key )
//      //$log.debug( 'iscGlobals.get' );
//      //$log.debug( '...settings: ' + JSON.stringify( settings ));
      return settings[ key ];
    }

    function set( key, value ){ // should be changeSetting( key )
      settings[ key ] = value;

      $rootScope.$broadcast( 'globalStyles:changed', {key: key, value: settings[ key ]} );
      $rootScope.$broadcast( 'globalStyles:changed:' + key, settings[ key ] );
    }

    // --------------------
    function getBrandColor( name ){
      if (brandColors[ name ]) {
        return brandColors[ name ];
      }
      else {
        return brandColors['default'];
      }
    }

  }// END CLASS



  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( '$global', iscGlobals );

})();
