/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscMyAccountDataApi.$inject = [ '$log', '$http', '$q' ];

  function iscMyAccountDataApi( $log, $http, $q ){
    //$log.debug( 'iscRDataApi LOADED');

    // -----------------------------
    // vars
    // -----------------------------

    // -----------------------------
    // class factory
    // -----------------------------

    var api = {
      getHistory: getHistory,
      getSummary: getSummary,
      getProxies: getProxies
    };

    return api;


    // -----------------------------
    // functions
    // -----------------------------

    function getSummary(){

      //$log.debug( 'iscMyAccountDataApi.getHistory');

      var deferred = $q.defer();

      var url = 'assets/mockData/myAccount/accountSummary.json';

      $http.get( url )
        .success( function( result ){
          //$log.debug( '...shazam', result.Events);
          deferred.resolve( result );
        })

        .error( function( error ){
          deferred.reject( error );
        });

      return deferred.promise;


    }

    function getHistory(){
      //$log.debug( 'iscMyAccountDataApi.getHistory');

      var deferred = $q.defer();

      var url = 'assets/mockData/myAccount/history.json';

      $http.get( url )
        .success( function( result ){
          //$log.debug( '...shazam', result.Events);
          deferred.resolve( result.Events );
        })

        .error( function( error ){
          deferred.reject( error );
        });

      return deferred.promise;
    }

    function getProxies(){
      //$log.debug( 'iscMyAccountDataApi.getHistory');

      var deferred = $q.defer();

      var url = 'assets/mockData/myAccount/proxies.json';

      //var url = 'assets/mockData/myAccount/noData.json';


      $http.get( url )
        .success( function( result ){
          //$log.debug( '...shazam', result.Events);
          deferred.resolve( result );
        })

        .error( function( error ){
          deferred.reject( error );
        });

      return deferred.promise;
    }

  } // END CLASS

  // -----------------------------
  // inject
  // -----------------------------
  angular.module( 'iscMyAccount' )
      .factory( 'iscMyAccountDataApi', iscMyAccountDataApi );

})();
