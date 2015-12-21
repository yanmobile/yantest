/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
    .filter( 'iscHighlight', iscHighlightFilter );

  /* @ngInject */
  function iscHighlightFilter( devlog, $sce ){
    devlog.channel('iscHighlightFilter').debug( 'iscHighlightFilter LOADED');

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
      devlog.channel('iscHighlightFilter').debug('iscHighlight.setHighlight');

      if( phrase && text ){
        devlog.channel('iscHighlightFilter').debug('...text', text);

        text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
          '<span class="isc-highlighted">$1</span>');
      }

      return $sce.trustAsHtml(text);
    }


  }//END CLASS

})();
