/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscLibraryNewsApi.$inject = [ '$log', '$http', '$q','iscLibraryModel' ];

  function iscLibraryNewsApi( $log, $http, $q, iscLibraryModel ){
    //$log.debug( 'iscLibraryNewsApi LOADED');

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
      //$log.debug( 'iscLibraryNewsApi.get');

      var deferred = $q.defer();

      $http.get( 'assets/mockData/library/library_news.json' )

          .success( function( result ){
            iscLibraryModel.setNewsItems( result.children );
            deferred.resolve( result );
          })

          .error( function( error ){
            //$log.debug( 'iscLibraryNewsApi.ERROR');
            deferred.reject( error );
          });

      return deferred.promise;
    }

  }// END CLASS


  // ----------------------------
  // inject
  // ----------------------------
  angular.module( 'iscLibrary' )
      .factory( 'iscLibraryNewsApi', iscLibraryNewsApi );

})();
