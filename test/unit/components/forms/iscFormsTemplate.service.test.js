(function() {
  'use strict';

  //--------------------
  describe( 'iscFormsTemplateService', function() {
    var suite,
        customButtonDefaults = {
          test: {
            onClick: _.noop
          }
        },
        mockMode             = 'edit',
        mockSectionLayout    = 'wizard';


    window.useDefaultTranslateBeforeEach();

    beforeEach( module(
      'formly', 'foundation',
      'isc.http', 'isc.forms', 'iscNavContainer', 'isc.authorization', 'isc.notification', 'isc.directives',
      'isc.templates', 'isc.fauxTable', 'isc.filters',
      function( $provide, devlogProvider ) {
        $provide.value( '$log', console );
        $provide.value( 'apiHelper', mockApiHelper );
        $provide.value( 'iscCustomConfigService', mockCustomConfigService );
        devlogProvider.loadConfig( mockCustomConfigService.getConfig() );
      } )
    );

    beforeEach( inject( function( $rootScope, $compile, $httpBackend, $timeout,
      formlyApiCheck, formlyConfig,
      iscFormsTemplateService, iscFormsTransformService, iscFormsApi, iscFormsCodeTableApi ) {

      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain = window.createSuite( {
        $httpBackend: $httpBackend,
        $timeout    : $timeout,
        $rootScope  : $rootScope,
        $compile    : $compile,

        iscFormsTemplateService : iscFormsTemplateService,
        iscFormsTransformService: iscFormsTransformService,
        iscFormsCodeTableApi    : iscFormsCodeTableApi,
        iscFormsApi             : iscFormsApi
      } );
      mockFormResponses( suiteMain.$httpBackend );
    } ) );

    //--------------------
    // This creates a custom widget that includes a watcher in the default widget definition.
    // iscFormsTemplateService has a workaround function to address two issues with this:
    // 1. Angular does not recognize $watch listeners that are expressions;
    // 2. watchers defined directly on custom formly templates do not inherit to instances of that template.
    // This spec exercises the function that fixes these two issues.
    describe( 'testing watchers on custom templates', function() {
      beforeEach( function() {
        suiteMain.iscFormsTemplateService.registerType( {
          name          : 'customWatcherWidget',
          extends       : 'input',
          defaultOptions: {
            watcher: [
              {
                expression: 'model',
                listener  : 'model._watcher = model.fieldWithCustomWatcher',
                watchDeep : true
              }
            ]
          }
        } );

        suite = createDirective( getMinimalForm( 'customWatcher' ) );
        suiteMain.$httpBackend.flush();
      } );

      it( 'should load the test watcher form and fire the watch listener', function() {
        var model       = suite.controller.internalModel,
            newValue    = 'some value',
            controlName = 'fieldWithCustomWatcher',
            watcherProp = '_watcher',
            inputField  = getControlByName( suite, controlName );

        expect( _.get( model, controlName ) ).toBeUndefined();
        expect( _.get( model, watcherProp ) ).toBeUndefined();

        expect( inputField.length ).toBe( 1 );
        inputField.val( newValue ).trigger( 'change' );
        suiteMain.$timeout.flush();

        expect( _.get( model, controlName ) ).toEqual( newValue );

        // Now that the model has updated, the watcher should have fired and updated its own property
        expect( _.get( model, watcherProp ) ).toEqual( newValue );
      } );

      it( 'should remove the custom widget from the widget list with overrideWidgetList', function() {
        var widgetList = suiteMain.iscFormsTemplateService.getWidgetList();
        expect( widgetList ).toContain( 'customWatcherWidget' );

        // Overriding the visibility of the widget should remove it from the list
        suiteMain.iscFormsTemplateService.overrideWidgetList( 'customWatcherWidget', false );
        var updatedList = suiteMain.iscFormsTemplateService.getWidgetList();
        expect( updatedList ).not.toContain( 'customWatcherWidget' );
      } );
    } );

    describe( 'custom service-level button configurations', function() {
      it( 'should be returned by the service', function() {
        suiteMain.iscFormsTemplateService.registerButtonDefaults( customButtonDefaults );
        var expectedDefaults = suiteMain.iscFormsTemplateService.getButtonDefaults(
          mockMode,
          mockSectionLayout
        );
        expect( customButtonDefaults ).toEqual( expectedDefaults );
      } );

      it( 'should handle a function definition for custom defaults', function() {
        suiteMain.iscFormsTemplateService.registerButtonDefaults( defaultsAsFunction );
        var expectedDefaults = suiteMain.iscFormsTemplateService.getButtonDefaults(
          mockMode,
          mockSectionLayout
        );
        expect( customButtonDefaults ).toEqual( expectedDefaults );

        function defaultsAsFunction( mode, sectionLayout ) {
          expect( mode ).toEqual( mockMode );
          expect( sectionLayout ).toEqual( mockSectionLayout );
          return customButtonDefaults;
        }
      } );
    } );

    describe( 'field groups', function() {
      beforeEach( function() {
        suiteMain.iscFormsTransformService.configure( {
          wrapFieldGroups: true
        } );
        suite = createDirective( getMinimalForm( 'hideIfGroupEmpty' ) );
        suiteMain.$httpBackend.flush();
      } );

      it( 'should render a label on the field group', function() {
        var label = suite.element.find( '.form-label' ).first();
        expect( label.html().trim() ).toEqual( jasmine.stringMatching( 'Label for Field Group' ) );
      } );

      it( 'should hide the field with hideIfGroupEmpty if all other fields are hidden', function() {
        var model        = suite.controller.internalModel,
            headerToHide = 'headerToHide',
            field1       = 'field1',
            field2       = 'field2';

        expectVisible( headerToHide );
        expectVisible( field1 );
        expectVisible( field2 );

        setModel( 'hideField1', true );
        expectVisible( headerToHide );
        expectHidden( field1 );
        expectVisible( field2 );

        setModel( 'hideField2', true );
        expectHidden( headerToHide );
        expectHidden( field1 );
        expectHidden( field2 );

        setModel( 'hideField1', false );
        expectVisible( headerToHide );
        expectVisible( field1 );
        expectHidden( field2 );

        function setModel( field, value ) {
          model[field] = value;
          digest( suite );
        }

        function expectVisible( controlName ) {
          expect( getControlByName( suite, controlName ).length ).toBe( 1 );
        }

        function expectHidden( controlName ) {
          expect( getControlByName( suite, controlName ).length ).toBe( 0 );
        }
      } );
    } );

    describe( 'list control initialization', function() {
      beforeEach( function() {
        suiteMain.iscFormsCodeTableApi.getAsync( 'usStates' );
        suiteMain.$httpBackend.flush();
      } );

      it( 'should set a listOptions property on the field scope', function() {
        spyOn( suiteMain.iscFormsTemplateService, 'initListControlWidget' ).and.callThrough();

        var primitiveOptions = ['1', '2', '3'],
            objectOptions    = [
              { name: 'one', value: '1' },
              { name: 'two', value: '2' },
              { name: 'three', value: '3' }
            ],
            codeTable        = 'usStates',
            codeTableOptions = suiteMain.iscFormsCodeTableApi.getSync( codeTable ),
            mockFieldScope;

        // N.B.: scope.to is a alias for scope.options.templateOptions, created by angular-formly
        var mockCodeTable        = {
              data: {
                codeTable: codeTable
              }
            },
            mockPrimitiveOptions = {
              templateOptions: {
                options: primitiveOptions
              }
            },
            mockMixedOptions     = {
              templateOptions: {
                options: objectOptions
              },
              data           : {
                codeTable: codeTable
              }
            };

        // Populate code table and set the object flag to true
        mockFieldScope = getMockFieldScope( mockCodeTable );
        expect( mockFieldScope.listOptions ).toEqual( codeTableOptions );
        expect( mockFieldScope.isObjectModel ).toBe( true );

        // Populate explicit primitive options and set the object flag to false
        mockFieldScope = getMockFieldScope( mockPrimitiveOptions );
        expect( mockFieldScope.listOptions ).toEqual( primitiveOptions );
        expect( mockFieldScope.isObjectModel ).toBe( false );

        // Populate the code table and explicit object options and set the object flag to true
        mockFieldScope = getMockFieldScope( mockMixedOptions );
        expect( mockFieldScope.listOptions ).toEqual(
          [].concat( objectOptions ).concat( codeTableOptions )
        );
        expect( mockFieldScope.isObjectModel ).toBe( true );

        function getMockFieldScope( options ) {
          var mockScope = {
            options    : options,
            $watchGroup: function( expressions, callback ) {
              callback( {} );
            }
          };
          suiteMain.iscFormsTemplateService.initListControlWidget( mockScope );
          return mockScope;
        }
      } );
    } );

    describe( 'registerGlobalLibrary', function() {
      it( 'should register a function with the global library', function() {
        suiteMain.iscFormsTemplateService.registerGlobalLibrary( {
          myFunction: _.noop
        } );

        var globalLibrary = suiteMain.iscFormsTemplateService.getGlobalFunctionLibrary();
        expect( globalLibrary.myFunction ).toEqual( _.noop );
      } )
    } );

    describe( 'appendWrapper', function() {
      it( "should append a wrapper to the given template's wrapper array", function() {
        suiteMain.iscFormsTemplateService.appendWrapper( 'customWrapper', 'input' );

        var template = suiteMain.iscFormsTemplateService.getRegisteredType( 'input' );
        expect( template.wrapper ).toContain( 'customWrapper' );
      } );
    } );

    describe( 'removeWrapper', function() {
      it( "should remove a wrapper from the given template's wrapper array", function() {
        var template = suiteMain.iscFormsTemplateService.getRegisteredType( 'input' );
        expect( template.wrapper ).toContain( 'templateLabel' );

        suiteMain.iscFormsTemplateService.removeWrapper( 'templateLabel', 'input' );

        template = suiteMain.iscFormsTemplateService.getRegisteredType( 'input' );
        expect( template.wrapper ).not.toContain( 'templateLabel' );
      } );
    } );

    describe( 'registerBaseType', function() {
      it( 'should register configuration options for init and scope', function() {
        var baseTypeConfig = {
          init : _.noop,
          scope: {
            customScopeFunction: _.noop
          }
        };

        spyOn( baseTypeConfig, 'init' ).and.callThrough();
        spyOn( baseTypeConfig.scope, 'customScopeFunction' ).and.callThrough();

        // register the custom functions with the base formly type
        suiteMain.iscFormsTemplateService.registerBaseType( baseTypeConfig );

        // create a form that uses the custom function defined above
        suite = createDirective( getMinimalForm( 'customBase' ) );
        suiteMain.$httpBackend.flush();
        suiteMain.$timeout.flush();

        // init will always be called, if configured
        expect( baseTypeConfig.init ).toHaveBeenCalled();
        // custom scope functions will be called if referenced by FDN fields
        expect( baseTypeConfig.scope.customScopeFunction ).toHaveBeenCalled();
      } );
    } );

    describe( 'loadCodeTables', function() {
      it( 'should load code tables in a form definition', function() {
        var mockFdn = {
          form    : {
            sections: [
              {
                fields: [
                  {
                    // Test field group recursion
                    fieldGroup: [
                      makeMockCodeTableReference( 'formCodeTable' )
                    ]
                  }
                ]
              }
            ]
          },
          subforms: {
            subform1: {
              sections: [
                {
                  // Test base field definitions
                  fields: [
                    makeMockCodeTableReference( 'subform1CodeTable' )
                  ]
                }
              ]
            },
            subform2: {
              sections: [
                {
                  fields: [
                    {
                      data: {
                        // Test explicitly embedded field recursion
                        embeddedFields: [
                          makeMockCodeTableReference( 'subform2CodeTable' )
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          }
        };

        spyOn( suiteMain.iscFormsCodeTableApi, 'getAsync' ).and.returnValue( [] );

        suiteMain.iscFormsTemplateService.loadCodeTables( mockFdn ).then( function() {
          expect( suiteMain.iscFormsCodeTableApi.getAsync ).toHaveBeenCalledWith( 'formCodeTable', undefined );
          expect( suiteMain.iscFormsCodeTableApi.getAsync ).toHaveBeenCalledWith( 'subform1CodeTable', undefined );
          expect( suiteMain.iscFormsCodeTableApi.getAsync ).toHaveBeenCalledWith( 'subform2CodeTable', undefined );
        } );

        suiteMain.$timeout.flush();

        function makeMockCodeTableReference( codeTableName ) {
          return {
            data: {
              codeTable: codeTableName
            }
          };
        }
      } );
    } );

    describe( 'viewMode date parsing', function() {
      beforeEach( function() {
        suite = createDirective( getMinimalForm( {
          formKey   : 'viewModeTestForm',
          formDataId: 6,
          mode      : 'view'
        } ) );
        suiteMain.$httpBackend.flush();
      } );

      it( 'should parse the data into dates correctly', function() {
        var expectedFormat = getCustomConfig().formats.date.shortDate,
            data           = viewModeMockData.data;

        var expectDate1 = moment( data.date1 ).format( expectedFormat ),
            expectDate2 = moment( data.date2 ).format( expectedFormat ),
            expectDate3 = moment( data.date3 ).format( expectedFormat );

        var date1 = suite.element.find( '.date1 .ng-binding > p' ),
            date2 = suite.element.find( '.date2 .ng-binding > p' ),
            date3 = suite.element.find( '.date3 .ng-binding > p' );

        expect( date1.html() ).toEqual( expectDate1 );
        expect( date2.html() ).toEqual( expectDate2 );
        expect( date3.html() ).toEqual( expectDate3 );
      } );
    } );

    describe( 'getSectionForEmbeddedForm', function() {
      var subformDefs = {};

      beforeEach( function() {
        suiteMain.iscFormsApi.getFormDefinition('comprehensive')
          .then( function( definition ) {
            subformDefs.comprehensive = definition;
          } );
        suiteMain.$httpBackend.flush();
      } );

      it( 'should return the correct section(s) based on the field definition', function() {
        var subform = subformDefs.comprehensive;

        // Test this with an embedded form with multiple sections
        expect( subform.sections.length ).toBeGreaterThan( 1 );

        // If a section index is provided, that should be returned as the result
        var fieldDef = {
          data: {
            embeddedType   : 'comprehensive',
            embeddedSection: 1
          }
        };
        expect( suiteMain.iscFormsTemplateService.getSectionForEmbeddedForm( fieldDef, subformDefs ) )
          .toEqual( subform.sections[1] );

        // If a section name is provided, that should be returned as the result
        fieldDef.data.embeddedSection = subform.sections[3].name;
        expect( suiteMain.iscFormsTemplateService.getSectionForEmbeddedForm( fieldDef, subformDefs ) )
          .toEqual( subform.sections[3] );

        // If no section name or index is provided, the first section should be returned as the result
        delete fieldDef.data.embeddedSection;
        expect( suiteMain.iscFormsTemplateService.getSectionForEmbeddedForm( fieldDef, subformDefs ) )
          .toEqual( subform.sections[0] );

        // If embedAllSections is provided, the entire subform should be returned as the result
        // It will be a single section with each of the subform's sections returned as a fieldGroup
        fieldDef.data.embedAllSections = true;
        var result = suiteMain.iscFormsTemplateService.getSectionForEmbeddedForm(fieldDef, subformDefs);

        expect( result.fields.length ).toBeGreaterThan( 1 );
        for ( var i = 0; i < result.fields.length; i++ ) {
          expect( result.fields[i].fieldGroup ).toEqual( subform.sections[i].fields );
          expect( result.fields[i].templateOptions.label ).toEqual( subform.sections[i].name );
        }
      } );
    } );
  } );
})();