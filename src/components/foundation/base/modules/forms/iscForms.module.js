( function() {
  'use strict';

  angular.module( 'isc.forms', ['ui.router', 'isc.states'] )
    .run( function( iscFormlyFoundationTemplates ) {
      iscFormlyFoundationTemplates.init();
    } );

} )();
