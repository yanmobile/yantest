/**
 * Created by yale marc on 3/17/15.
 SAMPLE HTML USAGE
 <div style="display:inline-block;width:100%">
	<isc-dropdown list-data="listData" drop-width="'70%'" drop-maxwidth="180" drop-minwidth="75" list-field="value" drop-Title="'SELECT USER'" drop-id="UserBtn" drop-icon="fa fa-user">
	</isc-dropdown>
</div>
 */

(function(){
	'use strict';

	iscDropdown.$inject = [ '$log', '$parse', '$timeout', '$rootScope', 'DROPDOWN_EVENTS' ];

	function iscDropdown( $log, $parse , $timeout, $rootScope, DROPDOWN_EVENTS){

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
				dropTitle: '=',
				dropId: '@',
				dropIcon: '@',
				dropMinwidth: '=',
				dropMaxwidth: '=',
				dropWidth: '='
			},
			templateUrl: 'common/dropdown/iscDropdown.html'
		};

		return directive;

		// ----------------------------
		// functions
		// ----------------------------

		function link( scope, elem, attr ){
			//$log.debug( 'iscDropdown' );
			scope.dropOpen = false;
			scope.iconLeft = 0;
			scope.itemWidth = 0;
			scope.isShowDrop = false;
			scope.listField = 'label';

			angular.element(window).resize(function(){
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
				}else{
					if(angular.element('form').width()-50 < angular.element('#'+scope.dropId).width()){
						angular.element('#'+scope.dropId).width(angular.element('form').width()-20)
					}else{
						//SET WIDTH OF TITLE BLOCK BASED ON LARGER OF TITLE OR DROPDOWN CONTENT
						//console.log('set larger');
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
				})
			}
			domReady();

			scope.showHideItems = function(){
				$rootScope.$broadcast( DROPDOWN_EVENTS.showDropdownList ,scope.listData, scope.dropId, scope.listField)
			};

			$rootScope.$on( DROPDOWN_EVENTS.dropdownItemSelected, function(e,selectArray){
				//CHECK TO ASSURE THAT CORRECT ITEM
				if(scope.dropId === selectArray[1]){
					scope.dropTitle = selectArray[0];
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
