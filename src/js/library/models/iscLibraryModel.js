/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscLibraryModel.$inject = [ '$log'];

  function iscLibraryModel( $log ){
//    //$log.debug( 'iscLibraryModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var formData = [];
    var newsItems = [];
    var searchTerm = { term: 'Flu' };
    var searchResults = { results: '' };
    var currentState = { key: '' };

    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      currentState: currentState,
      searchTerm: searchTerm,
      searchResults: searchResults,

      getFormData: getFormData,
      setFormData: setFormData,

      getNewsItems: getNewsItems,
      setNewsItems: setNewsItems,

      clearSearch: clearSearch,
      clearSearchTerm: clearSearchTerm,
      clearSearchResults: clearSearchResults
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function getFormData(){
      return formData;
    }

    function setFormData( val ){
      formData  = val;
    }

    // -------------
    function getNewsItems(){
      return newsItems;
    }

    function setNewsItems( val ) {
      newsItems = val;
    }

    // -------------
    function getSearchTerm(){
      return searchTerm;
    }

    function setSearchTerm( val ) {
      searchTerm = val;
    }

    // -------------
    function getSearchResults(){
      return searchResult;
    }

    function setSearchResults( val ){
      searchResults.results = val;
    }

    // -------------
    function clearSearch(){
      clearSearchTerm();
      clearSearchResults();
    }

    function clearSearchTerm(){
      searchTerm.term = null;
    }

    function clearSearchResults(){
      searchResults.results = null;
    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'iscLibrary' )
      .factory( 'iscLibraryModel', iscLibraryModel );

})();
