(function(){

  'use strict';

  iscMessagesController.$inject = [ '$log', '$rootScope', '$scope', 'iscStateManager', 'iscUiHelper', 'iscMessagesModel', 'iscNavContainerModel', 'iscMailMessageService',  'iscMessagesApi', 'MODAL_EVENTS' ];

  function iscMessagesController( $log, $rootScope, $scope, iscStateManager, iscUiHelper, iscMessagesModel, iscNavContainerModel, iscMailMessageService, iscMessagesApi, MODAL_EVENTS ){
    //$log.debug( 'iscMessagesController.LOADED', iscMessagesModel.sortOptions.isInbox);

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    self.model = iscMessagesModel;
    //self.api = iscMessagesApi;
    self.navModel = iscNavContainerModel;
    self.mailMessageService = iscMailMessageService;
    self.iscUiHelper = iscUiHelper;
    self.stateManager = iscStateManager;

    //self.mailItems = self.model.getCurrentMail();
    self.sortOptions = self.model.sortOptions.isInbox ? self.model.sortOptions.from : self.model.sortOptions.to;

    self.scrollStick = false;

    self.showEmergencyWarning = self.model.getShowEmergencyWarning();

    // ----------------------------
    // functions
    // ----------------------------


    // ----------------------------
    // functions
    // ----------------------------

    self.onInOutBoxClick = function(){
      self.stateManager.setParentSref( '' );
    };

    self.closeEmergencyWarning = function(){
      //$log.debug( 'iscMessagesController.closeEmergencyWarning' );
      self.showEmergencyWarning = self.model.closeEmergencyWarning();
    };

    self.archive = function(){
      if( self.model.sortOptions.isInbox ){
        self.archiveInboxMessages();
      }
      else{
        self.archiveInboxMessages();
      }
    };

    self.archiveInboxMessages = function(){
      $log.debug( 'iscMessagesController.archiveInboxMessages' );

      var current = self.model.getCurrentMail();
      var toArchive = _.remove( current, function( mail ){
          return mail.$$selected;
      });

      $log.debug( '....toArchive', toArchive );
      $log.debug( '......current', current );

      iscMessagesApi.archiveInboxMessages( toArchive ).then( function( result ){
        self.model.setCurrentMail( current );
      });
    };

    self.archiveOutboxMessages = function(){

      var current = self.model.getCurrentMail();
      var toArchive = _.remove( current, function( mail ){
        return mail.$$selected;
      });
      //$log.debug( '...toArchive', toArchive );

      iscMessagesApi.archiveOutboxMessages( toArchive ).then( function( result ){
        self.model.setCurrentMail( current );
      });

    };


    // ----------------------------
    // sort functions

    self.openSortOptions = function(){
      //$log.debug( 'iscMessagesController.openSortOptions' );

      var selectedList = self.model.sortOptions.isInbox ? self.model.sortOptions.from : self.model.sortOptions.to;

      var sortDataOptions = {
        popupTitle: 'ISC_SORT',
        popupListItems: selectedList,
        callback: self.onSort
      };

      $rootScope.$broadcast( MODAL_EVENTS.showOptionsPopup, sortDataOptions );
    };

    self.onSort = function( options ){
      //$log.debug( 'iscMessagesController.onSort', options );
      self.model.sortOptions.sortField = options.sortField;
      self.model.sortOptions.ascending = options.ascending;
    };


    self.getColumnIsSelected = function( field ){
      return self.model.getColumnIsSelected( field );
    };

    // ----------------------------
    // scroll stick functions

    self.setButtonClass = function( atTop ){
      //$log.debug( 'iscMessagesController.setButtonClass', atTop );
      var scroller = angular.element( document.querySelector( '#fixed-scroll' ) );
      self.scrollStick = atTop;
    };



  } // END CLASS

  // ----------------------------
  // inject
  // ----------------------------
  angular.module('iscMessages')
      .controller('iscMessagesController', iscMessagesController );

})();
