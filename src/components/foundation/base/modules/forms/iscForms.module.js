( function() {
  'use strict';

  angular.module( 'isc.forms', ['ui.router', 'isc.states'] )
    .run( function( formlyApiCheck, formlyConfig, iscFormlyFoundationTemplates ) {
      configureFormly();
      iscFormlyFoundationTemplates.init();

      // Global configuration changes needed for angular-formly
      function configureFormly() {
        // Disable formly's api-check
        formlyApiCheck.config.disabled = true;

        // Works around https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164
        // See http://docs.angular-formly.com/docs/formlyconfig#extras
        formlyConfig.extras.removeChromeAutoComplete = true;
      }
    } );

} )();
