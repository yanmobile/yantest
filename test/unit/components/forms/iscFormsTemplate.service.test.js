(function() {
  'use strict';

  //--------------------
  describe( 'iscFormsTemplateService', function() {
    var suite;

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

    beforeEach( inject( function( $rootScope, $compile, $window, $httpBackend, $timeout, $q,
      formlyApiCheck, formlyConfig,
      iscFormsTemplateService,
      iscFormDataApi, iscNotificationService, iscFormsValidationService ) {
      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain = window.createSuite( {
        $window     : $window,
        $compile    : $compile,
        $httpBackend: $httpBackend,
        $timeout    : $timeout,
        $rootScope  : $rootScope,
        $q          : $q,

        iscFormsTemplateService: iscFormsTemplateService,
        formDataApi            : iscFormDataApi,
        notificationService    : iscNotificationService,
        validationService      : iscFormsValidationService
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

      it( 'should load a literal FDN definition and work like a REST form', function() {
        var model       = suite.controller.internalModel,
            newValue    = 'some value',
            controlName = 'fieldWithCustomWatcher',
            watcherProp = '_watcher',
            inputField  = getControlByName( suite, controlName );

        expect( _.get( model, controlName ) ).toBeUndefined();

        expect( inputField.length ).toBe( 1 );
        inputField.val( newValue ).trigger( 'change' );
        suiteMain.$timeout.flush();

        expect( _.get( model, controlName ) ).toEqual( newValue );

        // Now that the model has updated, the watcher should have fired and updated its own property
        expect( _.get( model, watcherProp ) ).toEqual( newValue );
      } );
    } );

  } );
})();