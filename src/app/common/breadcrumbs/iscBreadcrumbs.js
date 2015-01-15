/**
 * Created by douglasgoodman on 11/29/14.
 */
(function(){
  'use strict';

  // ----------------------------
  // vars
  // ----------------------------

  // ----------------------------
  // factory
  // ----------------------------

  iscBreadcrumbs.$inject = [ '$log', 'iscHistoryService' ];

  function iscBreadcrumbs( $log, iscHistoryService ){
    return {
      scope: {
        history: '=',
        maxCrumbs: '='
      },

      templateUrl: 'breadcrumbs/breadcrumb.html',

      link: link
    };

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){

//      //$log.debug( 'iscBreadcrumbs.link');
//      //$log.debug( '...history: ' + JSON.stringify( scope.history ));

      scope.onLinkClicked = function( stateObj ){
//        //$log.debug( 'iscBreadcrumbs.onLinkClicked: ' + stateObj.state );

        var idx = _.findIndex( scope.history, stateObj  );

        // remove all but the link you clicked
        scope.history.splice( idx + 1, scope.history.length );

      };

      scope.getLinkText = function( state ){
        var arr  = state.split('.');

        // the first element will be 'index'.
        // this will trim that from the string, so 'index.myAccount.summary
        // becomes 'myAccount/summary'
        var name =  _.rest( arr ).join('/');
        return  name;
      };
    }

  }// END CLASS



  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .directive('iscBreadcrumbs', iscBreadcrumbs );

})();
