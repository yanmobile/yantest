(function(){
  'use strict';

  angular.module('iscMessages', [])
    .config( ['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ){

      // ----------------------------
      // state management
      // ----------------------------
      $urlRouterProvider.when( '/messages', '/messages/inbox');

      $stateProvider
        .state('index.messages', {
          url: 'messages',
          templateUrl: 'messages/iscMessages.html',
          controller: 'iscMessagesController as mssgCtrl',

          resolve: {
            loadConfig: function( $log, iscCustomConfigService ){
              //$log.debug( 'iscMessages.loadConfig');
              return iscCustomConfigService.loadConfig();
            },

            unreadMessages: function( $log, iscMessagesModel, iscMessagesApi, loadConfig ){
              //$log.debug( 'iscMessages.unreadMessages');
              return iscMessagesApi.unreadMessageCounts().then( function( data ){
                iscMessagesModel.setUnreadMessageCounts( data );
                return data;
              });
            },

            showWarning: function( $log, iscMessagesModel, loadConfig ){
              //$log.debug( 'iscMessages.showWarning');
              return iscMessagesModel.setShowEmergencyWarning( true );
            },

            loadSecondaryNav: function( $log, iscCustomConfigService, iscNavContainerModel, showWarning ){
              //$log.debug( 'iscMessages.loadSecondaryNav');

              var secondary = _.toArray( iscCustomConfigService.getMessagesSecondaryNav() );
              iscNavContainerModel.setSecondaryNav( secondary );

              var tasks = _.toArray( iscCustomConfigService.getMessagesSecondaryNavTasks() );
              return iscNavContainerModel.setSecondaryNavTasks( tasks );
            }
          }
        })

        .state('index.messages.inbox', {
          url: '/inbox',
          templateUrl: 'messages/iscMessagesInbox.html',
          controller: 'iscMessagesController as mssgCtrl',

          resolve: {
            messageData: function( $log, iscMessagesApi, loadSecondaryNav ){
              //$log.debug( 'iscMessages.messageData');
              return iscMessagesApi.inbox();
            },

            updateModel: function( $log, messageData, iscMessagesModel, iscMailMessageService ){
              //$log.debug( 'iscMessages.updateModel', messageData );
              if( !messageData )return false;

              iscMessagesModel.setCurrentMail( messageData );
              iscMailMessageService.setSelectedParams();
              iscMessagesModel.sortOptions.isInbox = true;
              return true
            }
          }
        })

        .state('index.messages.outbox', {
          url: '/outbox',
          templateUrl: 'messages/iscMessagesOutbox.html',
          controller: 'iscMessagesController as mssgCtrl',

          resolve: {
            messageData: function( $log, loadSecondaryNav, iscMessagesApi ){
              //$log.debug( 'iscMessages.inbox.outboxMessages');
              return iscMessagesApi.outbox().then( function( data ){
                return data;
              });
            },

            updateModel: function( $log, messageData, iscMessagesModel, iscMailMessageService ){
              //$log.debug( 'iscMessages.updateModel', messageData );
              iscMessagesModel.setCurrentMail( messageData );
              iscMailMessageService.setSelectedParams();
              iscMessagesModel.sortOptions.isInbox = false;
              return true
            }
          }
        })

        .state('index.messages.archivedInbox', {
          url: '/archivedInbox',
          templateUrl: 'messages/iscMessagesArchivedInbox.html',
          controller: 'iscMessagesController as mssgCtrl',

          resolve: {
            messageData: function( $log, loadSecondaryNav, iscMessagesApi ){
              //$log.debug( 'iscMessages.inbox.inboxMessages');
              return iscMessagesApi.archivedInbox().then( function( data ){
                return data;
              });
            },

            updateModel: function( $log, messageData, iscMessagesModel, iscMailMessageService ){
              //$log.debug( 'iscMessages.updateModel', messageData );
              iscMessagesModel.setCurrentMail( messageData );
              iscMailMessageService.setSelectedParams();
              iscMessagesModel.sortOptions.isInbox = true;
              return true
            }
          }
        })

        .state('index.messages.archivedOutbox', {
          url: '/archivedOutbox',
          templateUrl: 'messages/iscMessagesArchivedOutbox.html',
          controller: 'iscMessagesController as mssgCtrl',

          resolve: {
            messageData: function( $log, loadSecondaryNav, iscMessagesApi ){
              //$log.debug( 'iscMessages.inbox.archivedOutbox');
              return iscMessagesApi.archivedOutbox().then( function( data ){
                return data;
              });
            },

            updateModel: function( $log, messageData, iscMessagesModel, iscMailMessageService ){
              //$log.debug( 'iscMessages.updateModel', messageData );
              iscMessagesModel.setCurrentMail( messageData );
              iscMailMessageService.setSelectedParams();
              iscMessagesModel.sortOptions.isInbox = false;
              return true
            }
          }
        })

        .state('index.messages.message', {
          url: '/message/:id',
          templateUrl: 'messages/messageView/iscMessageView.html',
          controller: 'iscMessageViewController as mvCtrl',

          resolve: {
            messageData: function( $log, $stateParams, iscMessagesApi ){
              //$log.debug( 'index.messages.message.messageData');
              return iscMessagesApi.get( $stateParams.id ).then( function( data ){
                return data;
              });
            },

            updateModel: function( $log, messageData, iscMessageViewModel, iscMailMessageService ){
              //$log.debug( 'iscMessages.updateModel', messageData );
              iscMessageViewModel.setSelectedMail( messageData );
              return true
            }
          }
        })

        .state('index.messages.medicalQuestion', {
          url: '/medicalQuestion',
          templateUrl: 'messages/workflows/iscAskMedicalQuestion.html',
          controller: 'iscMessagesController as mssgCtrl'
        })

        .state('index.messages.generalQuestion', {
          url: '/generalQuestion',
          templateUrl: 'messages/workflows/iscAskMedicalQuestion.html',
          controller: 'iscMessagesController as mssgCtrl'
        })

        .state('index.messages.requestAppointment', {
          url: '/requestAppointment',
          templateUrl: 'messages/workflows/iscRequestAppointment.html',
          controller: 'iscRequestAppointmentController as raCtrl'
        })

        .state('index.messages.refillPrescription', {
          url: '/refillPrescription',
          templateUrl: 'messages/workflows/iscAskMedicalQuestion.html',
          controller: 'iscMessagesController as mssgCtrl'
        })

        .state('index.messages.requestReferral', {
          url: '/requestReferral',
          templateUrl: 'messages/workflows/iscAskMedicalQuestion.html',
          controller: 'iscMessagesController as mssgCtrl'
        })

        .state('index.messages.requestTestResult', {
          url: '/requestTestResult',
          templateUrl: 'messages/workflows/iscAskMedicalQuestion.html',
          controller: 'iscMessagesController as mssgCtrl'
        });

    }]);
})();

