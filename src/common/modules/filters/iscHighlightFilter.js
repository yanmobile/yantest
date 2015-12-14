/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscHighlightFilter( devlog, $sce ){
//    devlog.channel('').debug( 'iscHighlightFilter LOADED');

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
      devlog.channel('').debug('iscHighlight.setHighlight');

      if( phrase && text ){
        devlog.channel('').debug('...text', text);

        text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
          '<span class="isc-highlighted">$1</span>');
      }

      return $sce.trustAsHtml(text);
    }


  }//END CLASS
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
      .filter( 'iscHighlight', iscHighlightFilter );

})();
