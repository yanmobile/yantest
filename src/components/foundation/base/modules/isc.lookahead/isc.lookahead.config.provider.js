( function() {
  'use strict';

  angular
    .module( 'isc.lookahead' )
    .provider( 'lookaheadConfig', lookaheadConfig );

  function lookaheadConfig() {
    var self = this;
    self.conf = {};

    return {
      setFormConfig    : function( value ) {
        self.conf.formConfig = value;
      },
      setTemplateConfig: function( value ) {
        self.conf.templateConfig = value;
      },
      $get             : function() {
        return self.conf;
      }
    };
  }
} )();
