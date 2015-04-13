/**
 * Created by douglasgoodman on 11/18/14.
 */

(function () {
  'use strict';

  iscPatientDataApi.$inject = [ '$log', '$q', '$http' ];

  function iscPatientDataApi( $log, $q, $http ){

    // --------------------
    // vars
    // --------------------

    // --------------------
    // class factory
    // --------------------

    var service = {
      get: mockGet
    };

    return service;

    // --------------------
    // functions
    // --------------------

    function get() {
      var deferred = $q.defer();

      var url = 'http://hscommdev.iscinternal.com/public/api/v1/ehr';

      $http.get( url )
        .success( function( result ){
          deferred.resolve( result );
        })
        .error( function( error ){
          deferred.reject( error );
        });

      return deferred.promise;
    }

    // --------------------
    // mocks
    // --------------------

    function mockGet() {
      var deferred = $q.defer();

      var url = 'assets/mockData/home/mockPatientData.json';

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

  angular.module('iscHome')
    .factory('iscPatientDataApi', iscPatientDataApi);

})();
