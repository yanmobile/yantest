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
    var dropTruncated = false;
    var clickCt = 0;
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

    function link( scope, elem, attr ){

      scope.selectItem = function(value){

        //var selectArray = [value, scope.dropId];
        var selectCriteria = {
          dropId: scope.dropId,
          value: value
        };
        $rootScope.$broadcast( DROPDOWN_EVENTS.dropdownItemSelected, selectCriteria);
        hideDropdownList();
      };

      scope.$on('destroy',function(){
        //console.log('DESTROY THIS LIST not presently used');
      });

      $rootScope.$on('SHOW_DROPDOWN_LIST', function(event, data, dropID, listField){
        //console.log('GOT SHOW DROP IN LIST DIRECTIVE');
        //COUNT IS TO DEAL WITH CALL BEING RECEIVED TWICE
        if(dropCt === 0){
          //IF THIS IS A CALL FROM A DIFFERENT DROPDOWN HIDE PREVIOUS DROPDOWN
          if(scope.dropId != dropID){
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
            angular.element(document).unbind('click');
            angular.element($window).unbind('scroll');
          }

        }
        if(dropCt === 1){
          dropCt = -1
        }
        dropCt++;
        scope.dropId = dropID;
      });

      scope.setDropDown = function(dropID){

        var offsetHeight = angular.element('#'+dropID+'-block').height();
        var clickOffset =angular.element('#'+dropID+'-block').offset();
        var bodyScrollTop = angular.element('body').scrollTop();
        var elTop = clickOffset.top + offsetHeight - bodyScrollTop;
        var elHeight = angular.element('#'+dropID+'-list').outerHeight() * scope.listData.length;
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
          })
      };

      scope.setDropScroll = function(dropID){
        angular.element($window).bind('scroll',function(event){
          scope.setDropDown(dropID);
        })
      };

      scope.setClickWatcher = function(){
        angular.element(document).unbind('click');
        //CLICK BINDING IS TO BE ABLE TO REMOVE ON NON DROPDOWN CLICKS
        angular.element(document).bind('click',function(event){
          // REMOVE BINDING, CLOSE SELECTION LIST WHEN USER CLICKS ON NON-DROPDOWN ITEM
          var evtStatus = angular.element(event.target).hasClass('isc-dd');
          if(!evtStatus){
            angular.element(document).unbind('click');
            angular.element($window).unbind('scroll');
            scope.showDropList = false;
            hideDropdownList();
          }
        });
      };

      function hideDropdownList(){
        angular.element('#modal-dropdown').css({'visibility':'hidden'})
      }

      $rootScope.$on( DROPDOWN_EVENTS.dropdownItemSelected ,function(){
        scope.showDropList = false;
      })

    }//END LINK

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
    .directive( 'iscDropdownSelectionListDirective', iscDropdownSelectionListDirective );

})();
