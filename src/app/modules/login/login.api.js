( function() {
  'use strict';

  angular.module( 'login' )
    .factory( 'loginApi', loginApi );

  /* @ngInject */
  function loginApi( devlog, apiHelper, iscHttpapi ) {

    var baseUrl = apiHelper.getUrl( 'auth/' );

    var api = {
      login     : login,
      cacheLogin: cacheLogin,
      logout    : logout,
      ping      : ping,
      status    : status,
      keepAlive : keepAlive,
      changeRole: changeRole
    };

    return api;

    function changeRole( role ) {
      devlog.channel( 'loginApi' ).debug( 'loginApi.changeRole' );
      var data = { role: role };
      return iscHttpapi.put( baseUrl + 'role', data );
    }

    /**
     * Login via REST-ful API call
     * @param credentials
     * @returns {promise}
     */
    function login( credentials ) {
      devlog.channel( 'loginApi' ).debug( 'loginApi.login' );
      return iscHttpapi.post( baseUrl + 'login', credentials );
    }

    /**
     * Login via form post to CACHE server
     * @param credentials
     * @returns {promise}
     */
    function cacheLogin( credentials ) {
      devlog.channel( 'loginApi' ).debug( 'loginApi.iscLogin' );

      var pl     = "CacheUserName=" + credentials.CacheUserName + '&CachePassword=' + credentials.CachePassword + '&CacheNoRedirect=1';

      return iscHttpapi.formPost( baseUrl + 'login', pl );
    }

    /**
     * Terminates a user session
     * @returns {promise}
     */
    function logout() {
      devlog.channel( 'loginApi' ).debug( 'loginApi.logout' );
      return iscHttpapi.post( baseUrl + 'logout' );
    }

    function status() {
      devlog.channel( 'loginApi' ).debug( 'loginApi.login' );
      return iscHttpapi.get( baseUrl + 'status' );
    }

    function ping() {
      devlog.channel( 'loginApi' ).debug( 'loginApi.ping' );
      return iscHttpapi.get( baseUrl + 'ping', {
        responseAsObject  : true,
        preventDefault    : true,
        bypassSessionReset: true
      } );
    }

    function keepAlive() {
      devlog.channel( 'loginApi' ).debug( 'loginApi.keepAlive' );
      return iscHttpapi.get( baseUrl + 'keepAlive' );
    }
  }
} )();
