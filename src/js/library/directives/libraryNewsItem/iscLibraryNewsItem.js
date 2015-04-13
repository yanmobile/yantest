/**
 * Created by douglasgoodman on 12/8/14.
 */
(function(){
  'use strict';

  iscLibraryNewsItemDirective.$inject = ['$log'];

  function iscLibraryNewsItemDirective( $log ){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope: {
        newsItem: '='
      },

      link: link,
      templateUrl: 'library/directives/libraryNewsItem/iscLibraryNewsItem.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){

      scope.newsItem.$$show = true;

      if(!scope.$last) {
        elem.after('&nbsp;');
      }

      scope.getOpenCloseIconClass = function(){
        var base = 'glyphicon ';
        var icon = scope.newsItem.$$show ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up';
        return base + icon + ' pull-right';
      };

      scope.toggleItem = function(){
        //$log.debug( 'iscLibraryNewsItem.toggleItem');
        scope.newsItem.$$show = !scope.newsItem.$$show;
      }
    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscLibrary' )
      .directive( 'iscLibraryNewsItemDirective', iscLibraryNewsItemDirective );

})();
