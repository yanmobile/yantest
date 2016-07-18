'use strict';

var gulp       = require( 'gulp' );
var _          = require( 'lodash' );
var requiredir = require( 'require-dir' );

var plugins = {
  plumber      : require( 'gulp-plumber' ),
  chmod        : require( 'gulp-chmod' ), //changes file permissions, used by imagemin
  concat       : require( 'gulp-concat' ),  //concatenating multiple files into 1
  cssmin       : require( 'gulp-cssmin' ),  //minifies css
  dateFormat   : require( 'dateformat' ),
  del          : require( 'del' ),  //deleting folders/files
  es           : require( 'event-stream' ),
  exec         : require( 'child_process' ).exec,
  execSync     : require( 'child_process' ).execSync,
  filelog      : require( 'gulp-filelog' ), //used for logging files in the pipe to the console
  fs           : require( 'fs' ), //file system
  imagemin     : require( 'gulp-imagemin' ),  //used by pngCrush
  jscs         : require( 'gulp-jscs' ),  //javascript coding styles
  jshint       : require( 'gulp-jshint' ),  //js linting
  stylish      : require( 'gulp-jscs-stylish' ),  //js linting
  karma        : require( 'karma' ).server, //unit test runner
  mobilizer    : require( 'gulp-mobilizer' ), //?
  ngAnnotate   : require( 'gulp-ng-annotate' ), //adding ngAnnotate
  path         : require( 'path' ),
  pngcrush     : require( 'imagemin-pngcrush' ),  //img resizer
  rename       : require( 'gulp-rename' ),  //rename files
  replace      : require( 'gulp-replace' ),
  sass         : require( 'gulp-sass' ), //sass => css
  seq          : require( 'run-sequence' ), //run tasks in parallel
  size         : require( 'gulp-size' ),  //output file size
  sourcemaps   : require( 'gulp-sourcemaps' ),  //generate sourcemaps
  templateCache: require( 'gulp-angular-templatecache' ),
  uglify       : require( 'gulp-uglify' ),  //minify/uglify
  bytediff     : require( 'gulp-bytediff' ),  //tells the file size before and after a gulp operation
  inject       : require( 'gulp-inject' ) // used for injecting scripts
};

var util = {
  getArg         : getArg,
  readJson       : readJson,
  readdir        : readdir,
  fixRelativePath: fixRelativePath
};

var customAppJsonPath = getArg( "--appjson" );
customAppJsonPath     = fixRelativePath( customAppJsonPath );

//if user provided custom appconfig path in the commandline, use it. 
//else use the default config.app path
//if config files don't exist, it means this is running as standalone hs-core-ui project without hs-core-app-scaffold context
//  then use framework's config.
var defaultAppConfigPath = './gulp/config.app.js';
var frameworkJsonConfig  = require( './gulp/config.framework.js' );
var configs              = readJson( (customAppJsonPath || defaultAppConfigPath), frameworkJsonConfig );

_.forEach( configs.app.edition, function( edition ) {
  var editionContent;
  edition.path          = fixRelativePath( edition.path );
  editionContent        = require( edition.path );
  configs[edition.name] = editionContent;
  _.mergeWith( configs.component, editionContent, concatArrays );
} );

//masterConfig is a superset of common, component, and app
_.mergeWith( configs.masterConfig, configs.common, configs.component, configs.app, concatArrays );


/*========================================
 =           gulp tasks                =
 ========================================*/
gulp.task( 'default', ['clean'], function() {
  gulp.start( 'build' );
} );

initTasksInGulpFolder();

/*========================================
 =                 funcs                 =
 ========================================*/
/**
 * @description
 *  For each task inside "gulp/" folder, initialize/register the task
 */
function initTasksInGulpFolder() {
  var tasksInGulpFolder = _.extend( {}, requiredir( './gulp/' ), readdir( './gulp/custom/' ) );

  _.forEach( tasksInGulpFolder, initTask );
  function initTask( task, name ) {
    if ( typeof task.init === "function" ) {
      task.init( gulp, plugins, configs, _, util );
    }
  }
}

/**
 * @description
 * This function finds the value of command line parameters regardless their location or their appearance order
 * for example: gulp script --config /tmp/app.config.js
 * getArg("--config") // => /tmp/app.config.js
 * @param key
 * @returns {*}
 */
function getArg( key ) {
  var index = process.argv.indexOf( key );
  var next  = process.argv[index + 1];
  return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}

/**
 * Reads the json file and returns its content. If the file is not found, it will return defaults or {}
 *
 * @param filePath
 * @returns {*}
 */
function readJson( filePath, defaults ) {
  var json;
  try {
    filePath = plugins.path.join( __dirname, filePath );
    json     = require( filePath );
  } catch ( ex ) {
    console.log( 'file not found:', ex );
    json = defaults || {};
  }
  return json;
}

/**
 * Reads the folder and returns its content. If the folder is not found, it will return defaults or {}
 *
 * @param dirPath
 * @returns {*}
 */
function readdir( dirPath, defaults ) {
  var json;
  try {
    dirPath = plugins.path.join( dirPath );
    plugins.fs.readdirSync( dirPath );
    //if it doesn't throw, the use requiredir
    json = requiredir( dirPath );
  } catch ( ex ) {
    json = defaults || {};
  }
  return json;
}
/**
 * Used by mergeWith to concat []s instead of replace the entire array
 * @param a
 * @param b
 * @returns {*|string|Array.<T>}
 */
function concatArrays( a, b ) {
  if ( _.isArray( a ) ) {
    return a.concat( b );
  }
}

/**
 * @describe if not absolute path and not relative path. e.g., foo/bar/app.config
 *  prefix the path with "./" to make it relative. e.g., ./foo/bar/app.config
 * @param path
 * @returns {*}
 */
function fixRelativePath( path ) {
  var retPath = path;
  if ( path && !path.startsWith( '/' ) && !path.startsWith( '.' ) ) {
    //append "./" to make it "./foo/bar/app.config"
    retPath = "./" + retPath;
  }
  return retPath;
}