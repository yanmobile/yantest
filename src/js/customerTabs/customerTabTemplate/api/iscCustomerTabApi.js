/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscCustomerTabApi.$inject = [ '$log' ,'$http', '$q','iscCustomerTabModel' ];

  function iscCustomerTabApi( $log, $http, $q, iscCustomerTabModel ){
    //$log.debug( 'iscCustomerTabApi LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var api = {
      get: get
    };

    return api;

    // ----------------------------
    // functions
    // ----------------------------

    function get(){
      //$log.debug( 'iscCustomerTabApi.get');

      var deferred = $q.defer();

      $http.get( 'assets/mockData/customerTab/customerTabData.json' )

          .success( function( result ){
            deferred.resolve( result.data );
          })

          .error( function( error ){
            //$log.debug( 'iscCustomerTabApi.ERROR');
            deferred.reject( error );
          });

      return deferred.promise;
    }

  }// END CLASS


  angular.module( 'iscCustomerTab' )
      .factory( 'iscCustomerTabApi', iscCustomerTabApi );

})();
