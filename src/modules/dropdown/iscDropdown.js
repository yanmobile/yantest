/**
 * Created by yale marc on 3/17/15.
 *
 SAMPLE HTML USAGE

 <isc-dropdown list-data="someController.dropListItems"
               list-field="label"
               drop-selected-item="someController.dropSelectedItem"
               drop-id="someUniqueId"
               drop-icon="fa fa-icon"
               drop-minwidth="200"
               drop-maxwidth="'100%'"
               drop-width="'356px'"
               drop-placeholder="'Select something..'"
               drop-css-class="some-class"
               drop-list-css-class="some-class"
               drop-list-item-css-class="some-class"
               drop-chevron-css-class="some-class">

 @param listData = array of objects
 @param listField = string (key in obj)
 @param dropId = string must be unique in DOM
 @param dropWidth, dropMinwidth, dropMaxwidth = string ('123%', '123px') or number
 */

(function(){
  'use strict';

  iscDropdown.$inject = [ '$log', 'devlog', '$timeout', '$rootScope', 'DROPDOWN_EVENTS' ];

  function iscDropdown( $log, devlog , $timeout, $rootScope, DROPDOWN_EVENTS){//jshint ignore:line

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      link: link,
      restrict: 'EA',
      replace: true,
      scope: {
        listData: '=',
        listField: '@',
        dropSelectedItem: '=',
        dropId: '@',
        dropIcon: '@',
        dropMinwidth: '=',
        dropMaxwidth: '=',
        dropWidth: '=',
				dropRequired: '=',
        dropPlaceholder: '=',
        dropCssClass: '@',
        dropListCssClass: '@',
        dropListItemCssClass: '@',
        dropChevronCssClass: '@'
      },
      templateUrl: 'dropdown/iscDropdown.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){//jshint ignore:line
      //$log.debug( 'iscDropdown' );

      // ---------------------------
      // vars
      // ---------------------------

      scope.dropOpen = false;
      scope.iconLeft = 0;
      scope.itemWidth = 0;
      scope.isShowDrop = false;
      scope.listField = 'label';

      // ---------------------------
      // businsess logic
      // ---------------------------

      scope.setWidth = function(){
        var hiddenList = angular.element('#'+scope.dropId+'-list');
        var blockTitle = angular.element('#'+scope.dropId+'-block');
        var blockMain = angular.element('#'+scope.dropId+'-main');
        var iconWidth = angular.element('#'+scope.dropId+'-icon').outerWidth();

        if(scope.dropMinwidth){
          blockMain.css({'min-width': (scope.dropMinwidth)});
        }

        if(scope.dropMaxwidth){
          blockMain.css({'max-width':scope.dropMaxwidth});
        }

        if(scope.dropWidth){
          blockMain.width(scope.dropWidth);
          blockTitle.width(blockMain.width() - iconWidth - 2);
        }
        else{
          if(angular.element('form').width()-50 < angular.element('#'+scope.dropId).width()){
            angular.element('#'+scope.dropId).width(angular.element('form').width()-20);
          }
          else{
            //SET WIDTH OF TITLE BLOCK BASED ON LARGER OF TITLE OR DROPDOWN CONTENT
            hiddenList.css({'width':'auto'});
            if(hiddenList.width() > blockTitle.width()){
              blockTitle.width(hiddenList.width());
            }
          }
        }
      };

      scope.showHideItems = function(){
        devlog.channel('iscDropdown').debug( 'iscDropdown.showHideItems');
        $rootScope.$broadcast( DROPDOWN_EVENTS.showDropdownList,
            {
              "listData" : scope.listData,
              "dropId" : scope.dropId,
              "listField" : scope.listField,
              "dropListCssClass" : scope.dropListCssClass,
              "dropListItemCssClass" : scope.dropListItemCssClass
            }
        );
      };

      scope.showHideItems = _.debounce(scope.showHideItems, 150, {trailing: false, leading: true});

      $rootScope.$on( DROPDOWN_EVENTS.dropdownItemSelected, function(e, selection){
        //devlog.channel('iscDropdown').debug( 'iscDropdown.dropdownItemSelected', selection);
        //CHECK TO ASSURE THAT CORRECT ITEM
        if(scope.dropId === selection.dropId ){
          scope.dropTitle = selection.selectedItem[scope.listField] ;
          scope.dropSelectedItem = selection.selectedItem;

          //devlog.channel('iscDropdown').debug( '...scope.dropTitle', scope.dropTitle);
          //devlog.channel('iscDropdown').debug( '...scope.dropSelectedItem', scope.dropSelectedItem);
        }
      });

      // ---------------------------
      // watchers
      // ---------------------------

      // when you reset the list data, reset the display to the placeholder text
      // Only do this if the list is different, otherwise this is called on init
      // and the dropdown is always reset to the placeholder.
      scope.$watch('listData',function(newList, oldList){
        if (newList !== oldList) {
          scope.dropTitle        = scope.dropPlaceholder;
          scope.dropSelectedItem = null;
        }
      });

      // when you manually set the selected item, update the page title
      scope.$watch('dropSelectedItem',function( newVal ){
        if( !newVal ) return;
        scope.updateTitle();
      });

      scope.updateTitle = function(){
        var title = scope.dropSelectedItem[ scope.listField ];
        //$log.debug( '...title', title );
        if( !title ){
          throw new Error( 'This item does not have a display value' );
        }
        else{
          scope.dropTitle = title;
        }
      };

      // ---------------------------
      // dom
      // ---------------------------

      angular.element(window).resize(function(){//jshint ignore:line
        scope.setWidth();
      });

      function domReady(){
        $timeout(function(){
          scope.setWidth();
          if( scope.dropSelectedItem ){
            scope.updateTitle();
          }
          else{
            scope.dropTitle = scope.dropPlaceholder;
          }
        });
      };

      // ---------------------------
      // init
      // ---------------------------
      domReady();

    }//END LINK

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscDropdown', iscDropdown );

})();
