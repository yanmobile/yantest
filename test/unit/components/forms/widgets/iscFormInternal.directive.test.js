(function() {
  'use strict';

  //--------------------
  describe( 'iscFormInternal', function() {
    var suiteForm,
        suiteInternal;

    window.useDefaultTranslateBeforeEach();

    beforeEach( module(
      'formly', 'foundation',
      'isc.http', 'isc.forms', 'iscNavContainer', 'isc.authorization', 'isc.notification', 'isc.directives',
      'isc.templates',
      function( $provide, devlogProvider ) {
        $provide.value( '$log', console );
        $provide.value( 'apiHelper', mockApiHelper );
        $provide.value( 'iscCustomConfigService', mockCustomConfigService );
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

        formDataApi        : iscFormDataApi,
        notificationService: iscNotificationService,
        validationService  : iscFormsValidationService
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
    it( 'should change page when the selector is changed', function() {
      var suite         = suiteInternal,
          subformConfig = suite.controller.multiConfig,
          model         = suite.controller.model,
          lastPage      = subformConfig.pages[4],
          value         = 'something';

      spyOn( subformConfig, 'selectPage' ).and.callThrough();

      expect( getPageIndex() ).toEqual( 0 );
      subformConfig.selectPage( 1 );
      expect( getPageIndex() ).toEqual( 1 );

      // Once the model has been updated, page 5 should become visible
      spyOn( suiteMain.formDataApi, 'post' ).and.callThrough();

      expect( model.RequiredInput ).toBeUndefined();
      expect( lastPage._isHidden ).toBe( true );

      // Enter a value for RequiredInput
      getControlByName( suite, 'RequiredInput' )
        .val( value )
        .trigger( 'change' );
      digest( suite );

      expect( model.RequiredInput ).toEqual( value );
      expect( lastPage._isHidden ).toBe( false );
      // This form is configured to autosave on page change
      expect( suiteMain.formDataApi.post ).not.toHaveBeenCalled();

      // Change page to trigger saving and cover page watches
      subformConfig.selectPage( 2 );
      digest( suite );
      expect( suiteMain.formDataApi.post ).toHaveBeenCalled();


      function getPageIndex() {
        return _.indexOf( subformConfig.selectablePages, subformConfig.currentPage );
      }
    } );
  } );
})();