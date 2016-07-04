(function() {
  'use strict';
  //console.log( 'iscTable Tests' );

  describe( 'iscTableRowController', function() {
    var suite;

    useDefaultModules( 'isc.templates', 'isc.table' );

    beforeEach( inject( function( $rootScope, $compile, $controller, $q ) {
      suite = window.createSuite( {
        $rootScope: $rootScope,
        $compile  : $compile,
        $q        : $q
      } );
      var tableData = getTableData();
      $rootScope.dataItem = tableData[0];

      suite.$ctrl = $controller( 'iscTableRowController', {
        $scope: $rootScope
      } );
      _.set( suite.$ctrl, "iscTblCtrl.tableConfig", getTableConfig( $q ) );
      _.set( suite.$ctrl, "iscTblCtrl.tableData", tableData );
      suite.$ctrl.iscTblCtrl.createRow  = _.noop;
      suite.$ctrl.iscTblCtrl.editRow    = _.noop;
      suite.$ctrl.iscTblCtrl.deleteRow  = _.noop;
      suite.$ctrl.iscTblCtrl.cancelEdit = _.noop;
      suite.$ctrl.iscTblCtrl.addRow     = _.noop;
      suite.$ctrl.iscTblCtrl.updateRow  = _.noop;

      suite.commandsColumn = suite.$ctrl.iscTblCtrl.tableConfig.columns[2].commands;
    } ) );

    describe( 'onCommand - create', function() {
      it( 'should have called default config callback', function() {
        spyOn( suite.$ctrl.iscTblCtrl, 'createRow' );
        suite.commandsColumn.create.callback = null;
        suite.$ctrl.onCommand( 'create' );
        expect( suite.$ctrl.iscTblCtrl.createRow ).toHaveBeenCalled();
      } );

      it( 'should have called config callback', function() {
        spyOn( suite.commandsColumn.create, 'callback' );
        suite.$ctrl.onCommand( 'create' );
        expect( suite.commandsColumn.create.callback ).toHaveBeenCalled();
      } );
    } );

    describe( 'onCommand - edit', function() {
      it( 'should have called default config callback', function() {
        spyOn( suite.$ctrl.iscTblCtrl, 'editRow' );
        suite.commandsColumn.edit.callback = null;
        suite.$ctrl.onCommand( 'edit' );
        expect( suite.$ctrl.iscTblCtrl.editRow ).toHaveBeenCalled();
      } );

      it( 'should have called config callback', function() {
        spyOn( suite.commandsColumn.edit, 'callback' );
        suite.$ctrl.onCommand( 'edit' );
        expect( suite.commandsColumn.edit.callback ).toHaveBeenCalled();
      } );
    } );

    describe( 'onCommand - remove', function() {
      it( 'should have called default config callback', function() {
        spyOn( suite.$ctrl.iscTblCtrl, 'deleteRow' );
        suite.commandsColumn.remove.callback = null;
        suite.$ctrl.onCommand( 'remove' );
        suite.$rootScope.$digest();
        expect( suite.$ctrl.iscTblCtrl.deleteRow ).toHaveBeenCalled();
      } );

      it( 'should have called config callback', function() {
        spyOn( suite.commandsColumn.remove, 'callback' );
        suite.$ctrl.onCommand( 'remove' );
        expect( suite.commandsColumn.remove.callback ).toHaveBeenCalled();
      } );
    } );

    describe( 'onCommand - cancelEdit', function() {
      it( 'should have called default config callback', function() {
        spyOn( suite.$ctrl.iscTblCtrl, 'cancelEdit' );
        suite.commandsColumn.cancelEdit.callback = null;
        suite.$ctrl.onCommand( 'cancelEdit' );
        suite.$rootScope.$digest();
        expect( suite.$ctrl.iscTblCtrl.cancelEdit ).toHaveBeenCalled();
      } );

      it( 'should have called config callback', function() {
        spyOn( suite.commandsColumn.remove, 'callback' );
        suite.$ctrl.onCommand( 'remove' );
        expect( suite.commandsColumn.remove.callback ).toHaveBeenCalled();
      } );
    } );

    describe( 'onCommand - save ', function() {
      it( 'should have called default config callback - updateRow', function() {
        suite.$ctrl.dataItem = {}; //existing item
        spyOn( suite.$ctrl.iscTblCtrl, 'updateRow' );
        suite.commandsColumn.save.callback = null;
        suite.$ctrl.onCommand( 'save' );
        suite.$rootScope.$digest();
        expect( suite.$ctrl.iscTblCtrl.updateRow ).toHaveBeenCalled();
      } );

      it( 'should have called default config callback - addRow', function() {
        suite.$ctrl.dataItem = { isNew: true }; //new item
        spyOn( suite.$ctrl.iscTblCtrl, 'addRow' );
        suite.commandsColumn.save.callback = null;
        suite.$ctrl.onCommand( 'save' );
        suite.$rootScope.$digest();
        expect( suite.$ctrl.iscTblCtrl.addRow ).toHaveBeenCalled();
      } );

      it( 'should have called config callback', function() {
        spyOn( suite.commandsColumn.save, 'callback' );
        suite.$ctrl.onCommand( 'save' );
        expect( suite.commandsColumn.save.callback ).toHaveBeenCalled();
      } );
    } );
  } );


  function getTableConfig( $q ) {
    return {
      key           : 'LabOrders',
      title         : '',
      backButtonText: 'back',
      editable      : false,
      api           : {
        remove: mockApi,
        update: mockApi,
        create: mockApi
      },
      columns       : [
        {
          key         : 'OrderedItemDisplay',
          title       : 'ISC_WELLNESS_LAB_NAME',
          defaultValue: []
        },
        {
          key  : 'Timestamp',
          title: 'ISC_WELLNESS_LAB_DATE',
          type : 'date'
        },
        {
          type    : "commands",
          commands: {
            create    : { callback: _.noop },
            remove    : { callback: _.noop },
            save      : { callback: _.noop },
            edit      : { callback: _.noop },
            cancelEdit: { callback: _.noop }
          }
        }
      ]
    };

    function mockApi() {
      return $q.when( true );
    }
  }

  function getTableData() {
    return {
      "LabOrders": [{
        "OrderedItemDisplay": "BASIC METABOLIC PANEL",
        "ResultItems"       : [
          {
            "ResultValue"     : 141,
            "ResultValueUnits": "MEQ/L",
            "Test"            : "SODIUM"
          },
          {
            "ResultValue"     : 3.9,
            "ResultValueUnits": "MEQ/L",
            "Test"            : "POTASSIUM"
          }
        ],
        "Timestamp"         : "2012-11-09 05:06:00"
      }
      ]
    };
  }

  function getTableData2() {
    return {
      "LabOrders": [
        {
          "OrderedItemDisplay": "BASIC METABOLIC PANEL",
          "ResultItems"       : [
            {
              "ResultValue"     : 141,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "SODIUM"
            },
            {
              "ResultValue"     : 3.9,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "POTASSIUM"
            }
          ],
          "Timestamp"         : "2012-11-09 05:06:00"
        },
        {
          "OrderedItemDisplay": "BASIC FOOBAR PANEL",
          "ResultItems"       : [
            {
              "ResultValue"     : 141,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "SODIUM"
            },
            {
              "ResultValue"     : 3.9,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "POTASSIUM"
            }
          ],
          "Timestamp"         : "2012-11-09 05:06:00"
        },
        {
          "OrderedItemDisplay": "BASIC WHATEVER",
          "ResultItems"       : [
            {
              "ResultValue"     : 141,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "SODIUM"
            },
            {
              "ResultValue"     : 3.9,
              "ResultValueUnits": "MEQ/L",
              "Test"            : "POTASSIUM"
            }
          ],
          "Timestamp"         : "2012-11-09 05:06:00"
        }
      ]
    };
  }

})();

