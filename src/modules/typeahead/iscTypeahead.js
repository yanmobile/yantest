/**
 * Created by hzou on 07/29/2015
 *
 */

/**
 * USAGE:
 <isc-typeahead list-data="column.listData" on-select="cmcHrCtrl.selectContact(item)">
  <input type="text" placeholder="Look up a contact" ng-model="iscRowCtrl.editModeData[column.key].value" class="form-control">
 </isc-typeahead>
 */

(function(){
  'use strict';

  iscTypeahead.$inject = [ '$log', '$state', '$filter' ];

  function iscTypeahead( $log, $state, $filter ){//jshint ignore:line
    $log.debug( 'iscTypeahead LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var UP_ARROW_KEY_CODE   = 38;
    var DOWN_ARROW_KEY_CODE = 40;

    // ----------------------------
    // class factory
    // ----------------------------
    return {
      restrict        : "E",
      scope           : {
        onSelect : "&",
        listData : "=",
        listField: "@",
        limitTo  : "="
      },
      replace         : true,
      transclude      : true,
      link            : link,
      controller      : controller,
      controllerAs    : "cmcTaCtrl",
      bindToController: true,
      templateUrl     : 'typeahead/iscTypeahead.html'
    };

    // ----------------------------
    // functions
    // ----------------------------
    function controller( $filter ){
      $log.debug( 'iscTypeahead Controller LOADED');
      var self  = this;
      self.list = [];

      self.select = function( item ){
        self.onSelect( { item: item } );
        self.selectedItem = item;
        self.isDirty      = false;
        self.focusInput();
      };

      self.getFilteredList = function(){
        return $filter( 'filter' )( self.listData, self.inputVal );
      }
    }

    function link( scope, elem, attrs, cmcTaCtrl ){

      var input = elem.find( "input" );
      var list  = elem.find( '.isc-typeahead-list' );

      input.on( "input", updateList );

      input.on( 'keydown', focusFirstListItem );

      list.on( 'keydown', "li", handleArrowUpDown );

      cmcTaCtrl.focusInput = function(){
        input.focus();
      };

      list.width( input.outerWidth() );

      // ----------------------------
      // functions
      // ----------------------------
      function focusFirstListItem( event ){
        if( event.which === DOWN_ARROW_KEY_CODE ){
          list.find( "li:first" ).focus();
          event.preventDefault();
          event.stopPropagation();
        }
      }

      function updateList( evt ){
        scope.$apply( function(){
          cmcTaCtrl.selectedItem = null;
          cmcTaCtrl.isDirty      = true;
          cmcTaCtrl.inputVal     = input.val();
        } )
      }

      function handleArrowUpDown( event ){
        var index = $( event.target ).scope().$index;
        if( event.which === DOWN_ARROW_KEY_CODE && (index + 1) < cmcTaCtrl.getFilteredList().length ){
          $( list.find( "li" )[ index + 1 ] ).focus();
          event.preventDefault();
        } else if( event.which === UP_ARROW_KEY_CODE ){
          if( index === 0 ){
            input.focus();
          } else {
            $( list.find( "li" )[ index - 1 ] ).focus();
            event.preventDefault();
          }
        }
      }
    }

  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
    .directive( 'iscTypeahead', iscTypeahead );

})();
