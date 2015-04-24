/**
 * Created by yalemarc on 04/16/15.
 */

(function(){
	'use strict';

	iscDropdownHelper.$inject = [ '$log'];

	function iscDropdownHelper( $log ){
		var clickCt = 0;
		var watcherSet = false;

		var service = {
			setWatcher: setWatcher,
			clearWatcher: clearWatcher

		}
		return service

		function setWatcher(){
			console.log('SET WATCHER', watcherSet)
			if(!watcherSet){
				clickCt = 0
				angular.element(document).bind('click',function(event){
					//DO NOT TRIGGER CLOSE ON INITIAL OPEN
					console.log('CLICKs', clickCt)
					if(clickCt>1){
						closeAllOpen();
					}
					clickCt++;
					//IF USER CLICKS ON NON DROPDOWN ITEM CLOSE ALL DROPDOWNS
					if(!angular.element(event.originalEvent.target).hasClass('isc-dropdown-item')){
						closeAllOpen();
					}
				});
				watcherSet = true;
			}
		}
		function closeAllOpen(){
			// angular.element('.isc-dropdown-list').each(function(){
			// 	if($(this).css('visibility')!== 'hidden'){
			// 		$(this).css('visibility', 'hidden');
			// 	}
			// 	clearWatcher();
			// })
			console.log('CLOSE ALL OPEN DROPDOWNS', angular.element('.tempDropdownList'))
			// angular.element('.tempDropdownList').each(function(){
			// 	$(this).css('visibility', 'hidden');
			// }

			console.log('CLOSEDROPDOWNS', $('.tempDropdownList'))
			//angular.element(document.body).removeClass('.tempDropdownList');
			clearWatcher();
		}

		function clearWatcher(){
			angular.element(document).unbind('click');
			watcherSet = false;
		}


	}//END CLASS

	angular.module( 'isc.common' )
			.factory( 'iscDropdownHelper', iscDropdownHelper );

})();