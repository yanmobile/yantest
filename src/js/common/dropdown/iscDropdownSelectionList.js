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

  iscDropdownSelectionListDirective.$inject = [ '$log', '$parse', '$timeout', '$rootScope', '$window', 'DROPDOWN_EVENTS' ];

  function iscDropdownSelectionListDirective( $log, $parse , $timeout, $rootScope, $window, DROPDOWN_EVENTS){

		// ----------------------------
		// vars
		// ----------------------------

		var dropCt = 0;


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
        isShowDrop: '='
      },
      templateUrl: 'common/dropdown/iscDropdownList.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){//jshint ignore:line

      scope.selectItem = function( value, title ){
        $log.debug('iscDropdownSelectionList.selectItem', value, title );
        //var selectArray = [value, scope.dropId];
        var selectCriteria = {
          dropId: scope.dropId,
          title: title ? title : value,
          value: value
        };
        $rootScope.$broadcast( DROPDOWN_EVENTS.dropdownItemSelected, selectCriteria );
        hideDropdownList();
      };

      scope.$on('destroy',function(){
        //console.log('DESTROY THIS LIST not presently used');
      });

      $rootScope.$on(DROPDOWN_EVENTS.showDropdownList, function(event, data, dropID, listField){

          //IF THIS IS A CALL FROM A DIFFERENT DROPDOWN HIDE PREVIOUS DROPDOWN
          if(scope.dropId !== dropID){
            hideDropdownList();
          }
          //IF HIDDEN THEN SETUP AND SHOW IF NOT THEN HIDE AND REMOVE LISTENERS
          if(angular.element('#modal-dropdown').css('visibility') === 'hidden'){
            scope.listData = data;
            scope.dropId = dropID;
            scope.listField = listField;
            scope.refName = listField;
            scope.modalVisible = false;
            scope.showDropList = true;
            $rootScope.$broadcast( DROPDOWN_EVENTS.dropdownShow );
            scope.setDropDown(dropID);
            angular.element('#modal-dropdown').css('visibility','visible');
            scope.setDropScroll(dropID);
            scope.setClickWatcher();
          }
          else{
            hideDropdownList();
            angular.element(document).unbind('click'); //jshint ignore:line
            angular.element($window).unbind('scroll');
          }
        scope.dropId = dropID;
      });

      scope.setDropDown = function(dropID){

        var offsetHeight = angular.element('#'+dropID+'-block').height();
        var clickOffset =angular.element('#'+dropID+'-block').offset();
        var bodyScrollTop = angular.element('body').scrollTop();
        var elTop = clickOffset.top + offsetHeight - bodyScrollTop;
        //THE +3 IS TO ACCOUNT FOR THE TOP MARGIN WHICH IS NOT CALC IN OUTER. THE .5 ADDS HALF A HEIGHT TO GIVE SPACE AT THE BOTTOM OF THE LIST.
        var elHeight = ((angular.element('#'+dropID+'-list').outerHeight()+3) * (scope.listData.length + .5));
        var elWidth = angular.element('#'+dropID+'-block').outerWidth() + angular.element('#'+dropID+'-icon').outerWidth() -1;

        //DETERMINE IF HEIGHT NEEDS TO BE TRUNCATED OR DROPDOWN NEEDS TO BE DROP UP
        if(elTop + elHeight > $window.innerHeight){
          //DETERMINE IF DROP DOWN NEEDS TO BE DROP UP
          if(($window.innerHeight - elTop ) < 50){
            if(elTop > elHeight){
              //DROP UP FULL HEIGHT
              elTop = elTop - elHeight - offsetHeight;
            }
            else{
              //DROP UP TRUNCATED HEIGHT
              elHeight = elTop -50 - offsetHeight;
              elTop = elTop  - elHeight -offsetHeight;
            }
          }
          else{
            elHeight = $window.innerHeight - elTop - 25;
          }
        }
        angular.element('#modal-dropdown').css(
          {'left': clickOffset.left,
            'top':elTop,
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
        angular.element(document).unbind('click');
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


    }//END LINK

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
    .directive( 'iscDropdownSelectionListDirective', iscDropdownSelectionListDirective );

})();
