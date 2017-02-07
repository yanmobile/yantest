(function() {
  'use strict';

  //--------------------
  describe( 'iscSubform', function() {
    var PRIMITIVE_KEY = '_primitiveValue';

    var suiteForm,
        suiteInternal,
        suiteSubform;

    var callbackResults = {};

    var mockFormCollectionCallbacks = {
      beforeUpdate: function updated() {
        callbackResults.updated = true;
      },
      beforeDelete: function deleted() {
        callbackResults.deleted = true;
      }
    };

    window.useDefaultTranslateBeforeEach();

    beforeEach( module(
      'formly', 'foundation', 'ui.select',
      'isc.http', 'isc.forms', 'iscNavContainer', 'isc.authorization', 'isc.notification', 'isc.directives',
      'isc.templates', 'isc.fauxTable', 'isc.filters',
      function( $provide, $sceProvider, devlogProvider ) {
        $provide.value( '$log', console );
        $provide.value( 'apiHelper', mockApiHelper );
        $provide.value( 'iscCustomConfigService', mockCustomConfigService );
        $sceProvider.enabled( false );

        // Mock over _.debounce so it executes during tests
        _.debounce = function( callback, time ) {
          return function() {
            callback();
          };
        };

        devlogProvider.loadConfig( mockCustomConfigService.getConfig() );
      } )
    );

    beforeEach( inject( function( $rootScope, $compile, $window, $httpBackend, $timeout,
      formlyApiCheck, formlyConfig, keyCode,
      iscConfirmationService, iscFormsTemplateService,
      iscFormDataApi, iscNotificationService, iscFormsValidationService ) {
      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain = window.createSuite( {
        $window     : $window,
        $compile    : $compile,
        $httpBackend: $httpBackend,
        $timeout    : $timeout,
        $rootScope  : $rootScope,

        iscConfirmationService   : iscConfirmationService,
        keyCode                  : keyCode,
        iscFormDataApi           : iscFormDataApi,
        iscNotificationService   : iscNotificationService,
        iscFormsValidationService: iscFormsValidationService
      } );

      iscFormsTemplateService.registerType( {
        name      : 'customEmbeddedFormCollection',
        extends   : 'embeddedFormCollection',
        controller: function( $scope ) {
          $scope.config = {
            callbacks: {
              beforeUpdate: mockFormCollectionCallbacks.beforeUpdate,
              beforeDelete: mockFormCollectionCallbacks.beforeDelete
            },
            model    : {
              maxSize    : function() {
                return 3;
              },
              defaultItem: function() {
                return {
                  keyField: 'Default Hashtable Key'
                };
              }
            }
          };
        }
      } );

      mockFormResponses( suiteMain.$httpBackend );
    } ) );

    //--------------------
    describe( 'iscSubform - CRUD', function() {
      beforeEach( function() {
        createDirectives( getFormWithData() );
      } );

      // For performance, all tests in this block share a single spec,
      // including the model and directive state
      //--------------------
      it( 'should allow entering of data in a subform', function() {
        // Open a subform of each editAs type, enter a field, and click cancel
        testCancel( 'test.SubformPage', { isFullPage: true } );
        testCancel( 'test.SubformInline', {} );
        testCancel( 'test.SubformModal', {} );
        testCancel( 'test.PrimitiveCollection', { isPrimitive: true } );

        // Open a subform of each editAs type, enter a field, save the subform
        testAdd( 'test.SubformPage', { isFullPage: true } );
        testAdd( 'test.SubformInline', {} );
        testAdd( 'test.SubformModal', {} );
        testAdd( 'test.PrimitiveCollection', { isPrimitive: true } );

        // Test reordering items in the model
        testReorder( 'test.SubformPage' );
        testReorder( 'test.SubformInline' );
        testReorder( 'test.SubformModal' );
        testReorder( 'test.PrimitiveCollection' );

        // Edit each subform type, change a field, save
        testEdit( 'test.SubformPage', { isFullPage: true } );
        testEdit( 'test.SubformInline', {} );
        testEdit( 'test.SubformModal', {} );
        testEdit( 'test.PrimitiveCollection', { isPrimitive: true } );

        // Delete a row for each subform type
        testDelete( 'test.SubformPage', true );
        testDelete( 'test.SubformInline' );
        testDelete( 'test.SubformModal' );
        testDelete( 'test.PrimitiveCollection' );

        // Edit data in the default row for each component type
        testComponents();


        function testCancel( subformName, config ) {
          var suite        = suiteSubform,
              subform      = getControlByName( suite, subformName ).filter( '.subform' ),
              addButton    = subform.find( 'button.embedded-form-add' ),
              model        = _.get( suite.controller.model, subformName ),
              cancelButton = null,
              shownForm    = null,
              inputField   = null,
              modelCount   = model.length,
              isFullPage   = config.isFullPage,
              isPrimitive  = config.isPrimitive;

          expect( addButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );

          // Open the subform
          addButton.click();
          digest( suite );

          selectElements();

          // Verify it opened, change a field
          if ( isFullPage ) {
            spyOn( suite.controller.childConfig, 'onCancel' ).and.callThrough();
          }
          else {
            expect( shownForm.length ).toBe( 1 );
          }
          expect( cancelButton.length ).toBe( 1 );
          expect( inputField.length ).toBe( 1 );

          // Change a field and click cancel to close it
          inputField.val( 'some value' ).trigger( 'change' );
          cancelButton.click();
          digest( suite );
          selectElements();

          expect( cancelButton.length ).toBe( 0 );
          expect( inputField.length ).toBe( 0 );
          expect( model.length ).toBe( modelCount );

          if ( isFullPage ) {
            expect( suite.controller.childConfig.onCancel ).toHaveBeenCalled();
          }
          else {
            expect( shownForm.length ).toBe( 0 );
          }

          function selectElements() {
            model        = _.get( suite.controller.model, subformName );
            cancelButton = suite.element.find( '.embedded-form-cancel' );
            shownForm    = subform.find( '.formly' );
            inputField   = getControlByName( suite, isPrimitive ? PRIMITIVE_KEY : 'aField' );
          }
        }

        function testAdd( subformName, config ) {
          var suite       = suiteSubform,
              subform     = getControlByName( suite, subformName ).filter( '.subform' ),
              addButton   = subform.find( 'button.embedded-form-add' ),
              model       = _.get( suite.controller.model, subformName ),
              saveButton  = null,
              shownForm   = null,
              inputField  = null,
              modelCount  = model.length,
              isFullPage  = config.isFullPage,
              isPrimitive = config.isPrimitive;

          expect( addButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );

          // Open the subform
          addButton.click();
          digest( suite );
          selectElements();

          // Verify it opened, change a field
          if ( isFullPage ) {
            spyOn( suite.controller.childConfig, 'onSubmit' ).and.callThrough();
          }
          else {
            expect( shownForm.length ).toBe( 1 );
          }
          expect( saveButton.length ).toBe( 1 );
          expect( inputField.length ).toBe( 1 );

          // Change a field and click submit to save it
          inputField.val( 'some value' ).trigger( 'change' );
          digest( suite );

          saveButton.click();
          digest( suite );
          selectElements();

          expect( saveButton.length ).toBe( 0 );
          expect( inputField.length ).toBe( 0 );

          if ( isFullPage ) {
            expect( suite.controller.childConfig.onSubmit ).toHaveBeenCalled();
          }
          else {
            expect( shownForm.length ).toBe( 0 );
          }
          expect( model.length ).toBe( modelCount + 1 );

          function selectElements() {
            model      = _.get( suite.controller.model, subformName );
            saveButton = suite.element.find( '.embedded-form-save' );
            shownForm  = subform.find( '.formly' );
            inputField = getControlByName( suite, isPrimitive ? PRIMITIVE_KEY : 'aField' );
          }
        }

        function testReorder( subformName ) {
          var suite         = suiteSubform,
              subform       = getControlByName( suite, subformName ).filter( '.subform' ),
              moveUpButton  = subform.find( 'button.embedded-form-move-up' ).last(),
              model         = _.get( suite.controller.model, subformName ),
              rowToMove     = _.last( model ),
              startingIndex = model.length - 1;

          expect( moveUpButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );

          expect( _.indexOf( model, rowToMove ) ).toBe( startingIndex );

          // Move the row up
          moveUpButton.click();
          selectElements();

          expect( _.indexOf( model, rowToMove ) ).toBe( Math.max( startingIndex - 1, 0 ) );

          var moveDownButton = subform.find( 'button.embedded-form-move-down' ).first();
          expect( moveDownButton.length ).toBe( 1 );

          // Move the row back down
          moveDownButton.click();
          selectElements();

          expect( _.indexOf( model, rowToMove ) ).toBe( startingIndex );

          function selectElements() {
            model = _.get( suite.controller.model, subformName );
          }
        }

        function testEdit( subformName, config ) {
          var suite       = suiteSubform,
              subform     = getControlByName( suite, subformName ).filter( '.subform' ),
              editButton  = subform.find( 'button.embedded-form-edit' ).last(),
              model       = _.get( suite.controller.model, subformName ),
              saveButton  = null,
              shownForm   = null,
              inputField  = null,
              modelCount  = model.length,
              isFullPage  = config.isFullPage,
              isPrimitive = config.isPrimitive;

          expect( editButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );

          // Open the subform
          editButton.click();
          digest( suite );
          selectElements();

          // Verify it opened, change a field
          if ( isFullPage ) {
            spyOn( suite.controller.childConfig, 'onSubmit' ).and.callThrough();
          }
          else {
            expect( shownForm.length ).toBe( 1 );
          }
          expect( saveButton.length ).toBe( 1 );
          expect( inputField.length ).toBe( 1 );

          // Change a field and click submit to save it
          inputField.val( 'some different value' ).trigger( 'change' );
          saveButton.click();
          digest( suite );
          selectElements();

          expect( saveButton.length ).toBe( 0 );
          expect( inputField.length ).toBe( 0 );

          if ( isFullPage ) {
            expect( suite.controller.childConfig.onSubmit ).toHaveBeenCalled();
          }
          else {
            expect( shownForm.length ).toBe( 0 );
          }
          expect( model.length ).toBe( modelCount );

          function selectElements() {
            model      = _.get( suite.controller.model, subformName );
            saveButton = suite.element.find( '.embedded-form-save' );
            shownForm  = subform.find( '.formly' );
            inputField = getControlByName( suite, isPrimitive ? PRIMITIVE_KEY : 'aField' );
          }
        }

        function testDelete( subformName, confirmDeletion ) {
          var suite        = suiteSubform,
              subform      = getControlByName( suite, subformName ).filter( '.subform' ),
              deleteButton = subform.find( 'button.embedded-form-delete' ).last(),
              model        = _.get( suite.controller.model, subformName ),
              modelCount   = model.length;

          expect( deleteButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );

          // Delete the record
          deleteButton.click();
          if ( confirmDeletion ) {
            suiteMain.iscConfirmationService.resolve();
          }
          digest( suite );
          selectElements();

          expect( model.length ).toBe( modelCount - 1 );

          function selectElements() {
            model = _.get( suite.controller.model, subformName );
          }
        }

        function testComponents() {
          var suite          = suiteSubform,
              subformName    = 'form.components',
              subform        = getControlByName( suite, subformName ).filter( '.subform' ),
              formModel      = _.get( suite.controller.model, subformName ),
              formState      = suite.controller.options.formState,
              formDefinition = suiteInternal.controller.formDefinition.subforms.builtinComponents.sections[0].fields,
              displayField   = _.get( customConfig, 'forms.defaultDisplayField', 'name' );

          testInput( 'templates.input.text' );
          testInput( 'templates.input.date' );

          testButton( 'templates.button.input' );

          testCheckbox( 'templates.checkbox' );

          testMultiCheckbox( 'templates.multiCheckbox.primitiveValue' );
          testMultiCheckbox( 'templates.multiCheckbox.objectValue' );

          testRadio( 'templates.radio.primitiveValue' );
          testRadio( 'templates.radio.objectValue' );

          testSelect( 'templates.select.primitiveValue' );
          testSelect( 'templates.select.objectValue' );

          testInput( 'templates.textarea' );

          testTypeahead( 'templates.typeahead.primitiveValue' );
          testTypeahead( 'templates.typeahead.objectValue' );
          testTypeahead( 'templates.typeaheadWithScript', true );

          testDateComponents( 'templates.dateComponents' );
          testDateComponents( 'templates.dateComponentsPartial', true );

          testControlFlowOnly( 'templates.controlFlowOnly' );

          // One of the fields has a watcher and should have updated the formState
          expect( formState.watcherFired ).toBe( true );

          function getFieldProperty( fieldKey, property ) {
            var field = _.find( formDefinition, { key: fieldKey } ) || {};
            return _.get( field, property );
          }

          function testInput( controlName ) {
            var control = getControlByName( suite, controlName ),
                model   = _.get( formModel, controlName ),
                newText = 'changing the text';

            expect( control.length ).toBe( 1 );
            expect( control.val() ).toEqual( model );
            expect( model ).not.toEqual( newText );

            control.val( newText ).trigger( 'change' );
            digest( suite );

            model = _.get( formModel, controlName );
            expect( model ).toEqual( newText );
          }

          function testButton( inputName ) {
            var stateName = 'buttonUserScriptCalled',
                newText   = 'Set from the button click',
                input     = getControlByName( suite, inputName ),
                button    = input.parentsUntil( '.button-fieldgroup' ).parent().find( 'button' ),
                model     = _.get( formModel, inputName, '' ),
                state     = _.get( formState, stateName );

            expect( button.length ).toBe( 2 );
            expect( input.length ).toBe( 1 );
            expect( input.val() ).toEqual( model );
            expect( state ).toBeUndefined();

            button.trigger( 'click' );
            digest( suite );

            model = _.get( formModel, inputName );
            state = _.get( formState, stateName );

            // The button test exercises both data.userScript and templateOptions.onClick:
            // one sets text in the data model;
            // the other sets a flag in the form state.
            expect( model ).toEqual( newText );
            expect( state ).toBe( true );
          }

          function testCheckbox( controlName ) {
            var control = getControlByName( suite, controlName ),
                model   = _.get( formModel, controlName );

            expect( control.length ).toBe( 1 );
            expect( control.is( ':checked' ) ).toEqual( true );
            expect( model ).toEqual( true );

            control.click();
            digest( suite );

            model = _.get( formModel, controlName );
            expect( model ).toEqual( false );
          }

          function testMultiCheckbox( controlName ) {
            var control      = getControlByName( suite, controlName ).filter( 'input[type="checkbox"]' ),
                firstControl = control.first(),
                model        = _.get( formModel, controlName );

            // 3 options on mock multi checkboxes;
            // 2 are checked, one of which is the first one
            expect( control.length ).toBe( 3 );
            expect( firstControl.is( ':checked' ) ).toBe( true );
            expect( control.filter( ':checked' ).length ).toEqual( 2 );
            expect( model.length ).toEqual( 2 );

            firstControl.click();
            digest( suite );

            model = _.get( formModel, controlName );
            expect( firstControl.is( ':checked' ) ).toBe( false );
            expect( control.filter( ':checked' ).length ).toEqual( 1 );
            expect( model.length ).toEqual( 1 );
          }

          function testRadio( controlName ) {
            var control      = getControlByName( suite, controlName ).filter( 'input[type="radio"]' ),
                firstControl = control.first(),
                lastControl  = control.last(),
                model        = _.get( formModel, controlName );

            // 3 options on mock radios;
            // 1 of these is already selected, which is not the first one
            expect( control.length ).toBe( 3 );
            expect( firstControl.is( ':checked' ) ).toBe( false );
            expect( control.is( ':checked' ) ).toBe( true );
            expect( model ).toBeDefined();

            firstControl.click();
            digest( suite );

            var previousModel = model;
            model             = _.get( formModel, controlName );
            expect( firstControl.is( ':checked' ) ).toBe( true );
            expect( control.is( ':checked' ) ).toBe( true );
            expect( model ).not.toEqual( previousModel );

            // Verify that the first control becomes deselected
            // when the last one is selected
            lastControl.click();
            digest( suite );

            previousModel = model;
            model         = _.get( formModel, controlName );
            expect( firstControl.is( ':checked' ) ).toBe( false );
            expect( lastControl.is( ':checked' ) ).toBe( true );
            expect( control.is( ':checked' ) ).toBe( true );
            expect( model ).not.toEqual( previousModel );

            // Verify that when the model is updated from outside the widget,
            // the widget reflects that change.
            var secondValue = _.find( formDefinition, { key: controlName } ).templateOptions.options[1];
            _.set( formModel, controlName, secondValue );
            digest( suite );
            expect( firstControl.is( ':checked' ) ).toBe( false );
            expect( lastControl.is( ':checked' ) ).toBe( false );
            expect( control.is( ':checked' ) ).toBe( true );
          }

          function testSelect( controlName ) {
            var control        = getControlByName( suite, controlName ).filter( 'select' ),
                controlOptions = control.find( 'option' ),
                firstControl   = controlOptions.first(),
                model          = _.get( formModel, controlName );

            // 3 options on mock radios;
            // 1 of these is already selected, which is not the first one
            expect( control.length ).toBe( 1 );
            expect( controlOptions.length ).toBe( 3 );
            expect( firstControl.is( ':checked' ) ).toBe( false );
            expect( model ).toBeDefined();

            firstControl.click();
            control.val( firstControl.attr( 'value' ) ).trigger( 'change' );
            digest( suite );

            var previousModel = model;
            model             = _.get( formModel, controlName );
            expect( firstControl.is( ':checked' ) ).toBe( true );
            expect( model ).not.toEqual( previousModel );
          }

          function testTypeahead( controlName, isScript ) {
            var control     = getControlByName( suite, controlName ),
                container   = control.find( '.ui-select-container' ),
                focusser    = control.find( '.ui-select-focusser' ),
                input       = control.find( 'input.ui-select-search' ),
                display     = control.find( '.ui-select-match' ).find( '.ng-binding' ).last(),
                newText     = 'Typea',
                limitToList = getFieldProperty( controlName, 'data.limitToList' ),
                keyCodes    = suiteMain.keyCode,
                model, modelDisplay,
                list, listItems, firstItem, secondItem;

            getModel();

            expect( subform.length ).toBe( 1 );
            expect( control.length ).toBe( 1 );
            expect( input.length ).toBe( 1 );
            expect( focusser.length ).toBe( 1 );
            expect( display.html().trim() ).toEqual( modelDisplay );
            expect( model ).not.toEqual( newText );

            // Enter some search text
            enterText( newText );
            selectList();
            expect( listItems.length ).toBe( 3 );

            // Select the first item using the keyboard (down arrow and tab or enter)
            keyboardSelect();
            getModel();
            expect( modelDisplay ).toEqual( 'Typeahead 1' );

            // Clear the control
            backspaceInput();
            getModel();
            expect( modelDisplay ).toBeUndefined();

            // Re-enter the search text
            enterText( newText );
            selectList();

            // Click on the second option
            mouseSelect( secondItem );
            getModel();
            expect( modelDisplay ).toEqual( 'Typeahead 2' );

            // Enter new text and blur the control
            enterText( 'A tag' );
            blurInput();
            // sendEnter(input);
            getModel();
            if ( limitToList ) {
              // If limitToList, the value should not change
              expect( modelDisplay ).toEqual( 'Typeahead 2' );
            }
            else {
              // If not limitToList, the value should be the new text
              expect( modelDisplay ).toEqual( 'A tag' );
            }


            function enterText( text ) {
              input.click();
              suite.$scope.$digest();
              suiteMain.$timeout.flush( 500 );
              input.val( text ).trigger( 'input' ).trigger( 'change' ).trigger( 'keydown' );
              digest( suite );

              if ( isScript ) {
                suiteMain.$httpBackend.flush();
              }
            }

            function keyboardSelect() {
              sendDownArrow( input );
              sendTab( input );
              input.trigger( 'change' );
              digest( suite );
            }

            function mouseSelect( item ) {
              item.trigger( 'click' );
              input.trigger( 'change' );
              digest( suite );
            }

            function backspaceInput() {
              input.val( '' ).trigger( 'change' ).trigger( 'keydown' );
              focusser.triggerHandler( 'focus' );
              sendBackspace( focusser );
              digest( suite );
            }

            function blurInput() {
              input.triggerHandler( 'focus' );
              input.trigger( 'change' ).triggerHandler( 'blur' );
              digest( suite );
            }

            function selectList() {
              list       = control.find( '.ui-select-choices' );
              listItems  = list.find( '.ui-select-choices-row' );
              firstItem  = listItems.first();
              secondItem = firstItem.next();
            }

            function getModel() {
              model        = _.get( formModel, controlName );
              modelDisplay = _.isObject( model ) ? model[displayField] : model;
            }

            function sendBackspace( control ) {
              control.trigger( {
                type : 'keydown',
                which: keyCodes.BACKSPACE
              } )
            }

            function sendDownArrow( control ) {
              control.trigger( {
                type : 'keydown',
                which: 40
              } );
            }

            function sendTab( control ) {
              control.trigger( {
                type : 'keydown',
                which: keyCodes.TAB
              } );
            }
          }

          function testDateComponents( controlName, isPartial ) {
            var control = getControlByName( suite, controlName );

            if ( !isPartial ) {
              control = control.not( '[name*="Partial"]' );
            }

            var inputs      = control.find( 'input[type="number"]' ),
                dayInput    = inputs.filter( ".date-components-day" ),
                monthInput  = inputs.filter( ".date-components-month" ),
                yearInput   = inputs.filter( ".date-components-year" ),
                modelMoment = getModelMoment(),
                viewMoment  = getViewMoment(),
                ids         = {
                  "Day"  : dayInput,
                  "Month": monthInput,
                  "Year" : yearInput
                };

            var numKeys  = [// 0 through 9
                  48, 49, 50, 51, 52, 53, 54, 55, 56, 57
                ],
                keyCodes = suiteMain.keyCode;

            wireKeypress( dayInput );
            wireKeypress( monthInput );
            wireKeypress( yearInput );

            // Have to manually change the input control's value if the event succeeded
            // This is normally done by the browser automatically
            control.on( 'keypress', function( event ) {
              if ( !event.isDefaultPrevented() ) {
                var keyCode      = event.keyCode,
                    target       = event.target['0'],
                    control      = ids[target.id],
                    targetVal    = target.value,
                    controlVal   = control.val(),
                    enteredValue = _.indexOf( numKeys, keyCode ).toString();

                if ( keyCode === keyCodes.BACKSPACE && controlVal.length > 0 ) {
                  control.val( targetVal.substr( 0, controlVal.length - 1 ) );
                }
                else {
                  ids[target.id].val( targetVal + enteredValue );
                }

                control.triggerHandler( 'change' );
                digest( suite );
                digest( suite );
              }
            } );

            expect( control.length ).toBe( 1 );
            expect( inputs.length ).toBe( 3 );
            if ( isPartial ) {
              expect( dayInput.val() ).toEqual( getModelDay() );
              expect( monthInput.val() ).toEqual( getModelMonth().toString() );
              expect( yearInput.val() ).toEqual( getModelYear().toString() );
            }
            else {
              expect( viewMoment.toISOString() ).toEqual( modelMoment.toISOString() );
            }

            // Test changing DOM inputs
            // Only run for base date components, for performance
            if ( !isPartial ) {
              // Model date is 12/11/1990
              // Change to 10/14/1998

              // Day 14
              dayInput
                .sendKeypress( 58 ) // send an unacceptable char
                .sendKeypress( keyCodes.BACKSPACE )
                .sendKeypress( numKeys[4] )
                .trigger( 'input' );

              expect( dayInput.val() ).toBe( '14' );
              expect( getModelDay() ).toBe( 14 );

              // Month 10
              monthInput
                .sendKeypress( keyCodes.BACKSPACE )
                .sendKeypress( numKeys[0] )
                .trigger( 'input' );

              expect( monthInput.val() ).toBe( '10' );
              expect( getModelMonth() ).toBe( 10 );

              yearInput
                .sendKeypress( keyCodes.BACKSPACE )
                .sendKeypress( numKeys[8] )
                .trigger( 'blur' );

              expect( yearInput.val() ).toBe( '1998' );
              expect( getModelYear() ).toBe( 1998 );
            }

            function getModel() {
              return _.get( formModel, controlName );
            }

            function getModelMoment() {
              return moment( getModel() );
            }

            function getModelDay() {
              return isPartial ? getModel().day : getModelMoment().date();
            }

            function getModelMonth() {
              // Moment's .month() is 0-based
              return isPartial ? getModel().month : getModelMoment().month() + 1;
            }

            function getModelYear() {
              return isPartial ? getModel().year : getModelMoment().year();
            }

            function getViewMoment() {
              return moment( [
                dayInput.val(),
                monthInput.val(),
                yearInput.val()
              ].join( '-' ), 'D-M-YYYY' );
            }

            function wireKeypress( control ) {
              control.sendKeypress = function( key ) {
                this.trigger( {
                  type    : 'keypress',
                  target  : this,
                  charCode: key,
                  keyCode : key
                } );
                return this;
              };
            }
          }

          function testControlFlowOnly( controlName ) {
            var control     = getControlByName( suite, controlName ).filter( 'input[type="radio"]' ),
                lastControl = control.last(),
                stateKey    = 'controlFlowOnly',
                localState  = _.get( formState, stateKey );

            // Mock form has two radio options
            expect( control.length ).toBe( 2 );

            // Expect the state init expression to see the data in templates.input.text
            expect( getFormStateValue() ).toEqual( 'opt 1' );
            expect( getModelValue() ).toBeUndefined();

            lastControl.click();
            suite.$scope.$digest();

            // TODO - figure out why formState is detached for tests
            // expect( getFormStateValue() ).toEqual( 'opt 2' );
            expect( getModelValue() ).toBeUndefined();

            function getFormStateValue() {
              return _.get( localState, controlName );
            }

            function getModelValue() {
              return _.get( formModel, controlName );
            }
          }
        }
      } );

    } );

    function createDirectives( rootForm, config ) {
      config    = config || {};
      // Create an isc-form to get what would normally be passed to isc-form-internal
      suiteForm = createDirective( rootForm, {
        localFormConfig  : config.formConfig || {},
        localButtonConfig: config.buttonConfig || {}
      } );
      suiteMain.$httpBackend.flush();

      suiteInternal = createDirective( getInternalForm(), {
        formCtrl: suiteForm.controller
      } );

      suiteInternal.controller = suiteInternal.$isolateScope.formInternalCtrl;

      suiteSubform = createDirective( getSubform(), {
        formInternalCtrl: suiteInternal.controller
      } );

      suiteSubform.controller = suiteSubform.$isolateScope.subformCtrl;
    }

  } );
})();