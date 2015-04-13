/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscAuthenticationApi.$inject = [ '$log', '$http', '$state', 'iscCustomConfigService', 'iscSessionModel' ];

  function iscAuthenticationApi( $log, $http, $state, iscCustomConfigService, iscSessionModel ){
    //$log.debug( 'iscAuthenticationApi LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var api = {
      login: loginMock,
      logout: logoutMock,
      resetSession: resetSession
    };

    return api;

    // ----------------------------
    // functions
    // ----------------------------

    function login( credentials ){
      //$log.debug( 'iscAuthenticationApi.onLoginSuccess');
      //$log.debug( '...credentials', credentials );
      var url = iscCustomConfigService.getBaseUrl() + 'auth/login';

      var req = {
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials:true,
        data: credentials
      };

      return $http( req )
        .success( onLoginSuccess );
    }

    function onLoginSuccess( response ){
      //$log.debug( 'iscAuthenticationApi.onLoginSuccess');
      //$log.debug( '......response: ' + JSON.stringify( response ));

      iscSessionModel.create( response );
    }

    function logout(){
      var url = iscCustomConfigService.getBaseUrl() + 'auth/logout';
      return $http
        .post( url )

        .success( function(){
          onLogout();
        })

        .error( function(){
          onLogout();
        })
    }

    function onLogout(){
      //$log.debug( 'iscAuthenticationApi.onLogout');
      iscSessionModel.destroy();
      $state.go( 'index.home' );
    }

    function resetSession(){
      var url = iscCustomConfigService.getBaseUrl() + '_ping';
      return $http.get( url ).then( function( data ){
        return 'success';
      });
    }

    // ------------------------------------------------------------------------------
    // use these if you want to simulate login/logout but don't have internet connectivity
    // ------------------------------------------------------------------------------
    function loginMock( credentials ){
      var url = 'assets/mockData/login/login.json';
      return $http.get( url, credentials )
        .success( onLoginSuccess );
    }

    function logoutMock(){
      iscSessionModel.destroy();
      $state.go( 'index.home' );
    }


  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscHsCommunityAngular' )
    .factory( 'iscAuthenticationApi', iscAuthenticationApi );

})();
