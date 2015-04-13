/**
 * Created by satishmummadi on 12/15/14.
 */
 (function(){
  'use strict';

  iscWellnessTile.$inject = ['$log'];

  function iscWellnessTile( $log ){
    $log.debug('iscWellnessTile.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope: {
        item: '='
      },

      restrict: 'A',
      replace: true,
      transclude: false,
      templateUrl: 'wellness/directives/wellnessTile/iscWellnessTile.html',
      link: link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function link( scope, elem, attr ){
      $log.debug( 'iscWellnessTile.link, item', scope.item );
    }

  }

  // ----------------------------
  // inject
  // ----------------------------

   angular.module( 'iscWellness' )
     .directive( 'iscWellnessTile', iscWellnessTile );

 })();
