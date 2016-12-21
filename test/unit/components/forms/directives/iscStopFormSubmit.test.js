(function() {
  'use strict';

  //--------------------
  describe( 'iscStopFormSubmit', function() {
    var suiteForm,
        suiteInternal,
        suiteSubform;

    var fdn = {
      "sections": [
        {
          "fields": [
            {
              "key" : "myInput",
              "type": "input"
            },
            {
              "key" : "myTextarea",
              "type": "textarea"
            }
          ]
        }
      ]
    };

    var html = "<isc-form form-config='localFormConfig' form-key='myFormKey'></isc-form>";

    var formConfig = {
      formLiteral: fdn
    };

    window.useDefaultTranslateBeforeEach();

    useDefaultFormsModules();

    beforeEach( module(
      'foundation', 'isc.authorization', 'isc.notification', 'isc.directives',
      function( $provide, devlogProvider ) {
        devlogProvider.loadConfig( mockCustomConfigService.getConfig() );
      } )
    );

    beforeEach( inject( function( $rootScope, $compile, $window, $httpBackend, $timeout,
      formlyApiCheck, formlyConfig, keyCode,
      iscFormDataApi, iscNotificationService, iscFormsValidationService ) {
      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain = window.createSuite( {
        $window     : $window,
        $compile    : $compile,
        $httpBackend: $httpBackend,
        $timeout    : $timeout,
        $rootScope  : $rootScope,

        keyCode                  : keyCode,
        iscFormDataApi           : iscFormDataApi,
        iscNotificationService   : iscNotificationService,
        iscFormsValidationService: iscFormsValidationService
      } );

      mockFormResponses( suiteMain.$httpBackend );
    } ) );


    //--------------------
    it( 'should not call the submit API when enter is pressed', function() {
      createDirectives();

      var suite             = suiteInternal,
          input             = suite.element.find( 'input' ),
          textarea          = suite.element.find( 'textarea' ),
          theForm           = suiteForm.element.find( 'form' ),
          localButtonConfig = getButtonConfig( suiteForm );

      spyOn( localButtonConfig.buttons.submit, 'onClick' ).and.callThrough();

      expect( input.length ).toBe( 1 );
      expect( textarea.length ).toBe( 1 );
      expect( theForm.length ).toBe( 1 );

      wireKeypress(input);
      wireKeypress(textarea);

      // Sending Enter should not call the submit API
      input.sendKeypress(suiteMain.keyCode.ENTER);
      textarea.sendKeypress(suiteMain.keyCode.ENTER);

      suite.$scope.$digest();

      expect( localButtonConfig.buttons.submit.onClick ).not.toHaveBeenCalled();

      // Only submitting the form should call the submit API
      theForm.triggerHandler( 'submit' );

      expect( localButtonConfig.buttons.submit.onClick ).toHaveBeenCalled();

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
    } );

    function createDirectives() {
      suiteForm = createDirective( html, {
        localFormConfig: formConfig
      } );
      suiteForm.$scope.$digest();

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