/**
 * Created by douglasgoodman on 11/18/14.
 */

 (function(){
  'use strict';

  iscWellnessDataApi.$inject = [ '$log', '$http','$q','$timeout','iscWellnessModel' ];

  function iscWellnessDataApi( $log, $http, $q, $timeout,iscWellnessModel ){
    //$log.debug( 'iscWellnessDataApi LOADED');

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
      //$log.debug( 'iscWellnessDataApi.get');

      var deferred = $q.defer();

      $http.get( 'assets/mockData/wellness/wellness.json' )

      .success( function( result ){
        deferred.resolve( result.wellnessTiles );
      })

      .error( function( error ){
        //$log.debug( 'iscWellnessDataApi.ERROR');
        deferred.reject( error );
      });

      return deferred.promise;
    }

  }//END CLASS


  angular.module( 'iscWellness' )
  .factory( 'iscWellnessDataApi', iscWellnessDataApi );

})();
