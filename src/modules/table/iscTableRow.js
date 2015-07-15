/**
 * Created by hzou on 07/13/15.
 */
(function(){
  'use strict';

  iscTableRow.$inject = [ '$log', 'devlog', '$state' ];

  function iscTableRow( $log, devlog, $state ){
    //$log.debug('iscTableRow.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope       : true, //prototypal inheritance
      restrict    : 'A',
      //needs to be -1 in order to have access to dataItem, which is populated by the dir-pagination directive
      priority    : -1,
      require     : "^iscTable",
      controllerAs: "iscRowCtrl",
      controller  : controller,
      link        : link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function controller( $scope ){

      // ----------------------------
      // vars
      // ----------------------------

      var self          = this;
      self.inEditMode   = false;
      self.editModeData = angular.copy( $scope.dataItem );

      self.editModeCommands = {};

      self.onCommand = onCommand;

      self.addRow = addRow;

      // ----------------------------
      // functions
      // ----------------------------

      function onCommand( commandName, event, callback ){
        switch( commandName ){
          case "edit":
            if( angular.isFunction( callback ) ){
              callback( event, $scope );
            } else {
              defaultEditCallback( event, $scope );
            }
            break;

          case "delete":
            if( angular.isFunction( callback ) ){
              callback( event, $scope );
            } else {
              defaultDeleteCallback( event, $scope );
            }
            break;

          case "save":
            if( angular.isFunction( callback ) ){
              callback( event, $scope );
            } else {
              defaultSaveCallback( event, $scope );
            }
            break;

          case "cancelSave":
            if( angular.isFunction( callback ) ){
              callback( event, $scope );
            } else {
              defaultCancelSaveCallback( event, $scope );
            }
            break;

          default:
            if( angular.isFunction( callback ) ){
              callback( event, $scope );
            } else {
              //do nothing
            }
        }
      }

      function defaultDeleteCallback( event ){
        devlog.log( "deleting", $scope.dataItem );
        self.iscTableCtrl.deleteRow( $scope.dataItem );

      }

      function defaultCancelSaveCallback( event ){
        self.editModeData = {};
        self.inEditMode   = false;
      }

      function defaultEditCallback( event ){
        self.editModeData = angular.copy( $scope.dataItem );
        self.inEditMode   = true;
      }

      function defaultSaveCallback( event ){
        if( $scope.dataItem.isNew ){
          _.set(self, "editModeData.isNew", false);
          self.iscTableCtrl.addRow( self.editModeData );
        } else {
          angular.extend($scope.dataItem, self.editModeData);
        }
        self.editModeData = {};
        self.inEditMode   = false;
      }


      function addRow( event ){
        $scope.dataItem = {
          isNew: true
        };
        onCommand( "edit" );
      }
    }
  }


  function link( scope, elem, attr, iscTableCtrl ){
    scope.iscRowCtrl.iscTableCtrl = iscTableCtrl;
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
    .directive( 'iscTableRow', iscTableRow );

})();
