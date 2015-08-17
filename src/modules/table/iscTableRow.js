/**
 * Created by hzou on 07/13/15.
 */

/**
 * When using rowTemplate, DO NOT put html comments in it.
 * this will cause duplicate renderers when used together with ng-repeat
 */

/**
 * if custom rowTemplate is defined in tabeConfig, it will use rowTemplate instead of default template
 *** if rowType === 'data'
 *
 * if custom addTemplate is defined in tabeConfig, it will use rowTemplate instead of default template
 *** if rowType === 'add'
 */
(function(){
  'use strict';

  iscTableRow.$inject = [ '$log', 'devlog', '$state', '$templateCache', '$compile' ];

  function iscTableRow( $log, devlog, $state, $templateCache, $compile ){
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
      controllerAs: 'iscRowCtrl',
      controller  : controller,
      compile     : compile,
      templateUrl : 'table/iscTableRow.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function controller( $scope ){

      // ----------------------------
      // vars
      // ----------------------------

      var self        = this;
      self.inEditMode = false;
      self.editModeData = angular.copy( self.dataItem );

      self.editModeCommands = {};

      self.onCommand = onCommand;

      // ----------------------------
      // functions
      // ----------------------------

      function onCommand( commandName, event, callback ){
        switch( commandName ){
          case 'edit':
            if( angular.isFunction( callback ) ){
              callback( event, self );
            } else {
              defaultEditCallback( event, self );
            }
            break;

          case 'remove':
            if( angular.isFunction( callback ) ){
              callback( event, self );
            } else {
              defaultRemoveCallback( event, self );
            }
            break;

          case 'save':
            if( angular.isFunction( callback ) ){
              callback( event, self );
            } else {
              defaultSaveCallback( event, self );
            }
            break;

          case 'cancelEdit':
            if( angular.isFunction( callback ) ){
              callback( event, self );
            } else {
              defaultCancelEditCallback( event, self );
            }
            break;

          default:
            if( angular.isFunction( callback ) ){
              callback( event, self );
            } else {
              //do nothing
            }
        }
      }


      // This approach is the pessimistic approach, UI/model is only updated/refreshed
      // when api calls are successful. The changes are wrapped in the 'then' blocks.
      function defaultRemoveCallback( event ){
        var apicall = _.get( self, 'iscTblCtrl.tableConfig.api.remove', angular.noop );
        apicall( self.dataItem ).then( function(){
          self.iscTblCtrl.deleteRow( self.dataItem );
        } );
      }

      function defaultCancelEditCallback( event ){
        self.editModeData = {};
        self.inEditMode   = false;
        self.iscTblCtrl.cancelEdit();
      }

      function defaultEditCallback( event ){
        if(self.iscTblCtrl.dataItem == null){
          self.editModeData = angular.copy( self.dataItem );
          self.inEditMode   = true;
          self.iscTblCtrl.editRow( self.dataItem );
        }
      }

      function defaultSaveCallback( event ){
        var apicall;

        if( angular.equals( self.editModeData, self.dataItem ) ){
          self.editModeData = {};
          self.inEditMode   = false;
          self.iscTblCtrl.cancelEdit();
        }
        else if( self.dataItem.isNew ){
          _.set( self, 'editModeData.isNew', false );

          apicall = _.get( self, 'iscTblCtrl.tableConfig.api.create', angular.noop );
          apicall( self.editModeData ).then( function(){
            self.iscTblCtrl.addRow( self.editModeData );

            self.editModeData = {};
            self.inEditMode   = false;
          } )

        }
        else {
          apicall = _.get( self, 'iscTblCtrl.tableConfig.api.update', angular.noop );
          apicall( self.editModeData, self.dataItem ).then( function(){
            self.iscTblCtrl.updateRow( self.editModeData, self.dataItem );

            self.editModeData = {};
            self.inEditMode   = false;
          } )
        }
      }
    }

    function compile(){

      return {
        pre : pre,
        post: post
      };

      function pre( scope, trElem, attrs, iscRowCtrl ){
        var rowTemplate = _.get( scope, 'iscTblCtrl.tableConfig.rowTemplate' );

        //in the case of creating a new item, fetch dataItem from iscTblCtrl
        if( scope.dataItem == null && _.get( scope, "iscTblCtrl.dataItem.isNew" ) ){
          iscRowCtrl.dataItem = scope.dataItem = _.get( scope, "iscTblCtrl.dataItem" );
          iscRowCtrl.editModeData = angular.copy(scope.dataItem);
          iscRowCtrl.inEditMode = true;
        }

        if( rowTemplate ){
          //for some reason the template doesn't like spaces nor comments
          var template = removeTemplateSpaces( $templateCache.get( rowTemplate ) );

          trElem.html( template );
          $compile( trElem.contents() )( scope );
        }
      }

      function post( scope, elem, attr , iscRowCtrl){
        iscRowCtrl.iscTblCtrl = scope.iscTblCtrl;
        scope.$watch( 'dataItem', function( value ){
          iscRowCtrl.dataItem = value;
        } )
      }

      function removeTemplateSpaces( templateStr ){
        return templateStr
          .replace( /\r?\n|\r/g, ' ' )  //replace newline with space
          .replace( /\>[ \t]+\</g, '\>\<' ) // remove space between elements/tags
          .replace( /\s{2,}/g, ' ' ); //replace 2+ spaces with 1 space
      }
    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
    .directive( 'iscTableRow', iscTableRow );

})();
