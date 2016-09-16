/**
 * Created by debashish on 08/01/16.
 */

( function() {
  'use strict';

  angular.module( 'isc.core' )
    .factory( 'iscCookieManager', iscCookieManager );

  /* @ngInject */
  function iscCookieManager( $window ) {
    var service = {
      set   : set,
      get   : get,
      remove: remove
    };

    return service;

    /*========================================
     =               function                =
     ========================================*/

    function get( key ) {
      var rawValue = getValueFromCookie( key );
      var value;
      try {
        value = _.isNil( rawValue ) ? undefined : JSON.parse( rawValue );
      } catch ( ex ) {
        value = undefined;
      }
      return value;
    }

    function set( key, value, params ) {
      var stringified = JSON.stringify( value );
      setValueInCookie( key, stringified, params );
    }

    function remove( key ) {
      setValueInCookie( key, "", { 'expires': -1 } );
    }

    /*========================================
     =                 private   =             =
     =======================================*/
    function setValueInCookie( name, value, params ) {
      var date,
          expires = '';
      if ( params && params.expires ) {
        date = new Date();
        date.setTime( date.getTime() + ( ( parseInt( params.expires, 10 ) ) * 24 * 60 * 60 * 1000 ) );
        expires = "; expires=" + date.toGMTString();
      }
      $window.document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getValueFromCookie( name ) {
      var nameEQ = name + "=",
          value = null,
          params = $window.document.cookie.split( ';' );

      params.forEach( function( param ) {
        param = _.trimStart( param );
        if ( _.startsWith( param, nameEQ ) ) {
          value =  _.trimStart( param, nameEQ );
        }
      } );
      return value;
    }

  }// END CLASS
} )();
