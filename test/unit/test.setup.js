/**
 * Created by hzou on 6/21/16.
 */
(function() {

  var suite; //used by individual test files via window.createSuite();

  window.cleanup                       = cleanup;
  window.fixFoundationBug              = fixFoundationBug;
  window.createSuite                   = createSuite;
  window.useDefaultModules             = useDefaultModules;
  window.useDefaultTranslateBeforeEach = useDefaultTranslateBeforeEach;
  function createSuite( obj ) {
    suite = obj || {};
    return suite;
  }

  afterEach( function() {
    cleanup();
  } );

  window.mock$log = {
    log  : _.noop,
    info : _.noop,
    warn : _.noop,
    error: _.noop,
    debug: _.noop,
    logFn: _.noop
  };

  function cleanup() {
    if ( !_.isNil( suite ) ) {
      _.forEach( suite, function( val, key ) {
        _.result( val, "remove" );
        _.result( val, "$destroy" );
        delete suite[key];
      } );
    }
  }

  function fixFoundationBug() {
    // error happens when foundation.css is not included (which is the case for unit tests)
    // TypeError: 'null' is not an object (evaluating 'mediaQueries[key].replace')
    var styleEl = document.createElement( 'style' ),
        styleSheet;

    // Append style element to head
    document.head.appendChild( styleEl );
    styleSheet = styleEl.sheet;
    styleSheet.insertRule( 'meta.foundation-mq { font-family: "small=&medium=&large=&xlarge=&xxlarge="; }', 0 );

  }

  function useDefaultTranslateBeforeEach() {
    beforeEach( module( 'pascalprecht.translate', function( $translateProvider ) {

      //adding sanitize strategy to get rid of the pesky warnings
      $translateProvider.useSanitizeValueStrategy( null );
    } ) );
  }

  function useDefaultModules() {

    useDefaultTranslateBeforeEach();

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider, $provide ) {
      devlogProvider.loadConfig( customConfig );

      // show $log statements
      $provide.value( '$log', mock$log );

    } ) );

    var moduleNames = _.toArray( arguments );
    // moduleNames.forEach( function( moduleName ) {
    beforeEach( module.apply( module, moduleNames ) );
    // } );

  }

})();