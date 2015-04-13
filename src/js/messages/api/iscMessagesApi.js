/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscMessagesApi.$inject = [ '$log' ,'$http', '$q', 'iscCustomConfigService', 'iscMessagesModel' ];

  function iscMessagesApi( $log, $http, $q, iscCustomConfigService, iscMessagesModel ){
    //$log.debug( 'iscMessagesApi LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var api = {
      inbox: mockInbox,
      outbox: mockOutbox,
      archivedInbox: mockArchivedInbox,
      archivedOutbox: mockArchivedOutbox,

      sendReply: mockSendReply,

      archiveInboxMessages: mockArchiveInboxMessages,
      archiveOutboxMessages: mockArchiveOutboxMessages,

      get: mockGet,
      unreadMessageCounts: mockUnreadMessageCounts
    };

    return api;

    // ----------------------------
    // functions
    // ----------------------------

    function inbox(){
      //$log.debug( 'iscMessagesApi.inbox');
      return getMail( 'messages/folder/inbox', 'index.messages.inbox' );
    }

    function outbox(){
      //$log.debug( 'iscMessagesApi.outbox');
      return getMail( 'messages/folder/outbox', 'index.messages.outbox' );
    }

    function archivedInbox(){
      //$log.debug( 'iscMessagesApi.archivedInbox');
      return getMail( 'messages/folder/archivedinbox', 'index.messages.archivedInbox' );
    }

    function archivedOutbox(){
      //$log.debug( 'iscMessagesApi.archivedOutbox');
      return getMail( 'messages/folder/archivedoutbox', 'index.messages.archivedOutbox' );
    }

    /**
     * private
     * @param url
     * @param parentSref
     * @returns {mailItems}
     */
    function getMail( url, parentSref ){
      var deferred = $q.defer();

      var request = {
        method: 'GET',
        url: iscCustomConfigService.getBaseUrl() + url,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials:true
      };

      $http( request )
        .success( function( data, status, headers, config ){
          //$log.debug( '...success', data.children );
          var allMail = data.children;
          allMail.forEach( function( mail ){
            mail.$$parentSref = parentSref;
          });

          deferred.resolve( allMail );
        })
        .error( function( data, status, headers, config ){
          //$log.debug( '...err', data );
          deferred.reject( data );
        });

      return deferred.promise;
    }

    // ------------------------------
    // MOCKS
    // ------------------------------

    function mockInbox(){
      //$log.debug( 'iscMessagesApi.mockInbox');
      return  mockGetAll( 'inbox' );
    }

    function mockOutbox(){
      //$log.debug( 'iscMessagesApi.mockOutbox');
      return mockGetAll( 'outbox' );
    }

    function mockArchivedInbox(){
      //$log.debug( 'iscMessagesApi.mockArchivedInbox');
      return  mockGetAll( 'archivedInbox' );
    }

    function mockArchivedOutbox(){
      //$log.debug( 'iscMessagesApi.mockArchivedOutbox');
      return mockGetAll( 'archivedOutbox' );
    }

    function mockGetAll( type ){
      //$log.debug( 'iscMessagesApi.mockGetAll');
      var deferred = $q.defer();

      var request = {
        method: 'GET',
        url: 'assets/mockData/messages/messages.json'
      };

      $http( request )
        .success( function( data, status, headers, config ){
          //$log.debug( '...success', data[ type ] );
          var allMail = data[ type ];

          deferred.resolve( allMail );
        })
        .error( function( data, status, headers, config ){
          $log.debug( '...err', data );
          deferred.reject( data );
        });

      return deferred.promise;
    }

    function mockGet( mailId ){
      //$log.debug( 'iscMessagesApi.getMock', mailId);
      var deferred = $q.defer();
      var selected;

      var messageBody = '<div><p>Dear Adam Everyman</p><p>Your request to refill your Adenoid-Away has been successfully processed. You will be able to pick it up at CVS in Meltown this afternoon after 3pm.</p><p>Regards, Dr. Umbrella</p></div>';

      iscMessagesModel.getCurrentMail().forEach( function( mail ){
        if( mail.id == mailId ){
          selected = mail;
          selected.messageBody = messageBody;
        }
      });

      if( !!selected ){
        //$log.debug( '...success' );
        deferred.resolve( selected );
      }
      else{
        //$log.debug( '...err' );
        deferred.reject( 'BLAM' );
      }

      return deferred.promise;
    }

    function mockSendReply( reply ){
      var deferred = $q.defer();
      deferred.resolve( reply );
      return deferred.promise;
    }

    function mockUnreadMessageCounts(){
      $log.debug( 'iscMessagesApi.mockUnreadMessageCounts');

      var deferred = $q.defer();

      var counts = {
        inbox: 0,
        outbox: 0,
        archivedInbox: 0,
        archivedOutbox: 0
      };

      var request = {
        method: 'GET',
        url: 'assets/mockData/messages/messages.json'
      };

      $http( request )
        .success( function( data, status, headers, config ){
          var mail = data[ 'inbox' ];
          counts.inbox = data['inbox'].length;
          counts.outbox = data['outbox'].length;
          counts.archivedInbox = data['archivedInbox'].length;
          counts.archivedOutbox = data['archivedOutbox'].length;

          deferred.resolve( counts );
        });

      return deferred.promise;
    }

    function mockArchiveInboxMessages( messages ){
      var deferred = $q.defer();
      deferred.resolve( messages );
      return deferred.promise;
    }

    function mockArchiveOutboxMessages( messages ){
      var deferred = $q.defer();
      deferred.resolve( messages );
      return deferred.promise;
    }

  }// END CLASS


  angular.module( 'iscMessages' )
      .factory( 'iscMessagesApi', iscMessagesApi );

})();
