/**
 * Created by debashish on 08/01/16.
 */

(function() {
  'use strict';

  angular.module( 'isc.core' )
    .factory( 'iscCookieManager', iscCookieManager );

  /* @ngInject */
  function iscCookieManager() {
    var service = {
      setItem   : setItem,
      getItem   : getItem,
      removeItem: removeItem
    };

    return service;


    function setItem( name, value, days ) {
      var date, expires;
      if ( days ) {
        date = new Date();
        date.setTime( date.getTime() + (days * 24 * 60 * 60 * 1000) );
        expires = "; expires=" + date.toGMTString();
      }
      else {
        expires = "";
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getItem( name ) {
      var nameEQ, params, param;
      nameEQ = name + "=";
      params = document.cookie.split( ';' );
      for ( var i = 0; i < params.length; i++ ) {
        param = params[i];
        while ( param.charAt( 0 ) == ' ' ) {
          param = param.substring( 1, param.length );
        }
        if ( param.indexOf( nameEQ ) == 0 ) {
          return param.substring( nameEQ.length, param.length );
        }
      }
      return null;
    }

    function removeItem( name ) {
      setItem( name, "", -1 );
    }

  }// END CLASS
})();
