/**
 * Created by yale marc on 3/17/15.
 SAMPLE HTML USAGE
 <div
 isc-dropdown-selection-list-directive
 list-data = "listData"
 list-field = "listField"
 drop-id = "dropId"
 ref-name = "refName"
 is-show-drop = "isShowDrop">
 </div>
 */

(function(){
  'use strict';

  iscDropdownSelectionListDirective.$inject = [ '$log', '$parse', '$timeout', '$rootScope', '$window', 'DROPDOWN_EVENTS', '$global' ];

  function iscDropdownSelectionListDirective( $log, $parse , $timeout, $rootScope, $window, DROPDOWN_EVENTS, $global){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      link: link,
      scope: {
        listData: '=',
        listField: '=',
        dropTitle: '=',
        dropId: '=',
        dropIcon: '=',
        refName: '=',
        isShowDrop: '=',
        dropListCssClass: '@',
        dropListItemCssClass: '@',
        useFormPositioning: '@'
      },
      templateUrl: 'dropdown/iscDropdownList.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){//jshint ignore:line
      var keyCode = $global.keyCode;
      var dropElem;

      scope.selectItem = function( selectedObj ){
        $log.debug('iscDropdownSelectionList.selectItem', selectedObj );

        var selectCriteria = {
          dropId: scope.dropId,
          selectedItem: selectedObj
        };
        $rootScope.$emit( DROPDOWN_EVENTS.dropdownItemSelected, selectCriteria );
        hideDropdownList();
      };

      scope.$on('destroy',function(){
        //console.log('DESTROY THIS LIST not presently used');
      });

      $rootScope.$on(DROPDOWN_EVENTS.showDropdownList, function(event, params) {

        //IF THIS IS A CALL FROM A DIFFERENT DROPDOWN HIDE PREVIOUS DROPDOWN
        if(scope.dropId !== params.dropId){
          hideDropdownList();
          dropElem = params.dropElem;
        }
        //IF HIDDEN THEN SETUP AND SHOW IF NOT THEN HIDE AND REMOVE LISTENERS
        if(angular.element('#modal-dropdown').css('visibility') === 'hidden'){
          scope.listData = params.listData;
          scope.dropId = params.dropId;
          scope.dropListCssClass = params.dropListCssClass;
          scope.dropListItemCssClass = params.dropListItemCssClass;
          scope.listField = params.listField;
          scope.refName = params.listField;
          scope.useFormPositioning = params.useFormPositioning;
          scope.modalVisible = false;
          scope.showDropList = true;
          $timeout(function(){
            $rootScope.$emit( DROPDOWN_EVENTS.dropdownShow );
          }, 0);
          scope.setDropDown(params.dropId);
          angular.element('#modal-dropdown').css('visibility','visible');
          scope.setDropScroll(params.dropId);
          scope.setClickWatcher();
        }
        else{
          hideDropdownList();
          angular.element(document).unbind('click'); //jshint ignore:line
          angular.element($window).unbind('scroll');
        }
        scope.dropId = params.dropId;
      });

      scope.setDropDown = function(dropID){

        var offsetHeight = angular.element('#'+dropID+'-block').height();
        var clickOffset =angular.element('#'+dropID+'-block').offset();
        var bodyScrollTop = angular.element('body').scrollTop();
        var elPositionTop = clickOffset.top + offsetHeight;
        var elTop = elPositionTop - bodyScrollTop;
        //THE +3 IS TO ACCOUNT FOR THE TOP MARGIN WHICH IS NOT CALC IN OUTER. THE .5 ADDS HALF A HEIGHT TO GIVE SPACE AT THE BOTTOM OF THE LIST.
        var elHeight = angular.element('#'+dropID+'-list').outerHeight() * (scope.listData.length) + 3; //jshint ignore: line
        var elWidth = angular.element('#'+dropID+'-block').outerWidth() + angular.element('#'+dropID+'-icon').outerWidth() -1;

        //DETERMINE IF HEIGHT NEEDS TO BE TRUNCATED OR DROPDOWN NEEDS TO BE DROP UP
        if(elTop + elHeight > $window.innerHeight){
          //DETERMINE IF DROP DOWN NEEDS TO BE DROP UP
          if(($window.innerHeight - elTop ) < 50){
            if(elTop > elHeight){
              //DROP UP FULL HEIGHT
              elPositionTop = elPositionTop - elHeight - offsetHeight;
            }
            else{
              //DROP UP TRUNCATED HEIGHT
              elHeight = elTop - 50 - offsetHeight;
              elPositionTop = elPositionTop - elHeight - offsetHeight;
            }
          }
          else{
            elHeight = $window.innerHeight - elTop - 25;
          }
        }
        angular.element('#modal-dropdown').css(
            {'left': clickOffset.left,
              'top': !!scope.useFormPositioning ? elPositionTop : elTop,
              'visibility': 'visible',
              'height': elHeight,
              'overflow':'auto',
              'width': elWidth
            });

      };

      scope.setDropScroll = function(dropID){
        angular.element($window).bind('scroll',function(){
          scope.setDropDown(dropID);
        });
      };

      scope.setClickWatcher = function(){
        var doc = angular.element(document); //jshint ignore:line
        doc.unbind('click');
        //CLICK BINDING IS TO BE ABLE TO REMOVE ON NON DROPDOWN CLICKS
        doc.bind('click',function(event){//jshint ignore:line
          // REMOVE BINDING, CLOSE SELECTION LIST WHEN USER CLICKS ON NON-DROPDOWN ITEM
          var evtStatus = angular.element(event.target).hasClass('isc-dd');
          if(!evtStatus){
            unbindEvents();
          }
        });
      };
      function unbindEvents(){
        angular.element(document).unbind('click');//jshint ignore: line
        angular.element($window).unbind('scroll');
        scope.showDropList = false;
        hideDropdownList();
      }

      function hideDropdownList(){
        angular.element('#modal-dropdown').css({'visibility':'hidden'});
      }

      $rootScope.$on( DROPDOWN_EVENTS.dropdownItemSelected ,function(){
        unbindEvents();
      });


      elem.on( 'keydown', '.isc-dropdown-item', handleArrowUpDown );

      function handleArrowUpDown( event ){
        event.preventDefault();
        var index = $( event.target ).scope().$index;
        if( event.which === keyCode.DOWN && (index + 1) < scope.listData.length ){
          $( elem.find( '.isc-dropdown-item' )[ index + 1 ] ).focus();
          event.preventDefault();
        } else if( event.which === keyCode.UP ){
          if( index > 0 ){
            $( elem.find( '.isc-dropdown-item' )[ index - 1 ] ).focus();
          }
        } else if( event.which === keyCode.ENTER ){
          $( event.target ).click();
        } else if(event.which === keyCode.ESCAPE && dropElem){
          hideDropdownList();
          dropElem.focus();
        }
      }
    }//END LINK

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscDropdownSelectionListDirective', iscDropdownSelectionListDirective );

})();
