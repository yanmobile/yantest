(function() {
  'use strict';

  //--------------------
  describe( 'iscFormInternal', function() {
    var suiteForm,
        suiteInternal;

    window.useDefaultTranslateBeforeEach();

    useDefaultFormsModules();

    beforeEach( module(
      'foundation', 'isc.authorization', 'isc.notification', 'isc.directives',
      function( $provide, devlogProvider ) {
        devlogProvider.loadConfig( mockCustomConfigService.getConfig() );
      } )
    );

    beforeEach( inject( function( $rootScope, $compile, $window, $httpBackend, $timeout,
      formlyApiCheck, formlyConfig,
      iscFormDataApi, iscNotificationService, iscFormsValidationService ) {
      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain = window.createSuite( {
        $window     : $window,
        $compile    : $compile,
        $httpBackend: $httpBackend,
        $timeout    : $timeout,
        $rootScope  : $rootScope,

        iscFormDataApi           : iscFormDataApi,
        iscNotificationService   : iscNotificationService,
        iscFormsValidationService: iscFormsValidationService
      } );
      mockFormResponses( suiteMain.$httpBackend );

      // Create an isc-form to get what would normally be passed to isc-form-internal
      suiteForm = createDirective( getConfiguredForm(), {
        localFormConfig  : {},
        localButtonConfig: {}
      } );
      suiteMain.$httpBackend.flush();

      suiteInternal = createDirective( getInternalForm(), {
        formCtrl: suiteForm.controller
      } );

      suiteInternal.controller = suiteInternal.$isolateScope.formInternalCtrl;
    } ) );


    //--------------------
    it( 'should change section when the selector is changed', function() {
      var suite         = suiteInternal,
          subformConfig = suite.controller.mainFormConfig,
          model         = suite.controller.model,
          lastSection   = subformConfig.sections[4],
          value         = 'something';

      spyOn( subformConfig, 'selectSection' ).and.callThrough();

      expect( getSectionIndex() ).toEqual( 0 );
      subformConfig.selectSection( 1 );
      expect( getSectionIndex() ).toEqual( 1 );

      // Once the model has been updated, section 5 should become visible
      spyOn( suiteMain.iscFormDataApi, 'post' ).and.callThrough();

      expect( model.RequiredInput ).toBeUndefined();
      expect( lastSection._isHidden ).toBe( true );

      // Enter a value for RequiredInput
      getControlByName( suite, 'RequiredInput' )
        .val( value )
        .trigger( 'change' );
      digest( suite );

      expect( model.RequiredInput ).toEqual( value );
      expect( lastSection._isHidden ).toBe( false );
      // This form is configured to autosave on section change
      expect( suiteMain.iscFormDataApi.post ).not.toHaveBeenCalled();

      // Change section to trigger saving and cover section watches
      subformConfig.selectSection( 2 );
      digest( suite );
      expect( suiteMain.iscFormDataApi.post ).toHaveBeenCalled();


      function getSectionIndex() {
        return _.indexOf( subformConfig.selectableSections, subformConfig.currentSection );
      }
    } );
  } );
})();