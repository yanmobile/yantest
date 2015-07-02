/**
 * Created by yale marc on 3/17/15.
 SAMPLE HTML USAGE
 <div style="display:inline-block;width:100%">
	<isc-dropdown list-data="listData" drop-width="'70%'" drop-placeholder="Sort" drop-maxwidth="180" drop-minwidth="75" list-field="value" drop-selected-item="sampleItem" drop-id="UserBtn" drop-icon="fa fa-user">
	</isc-dropdown>
</div>
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

			scope.dropOpen = false;
			scope.iconLeft = 0;
			scope.itemWidth = 0;
			scope.isShowDrop = false;
			scope.listField = 'label';

			angular.element(window).resize(function(){//jshint ignore:line
				scope.setWidth();
			});

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

			function domReady(){
				$timeout(function(){
					scope.setWidth();
					if(scope.dropSelectedItem){
						scope.dropTitle = scope.dropSelectedItem[scope.listField];
					}else{
						scope.dropTitle = scope.dropPlaceholder;
					}
				});
			}
			domReady();

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

			$rootScope.$on( DROPDOWN_EVENTS.dropdownItemSelected, function(e, selection){
        devlog.channel('iscDropdown').debug( 'iscDropdown.dropdownItemSelected', selection);
				//CHECK TO ASSURE THAT CORRECT ITEM
				if(scope.dropId === selection.dropId ){
					scope.dropTitle = selection.selectedItem[scope.listField] ;
					scope.dropSelectedItem = selection.selectedItem;

          //devlog.channel('iscDropdown').debug( '...scope.dropTitle', scope.dropTitle);
          //devlog.channel('iscDropdown').debug( '...scope.dropSelectedItem', scope.dropSelectedItem);
				}
			});


		}//END LINK


	}//END CLASS


	// ----------------------------
	// injection
	// ----------------------------

	angular.module( 'isc.common' )
			.directive( 'iscDropdown', iscDropdown );

})();
