(function(){

  'use strict';

  iscLibraryController.$inject = [ '$log', '$rootScope', '$scope', 'iscCustomConfigService', 'iscNavContainerModel', 'iscUiHelper', 'iscLibraryModel', 'iscSessionModel', 'iscLibrarySearchHealthDictionaryApi', 'NAV_EVENTS' ];

  function iscLibraryController( $log, $rootScope, $scope, iscCustomConfigService, iscNavContainerModel, iscUiHelper, iscLibraryModel, iscSessionModel, iscLibrarySearchHealthDictionaryApi, NAV_EVENTS ){
//    //$log.debug( 'iscLibraryController LOADED');

    var self = this;

    // ----------------------------
    // models / services
    self.model = iscLibraryModel;
    self.sessionModel = iscSessionModel;
    self.navModel = iscNavContainerModel;
    self.iscUiHelper = iscUiHelper;
    self.iscCustomConfigService = iscCustomConfigService;

    // ----------------------------
    // navigation
    //self.secondaryNav = _.toArray( self.iscCustomConfigService.getLibrarySecondaryNav() );

    // ----------------------------
    // form tab
    self.forms = self.model.getFormData();

    // ----------------------------
    // news tab
    self.newsItems = self.model.getNewsItems();

    // ----------------------------
    // health dictionary tab
    self.search = function(){
      iscLibrarySearchHealthDictionaryApi.search();
    };

    self.clearSearch = function(){
      iscLibraryModel.clearSearch();
    };

    // ----------------------------
    // secondary nav
    self.showSecondaryNav = function(){
      $rootScope.$broadcast( NAV_EVENTS.showSecondaryNav );
    };

    self.hideSecondaryNav = function(){
      $rootScope.$broadcast( NAV_EVENTS.hideSecondaryNav );
    };

    // ----------------------------
    // scroll stick
    self.scrollStick = false;

    self.setButtonClass = function( atTop ){
      //$log.debug( 'iscLibraryController.setButtonClass', atTop );

      var scroller = angular.element( document.querySelector( '#nav-fixed-scroll' ) );
      self.scrollStick = atTop;

      //$log.debug( '...scroller', scroller );

      if( atTop ){
        scroller.removeClass('isc-scroll-stick-container');
        scroller.addClass('isc-scroll-stick-container-fixed');
      }
      else{
        scroller.addClass('isc-scroll-stick-container');
        scroller.removeClass('isc-scroll-stick-container-fixed');
      }

      $scope.$apply();
    };


  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module('iscLibrary')
      .controller('iscLibraryController', iscLibraryController );

})();
