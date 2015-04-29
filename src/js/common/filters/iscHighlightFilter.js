/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';

  iscHighlightFilter.$inject = [ '$log', '$sce' ];

  function iscHighlightFilter( $log, $sce ){
//    //$log.debug( 'iscHighlightFilter LOADED');

    // ----------------------------
    // vars
    // ----------------------------


    // ----------------------------
    // class factory
    // ----------------------------

    return setHighlight;

    // ----------------------------
    // functions
    // ----------------------------


    function setHighlight( text, phrase ) {
      //$log.debug('iscHighlight.setHighlight');

      if( phrase && text ){
        //$log.debug('...text', text);

        text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
          '<span class="isc-highlighted">$1</span>');
      }

      return $sce.trustAsHtml(text);
    }


  }//END CLASS
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
      .filter( 'iscHighlight', iscHighlightFilter );

})();
