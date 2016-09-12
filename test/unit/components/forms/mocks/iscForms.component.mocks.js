// Mock components
var mockApiHelper = {
  getUrl      : function( path ) {
    return path;
  },
  getConfigUrl: function( configProp ) {
    return configProp.path;
  }
};

var mockCustomConfigService = {
  getConfig       : function() {
    return customConfig;
  },
  getConfigSection: function( section ) {
    return _.get( customConfig, section, {} );
  }
};

function useDefaultFormsModules() {
  useDefaultModules( 'formly', 'isc.http', 'isc.forms', 'isc.templates', 'iscNavContainer',
    function( $provide ) {
      $provide.value( 'apiHelper', mockApiHelper );
      $provide.value( 'iscCustomConfigService', mockCustomConfigService );
    } );
}