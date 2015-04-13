/**
 * Created by douglasgoodman on 11/18/14.
 */

(function () {
  'use strict';

  iscGeneralInfoApi.$inject = [ '$log', '$q', '$http' ];

  function iscGeneralInfoApi( $log, $q, $http ){

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

    // --------------------
    // mocks
    // --------------------

    function mockGet() {
      var deferred = $q.defer();

      //var url = 'http://hscommdev.iscinternal.com/public/api/v1/ehr';
      var url = 'assets/mockData/infoPages/data.json';

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
    .factory('iscGeneralInfoApi', iscGeneralInfoApi);

})();
