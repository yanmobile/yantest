(function() {
  'use strict';

  //--------------------
  describe( 'iscFormsHelp', function() {
    var labels, helpIcon, helpContent,
        suite,
        html =
          '<isc-forms-help help-content="localHelpContent">' +
          '  <div class="label-class"></div>' +
          '</isc-forms-help>';

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

    beforeEach( inject( function( $compile, $timeout, $rootScope ) {
      suite = window.createSuite( {
        $compile: $compile,
        $timeout: $timeout,
        $scope  : $rootScope.$new()
      } );
    } ) );

    it( 'should not render a help icon if no help content is provided', function() {
      compile( {} );

      getElements();

      expect( labels.length ).toBe( 1 );
      expect( helpIcon.length ).toBe( 0 );
      expect( helpContent.length ).toBe( 0 );
    } );

    it( 'clicking the help icon should show the help content', function() {
      compile( {
        localHelpContent: "Example help content. This includes <a href='#something'>marked up text</a>."
      } );

      getElements();

      expect( labels.length ).toBe( 1 );
      expect( helpIcon.length ).toBe( 1 );
      expect( helpContent.length ).toBe( 1 );

      expect( suite.controller.showHelp ).toBe( false );

      suite.controller.toggleHelp();
      suite.$isolateScope.$digest();
      suite.$timeout.flush();

      getElements();

      expect( suite.controller.showHelp ).toBe( true );
    } );

    function getElements() {
      labels      = suite.element.find( '.label-class' );
      helpIcon    = suite.element.find( '.formly-help-icon' );
      helpContent = suite.element.find( '.formly-help-content' );
    }

    function compile( localScope ) {
      _.extend( suite.$scope, localScope );
      suite.element = suite.$compile( html )( suite.$scope );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();
      suite.controller    = suite.$isolateScope.helpCtrl;
    }
  } );
})();
