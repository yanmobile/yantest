/**
 * Created by Trevor Hudson on 06/02/15.
 *
 * --------------------------------------
 * sample config
 * --------------------------------------
 *
 var labOrdersConfig = {
    key: 'LabOrders', // if the data is part of a larger set, this is the key, if not, leave blank
    title: '',
    rowsOnPage: 20,
    backButtonText: 'Go Back'
    editable: true,
    addBtnTranslationKey: "TRANSLATION_KEY",

    columns: [{
      key: 'OrderedItemDisplay',
      title: 'ISC_WELLNESS_LAB_NAME',
      type: 'buttonWithSref',
      sref: 'route.index',
      className: 'class-name'
    },
    {
      key: 'TextField',
      title: 'ISC_KEY',
      textGetter: getTextClass, // see below
      type: 'text'
    },
    {
      key: 'Timestamp',
      title: 'ISC_WELLNESS_LAB_DATE',
      classGetter: getButtonClass, // see below
      type: 'date'
    },
    {
      key: 'ButtonField',
      title: 'ISC_TRANSLATION_KEY',
      type: 'buttonWithCallback',
      callback: function(){}
    },
    { //drop down
      key           : 'anticipatedProblem',
      title         : 'CMC_ANTICPATED_PROBLEM',
      type          : 'dropdown',
      dropdownConfig: {
        listData    : model.getLookup( "symptoms" ),
        dropMinwidth: '150px'
      }
    },
    { // for individual application to create non-core specific columns
      type         : 'template',
      key          : 'main',
      title        : 'CMC_CCP_CT_CONTACT_MAIN',
      editCellClass: "cmc-team-cell-edit",
      template     : 'carePlan/careTeam/contact-main.html'
    },
    {
      type    : 'commands',
      sortable: false,
      key     : '',
      title   : '',
      commands: getOptimisticCommands()
    }],
    api: {  // if custom command (see: getOptimisticCommands()) override isn't specified,
            // api actions will be used to communicate with services
      create: saveCarePlan,
      update: saveCarePlan,
      remove: saveCarePlan
    }
  };


 * --------------------------------------
 * sample api functions -
 * use to as service api calls
 * --------------------------------------
 *
 * function saveCarePlan(){
      var plan       = model.data.carePlan;
      plan.lastSaved = moment().toDate();
      return cmcCarePlanApi.put( plan.id, plan );
   }

 * --------------------------------------
 * sample commands function -
 * use to override default command behaviors
 * --------------------------------------
 *
 * this is needed because of the current way we are saving data.
 * we are saving entire careplan object instead of the updated field(s)
 * which means, data needs to be in care plan object prior to saving.
 * This approach is the optimistic approach. By default, we are taking the
 * pessimistic approach where we only update the UI/model when data has been committed sucessfully
 *
 * function getOptimisticCommands(){
      return {
        save  : { callback: optimisticSave },
        remove: { callback: optimisticRemove }
      };

      function optimisticRemove( event, iscRowCtrl ){
        devlog.log( "deleting", iscRowCtrl.dataItem );
        var iscTblCtrl = iscRowCtrl.iscTblCtrl;
        var apicall;

        iscRowCtrl.iscTblCtrl.deleteRow( iscRowCtrl.dataItem );
        apicall        = _.get( iscTblCtrl, "tableConfig.api.remove", angular.noop );
        apicall( iscRowCtrl.dataItem );
      }

      function optimisticSave( event, iscRowCtrl ){
        var iscTblCtrl = iscRowCtrl.iscTblCtrl;
        var apicall;

        if( iscRowCtrl.dataItem.isNew ){
          _.set( iscRowCtrl, "editModeData.isNew", false );
          iscRowCtrl.iscTblCtrl.addRow( iscRowCtrl.editModeData );

          apicall = _.get( iscTblCtrl, "tableConfig.api.create", angular.noop );
          apicall( iscRowCtrl.editModeData );
        } else {
          iscRowCtrl.iscTblCtrl.updateRow( iscRowCtrl.editModeData, iscRowCtrl.dataItem );

          apicall = _.get( iscTblCtrl, "tableConfig.api.update", angular.noop );
          apicall( iscRowCtrl.editModeData, iscRowCtrl.dataItem );
        }

        iscRowCtrl.editModeData = {};
        iscRowCtrl.inEditMode   = false;
      }
    }


 * --------------------------------------
 * sample getter for classes -
 * use when different <td>'s in the same column need different classes
 * --------------------------------------
 *
 * function getButtonClass( type ){
      switch( type ){
        case 'APPROVAL':
          return 'cmc-approval-pill';

        case 'REVIEW':
          return 'cmc-review-pill';

        case 'DRAFT':
        default:
          return 'cmc-draft-pill';
      }
    }

 * --------------------------------------
 * sample getter for text -
 * use when combining multiple fields, eg
 * --------------------------------------
 * function getTextClass( cellData ){
      return dataItem[ 'someKey' ] + ', ' + dataItem[ 'someOtherKey' ] ;
    }
 *
 * --------------------------------------
 * sample html
 * --------------------------------------
 *
 * <isc-table table-config="someCtrl.model.getTableConfig()"
              table-data="someCtrl.model.getTableData()">
   </isc-table>
 *
 *
 */
(function(){
  'use strict';

  iscTable.$inject = [ '$log' ];

  function iscTable( $log ){
    //$log.debug('iscTable.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope: {
        tableConfig       : '=',
        tableData         : '=',
        rowButtonCallback : '&?',
        backButtonCallback: '&?'
      },

      restrict    : 'E',
      replace     : true,
      templateUrl : 'table/iscTable.html',
      bindToController: true,
      controller  : controller,
      controllerAs: "iscTblCtrl"
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function controller( ){//jshint ignore:line
      //$log.debug( 'iscTable.link, tableConfig', scope.tableConfig );
      //$log.debug( '...tableData', scope.tableData );

      var self       = this;

      self.addRow    = addRow;
      self.updateRow = updateRow;

      self.deleteRow = deleteRow;
      self.createRow = createRow;
      self.editRow = editRow;
      self.cancelEdit = cancelEdit;

      self.rowsOnPage  = self.tableConfig.rowsOnPage || 15;
      self.currentPage = 1;

      // set an array of the table row objects
      self.tableRows = self.tableConfig.key ? self.tableData[ self.tableConfig.key ] : self.tableData;

      self.sortField = { reverse: false };

      self.sortColumn = function( column ){
        if(column.sortable !== false && self.sortField.name === column.key ){
          self.sortField.reverse = !self.sortField.reverse;
        }

        self.sortField.name = column.key;
      };

      self.changePage = function( newPageNumber ){
        self.currentPage = newPageNumber;
      };

      // ----------------------------
      // functions
      // ----------------------------

      function deleteRow( row ){
        _.remove( self.tableRows, row );
      }

      function addRow( row ){
        self.tableRows.push( row );
        self.dataItem = null;
      }

      function updateRow( row, oldRow ){
        angular.extend( oldRow, row );
        self.dataItem = null;
      }

      function createRow(){
        var dataItem = { isNew: true };
        self.tableConfig.columns.forEach( function( column ){
          if( column.defaultValue != null ){
            dataItem[ column.key ] = column.defaultValue;
          }
        } );
        self.dataItem = dataItem;
      }

      function editRow( row ){
        self.dataItem = row;
      }

      function cancelEdit(){
        self.dataItem = null;
      }
    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscTable', iscTable );

})();
