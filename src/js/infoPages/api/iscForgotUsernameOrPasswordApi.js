/**
 * Created by douglasgoodman on 11/18/14.
 *
 * -------------------
 * FORGOT PASSWORD
 *
 * method: POST
 * url: http://hscommdev.iscinternal.com/public/api/v1/auth/forgotpassword
 * @params credentials = {
 *   Email: 'some@email.com'.
 *   UserName: 'someUserName',
 *   SendUsername: true / false (optional)
 * }
 * the SendUsername property will request a username reminder.
 *
 * -------------------
 * FORGOT USERNAME
 *
 * method: POST
 * url: http://hscommdev.iscinternal.com/public/api/v1/auth/forgotusername
 * @params credentials = { Email: 'some@email.com' }
 *
 */

(function () {
  'use strict';

  iscForgotUsernameOrPasswordApi.$inject = [ '$log', '$q', '$http', 'iscCustomConfigService' ];

  function iscForgotUsernameOrPasswordApi( $log, $q, $http, iscCustomConfigService ){

    // --------------------
    // vars
    // --------------------

    // --------------------
    // class factory
    // --------------------

    var service = {
      forgotpassword: mockForgotpassword,
      forgotusername: mockForgotusername
    };

    return service;

    // --------------------
    // functions
    // --------------------

    function forgotpassword( options ) {
      //$log.debug( 'iscForgotUsernameOrPasswordApi.forgotpassword' );
      //$log.debug( '...options', options );
      return;

      var deferred = $q.defer();

      var url = iscCustomConfigService.getBaseUrl() + 'auth/forgotpassword';

      var req = {
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials:true,
        data: options
      };

      $http( req )
        .success( function( result ){
          //$log.debug( '...success', result );
          deferred.resolve( result );
        })
        .error( function( error ){
          //$log.debug( '...error', error );
          deferred.reject( error );
        });

      return deferred.promise;
    }

    function forgotusername( options ) {
      //$log.debug( 'iscForgotUsernameOrPasswordApi.forgotusername' );
      //$log.debug( '...options', options );
      return;

      var deferred = $q.defer();

      var url = iscCustomConfigService.getBaseUrl() + 'auth/forgotusername';

      var req = {
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials:true,
        data: options
      };

      $http( req )
        .success( function( result ){
          //$log.debug( '...success', result );
          deferred.resolve( result );
        })
        .error( function( error ){
          //$log.debug( '...error', error );
          deferred.reject( error );
        });

      return deferred.promise;
    }

    // --------------------
    // mocks
    // --------------------

    function mockForgotusername() {
      var deferred = $q.defer();

      var url = 'assets/mockData/infoPages/enroll.json';

      $http.get( url )
        .success( function( result ){
          deferred.resolve( result );
        })
        .error( function( error ){
          deferred.reject( error );
        });

      return deferred.promise;
    }

    function mockForgotpassword() {
      var deferred = $q.defer();

      var url = 'assets/mockData/infoPages/enroll.json';

      $http.get( url )
        .success( function( result ){
          deferred.resolve( result );
        })
        .error( function( error ){
          deferred.reject( error );
        });

      return deferred.promise;
    }


  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module('iscInfoPages')
    .factory('iscForgotUsernameOrPasswordApi', iscForgotUsernameOrPasswordApi);

})();
