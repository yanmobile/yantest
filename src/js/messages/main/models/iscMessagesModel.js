/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscMessagesModel.$inject = [ '$log'];

  function iscMessagesModel( $log ){
//    //$log.debug( 'iscMessagesModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var currentMailItems;

    var sortOptionsFrom = [
      {label: 'ISC_DATE', sortField:'Time', ascending: true, secondaryLabel: 'ISC_SORT_DATE_ASCENDING'},
      {label: 'ISC_DATE', sortField:'Time', ascending: false, secondaryLabel: 'ISC_SORT_DATE_DESCENDING'},
      {label: 'ISC_FROM', sortField:'From', ascending: false, secondaryLabel: 'ISC_SORT_DESCENDING'},
      {label: 'ISC_FROM', sortField:'From', ascending: true, secondaryLabel: 'ISC_SORT_ASCENDING'},
      {label: 'ISC_SUBJECT', sortField:'Subject', ascending: false, secondaryLabel: 'ISC_SORT_DESCENDING'},
      {label: 'ISC_SUBJECT', sortField:'Subject', ascending: true, secondaryLabel: 'ISC_SORT_ASCENDING'}
    ];

    var sortOptionsTo = [
      {label: 'ISC_DATE', sortField:'Time', ascending: true, secondaryLabel: 'ISC_SORT_DATE_ASCENDING'},
      {label: 'ISC_DATE', sortField:'Time', ascending: false, secondaryLabel: 'ISC_SORT_DATE_DESCENDING'},
      {label: 'ISC_TO', sortField:'To', ascending: false, secondaryLabel: 'ISC_SORT_DESCENDING'},
      {label: 'ISC_TO', sortField:'To', ascending: true, secondaryLabel: 'ISC_SORT_ASCENDING'},
      {label: 'ISC_SUBJECT', sortField:'Subject', ascending: false, secondaryLabel: 'ISC_SORT_DESCENDING'},
      {label: 'ISC_SUBJECT', sortField:'Subject', ascending: true, secondaryLabel: 'ISC_SORT_ASCENDING'}
    ];

    var sortOptions = {
      from: sortOptionsFrom,
      to: sortOptionsTo,
      current: null,
      isInbox: false,
      sortField: '',
      ascending: true
    };

    var showEmergencyWarning = true;
    var unreadMessageCounts = {};



    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      sortOptions: sortOptions,

      isCurrentSortOption: isCurrentSortOption,
      setCurrentSortOption: setCurrentSortOption,

      getColumnIsSelected: getColumnIsSelected,

      getCurrentMail: getCurrentMail,
      setCurrentMail: setCurrentMail,

      getShowEmergencyWarning: getShowEmergencyWarning,
      setShowEmergencyWarning: setShowEmergencyWarning,
      closeEmergencyWarning: closeEmergencyWarning,

      getUnreadMessageCounts: getUnreadMessageCounts,
      setUnreadMessageCounts: setUnreadMessageCounts,
      getUnreadMessageCount: getUnreadMessageCount
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    // ----------------
    // sort
    function isCurrentSortOption( sortOption ){
      return sortOptions.current === sortOption;
    }

    function setCurrentSortOption( sortOption ){
      //$log.debug( 'iscMessagesModel.setCurrentSortOption', sortOption );
      sortOptions.current = sortOption;
      sortOptions.sortField = sortOption.sortField;
      sortOptions.ascending = sortOption.ascending;
    }

    function getColumnIsSelected( sortField ){
      return sortOptions.sortField === sortField;
    }

    // ----------------
    // current mail
    function getCurrentMail(){
      return currentMailItems;
    }

    function setCurrentMail( val ){
      //$log.debug( 'iscMessagesModel.setCurrentMail', JSON.stringify(val) );
      currentMailItems = val;
    }

    // ----------------
    // warning
    function getShowEmergencyWarning(){
      //$log.debug( 'iscMessagesModel.getShowEmergencyWarning', showEmergencyWarning );
      return showEmergencyWarning;
    }

    function setShowEmergencyWarning( val ){
      //$log.debug( 'iscMessagesModel.setShowEmergencyWarning', val );
      showEmergencyWarning = val;
    }

    function closeEmergencyWarning(){
      showEmergencyWarning = false;
      return showEmergencyWarning;
    }

    // ----------------
    // unread messages
    function getUnreadMessageCounts(){
      return unreadMessageCounts;
    }

    function setUnreadMessageCounts( val ){
      //$log.debug( 'iscMessagesModel.setUnreadMessageCounts', val );
      unreadMessageCounts = val;
    }

    function getUnreadMessageCount( box ){
      switch( box ){

        case 'index.messages.inbox':
          return unreadMessageCounts.inbox;

        case 'index.messages.outbox':
          return unreadMessageCounts.outbox;

        case 'index.messages.archivedInbox':
          return unreadMessageCounts.archivedInbox;

        case 'index.messages.archivedOutbox':
          return unreadMessageCounts.archivedOutbox;

        default :
          return 0;
      }
    }


  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscMessages' )
      .factory( 'iscMessagesModel', iscMessagesModel );

})();
