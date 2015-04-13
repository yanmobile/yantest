/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscLibrarySearchHealthDictionaryApi.$inject = [ '$log', '$http', '$q','iscLibraryModel' ];

  function iscLibrarySearchHealthDictionaryApi( $log, $http, $q, iscLibraryModel ){
    //$log.debug( 'iscLibrarySearchHealthDictionaryApi LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var api = {
      search: search
    };

    return api;

    // ----------------------------
    // functions
    // ----------------------------

    function search(){
      //$log.debug( 'iscLibrarySearchHealthDictionaryApi.search');

      var deferred = $q.defer();

      iscLibraryModel.clearSearchResults();

      $http.get( 'assets/mockData/library/library_health_dictionary.json' )

          .success( function( result ){
            iscLibraryModel.searchResults.results = result.Results;

            deferred.resolve( result );
          });

      return deferred.promise;
    }

  }// END CLASS


  // ----------------------------
  // inject
  // ----------------------------
  angular.module( 'iscLibrary' )
      .factory( 'iscLibrarySearchHealthDictionaryApi', iscLibrarySearchHealthDictionaryApi );

})();
