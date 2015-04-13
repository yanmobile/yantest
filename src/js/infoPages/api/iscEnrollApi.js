/**
 * Created by douglasgoodman on 11/18/14.
 *
 * ACCEPTS: a POST payload with the following JSON:
 *
 * {
  "FirstName": "Test",
  "MiddleName": "Middle",
  "LastName": "LastName",
  "Sex": "M",
  "MothersMaidenName": "MaidenName",
  "SSN": "123456789",
  "DateOfBirth": "1945-06-07",
  "Address1": "Home",
  "City": "City",
  "State": "ME",
  "ZipCode": "0211",
  "Email": "test@example.com",
 "TermsAccepted": true, // boolean flag for acceptance of terms -- this will be modified at some point in the next little while to be more robust
 }
 *
 *
 * RETURNS:
 * JSON object with the error property set OR the RequestID property set to a numeric ID.
 *
 *
 */

(function () {
  'use strict';

  iscEnrollApi.$inject = [ '$log', '$q', '$http', 'iscCustomConfigService' ];

  function iscEnrollApi( $log, $q, $http, iscCustomConfigService ){

    // --------------------
    // vars
    // --------------------

    // --------------------
    // class factory
    // --------------------

    var service = {
      enrollSelf: mockEnrollSelf
    };

    return service;

    // --------------------
    // functions
    // --------------------

    function enrollSelf( options ) {
      //$log.debug( 'iscEnrollApi.enrollSelf' );
      //$log.debug( '...options', options );

      var deferred = $q.defer();

      var url = iscCustomConfigService.getBaseUrl() + 'enroll/self';

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
          $log.debug( '...success', JSON.stringify(result) );
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

    function mockEnrollSelf() {
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
    .factory('iscEnrollApi', iscEnrollApi);

})();
