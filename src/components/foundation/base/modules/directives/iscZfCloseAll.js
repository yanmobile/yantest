/**
 * Created by hzou on 4/21/17.
 */

( function() {

  angular.module( 'isc.directives' )
    .directive( 'iscZfCloseAll', iscZfCloseAll );


  function iscZfCloseAll( FoundationApi ) {
    var directive = {
      restrict: 'A',
      link    : link
    };

    return directive;

    function link( scope, element, attrs ) {
      element.on( 'click', function( e ) {
        var tar   = e.target;
        var avoid = ['zf-toggle', 'zf-hard-toggle', 'zf-open', 'zf-close'].filter( function( e, i ) {
          return e in tar.attributes;
        } );

        if ( avoid.length > 0 ) {
          return;
        }

        var activeElements = document.querySelectorAll( '.is-active[zf-closable]' );

        if ( activeElements.length && !activeElements[0].hasAttribute( 'zf-ignore-all-close' ) ) {
          if ( getParentsUntil( tar, 'zf-closable' ) === false ) {
            e.preventDefault();
            // This line below is ONLY DIFFERENCE. It is needed to automatically close popup panels
            FoundationApi.publish( activeElements[0].id, ['toggle'] );
            FoundationApi.publish( activeElements[0].id, 'close' );
          }
        }
        return;
      } );
    }

    /** special thanks to Chris Ferdinandi for this solution.
     * http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
     */
    function getParentsUntil( elem, parent ) {
      for ( ; elem && elem !== document.body; elem = elem.parentNode ) {
        if ( elem.hasAttribute( parent ) ) {
          if ( elem.classList.contains( 'is-active' ) ) {
            return elem;
          }
          break;
        }
      }
      return false;
    }
  }

} )();
