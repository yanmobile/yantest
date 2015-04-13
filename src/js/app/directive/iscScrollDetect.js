/**
 * Created by dgoodman on 2/6/15.
 */
/**
 * Created by douglasgoodman on 2/6/15.
 */

(function(){
  'use strict';

  iscScrollDetect.$inject = [ '$log', '$window', '$compile'];

  function iscScrollDetect( $log, $window, $compile ){
    //$log.debug( 'iscScrollDetect LOADED');

    // ----------------------------
    // vars
    // ----------------------------


    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      scope:{
        topPosArray: '=',
        addClass: '&'
      },
      link: link,
      controllerAs: 'scrollCtrl'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attrs ){
      //$log.debug( 'iscScrollDetect.link');

      scope.handleResize = function(){

        var PHONE = 480;
        var TABLET = 960;
        var isPhone = $window.innerWidth <= PHONE;
        var isTablet = $window.innerWidth <= TABLET && !isPhone;

        // get the top pos appropriate to the media
        if( isPhone ){
          scope.yPos = scope.topPosArray[ 0 ];
        }
        else if( isTablet ){
          scope.yPos = scope.topPosArray[ 1 ];
        }
        else{
          scope.yPos = scope.topPosArray[ 2 ];
        }

        //$log.debug( '--------------------------');
        //$log.debug( '...........isPhone', isPhone );
        //$log.debug( '...........isTablet', isTablet );
        //$log.debug( '...........scope.yPos', scope.yPos );
        //$log.debug( '--------------------------');
      };

      scope.handleResize();

      angular.element( $window ).bind( 'resize', function(){
        scope.$apply(function(){
          scope.handleResize();
        });
      });

      scope.fixed = false;

      scope.addFixedClass = function(){
        //if( scope.fixed ) return;
        //$log.debug( '...........addFixedClass' );

        scope.addClass( { val: false });
        //scope.fixed = true;
      };

      scope.addDynamicClass = function(){
        //if( !scope.fixed ) return;
        //$log.debug( '...........addDynamicClass' );

        scope.addClass( { val: true });
        //scope.fixed = false;
      };

      angular.element( $window ).bind( "scroll", function( evt ) {
        //$log.debug( '...........scrollTop', evt.currentTarget.scrollY );

        if( evt.currentTarget.scrollY >= scope.yPos ){
          scope.addDynamicClass();
        }
        else{
          scope.addFixedClass();
        }
      });
    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'iscHsCommunityAngular' )
      .directive( 'iscScrollDetect', iscScrollDetect );

})();

