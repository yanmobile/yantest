/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init( gulp, plugins, config, _, util ) {

  // --------------------------------
  // run all the tests
  // --------------------------------
  gulp.task( 'test', function( done ) {
    if ( _.has( config, 'app.modulePath' ) ) {
      // only running the tests that are related to the development being done
      return plugins.seq( 'test:app', done );
    } else {
      return plugins.seq( ['test:components', 'test:common'], done );
    }
  } );

  // --------------------------------
  // run all the tests
  // --------------------------------
  gulp.task( 'coverage', function( done ) {
    if ( config.app.modulePath ) {
      // separating out the coverage:app task because it has logic which which depends on the previous two coverages to finish first
      return plugins.seq( ['coverage:components', 'coverage:common'], 'coverage:app', done );
    } else {
      return plugins.seq( ['coverage:components', 'coverage:common'], done );
    }
  } );

}