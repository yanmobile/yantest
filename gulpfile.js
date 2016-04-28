'use strict';

var gulp = require('gulp');
var _    = require('lodash');

var plugins = {
  chmod        : require('gulp-chmod'), //changes file permissions, used by imagemin
  concat       : require('gulp-concat'),  //concatenating multiple files into 1
  cssmin       : require('gulp-cssmin'),  //minifies css
  dateFormat   : require('dateformat'),
  del          : require('del'),  //deleting folders/files
  es           : require('event-stream'),
  exec         : require('child_process').exec,
  execSync     : require('child_process').execSync,
  filelog      : require('gulp-filelog'), //used for logging files in the pipe to the console
  fs           : require('fs'), //file system
  imagemin     : require('gulp-imagemin'),  //used by pngCrush
  jscs         : require('gulp-jscs'),  //javascript coding styles
  jshint       : require('gulp-jshint'),  //js linting
  karma        : require('karma').server, //unit test runner
  mobilizer    : require('gulp-mobilizer'), //?
  ngAnnotate   : require('gulp-ng-annotate'), //adding ngAnnotate
  path         : require('path'),
  pngcrush     : require('imagemin-pngcrush'),  //img resizer
  rename       : require('gulp-rename'),  //rename files
  replace      : require('gulp-replace'),
  sass         : require('gulp-sass'), //sass => css
  seq          : require('run-sequence'), //run tasks in parallel
  size         : require('gulp-size'),  //output file size
  sourcemaps   : require('gulp-sourcemaps'),  //generate sourcemaps
  templateCache: require('gulp-angular-templatecache'),
  uglify       : require('gulp-uglify'),  //minify/uglify
  bytediff     : require('gulp-bytediff'),  //tells the file size before and after a gulp operation
  inject       : require('gulp-inject') // used for injecting scripts
};

var util = {
  getArg         : getArg,
  readJson       : readJson,
  fixRelativePath: fixRelativePath
};

var appjson = getArg("--appjson");
appjson     = fixRelativePath(appjson);

var configs = {
  app         : readJson((appjson || './gulp/app.json'), {
    edition: [{
      "name": "base",
      "path": "src/components/foundation/base/components.json"
    }]
  }),
  component   : {}, //specified in app.json/editions
  common      : require('./gulp/common.json'),
  masterConfig: {} //aggregated config of app/components/common
};

_.forEach(configs.app.edition, function (edition) {
  var editionContent;
  edition.path          = fixRelativePath(edition.path);
  editionContent        = require(edition.path);
  configs[edition.name] = editionContent;
  _.mergeWith(configs.component, editionContent, concatArrays);
});

//masterConfig is a superset of common, component, and app
_.mergeWith(configs.masterConfig, configs.common, configs.component, configs.app, concatArrays);


/*========================================
 =           gulp tasks                =
 ========================================*/
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

initTasksInGulpFolder();

/*========================================
 =                 funcs                 =
 ========================================*/
/**
 * @description
 *  For each task inside "gulp/" folder, initialize/register the task
 */
function initTasksInGulpFolder() {
  var tasksInGulpFolder = require('require-dir')('./gulp/');

  _.forEach(tasksInGulpFolder, initTask);


  function initTask(task, name) {
    if (typeof task.init === "function") {
      task.init(gulp, plugins, configs, _, util);
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
function getArg(key) {
  var index = process.argv.indexOf(key);
  var next  = process.argv[index + 1];
  return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}

/**
 * Reads the json file and returns its content. If the file is not found, it will return defaults or {}
 *
 * @param filePath
 * @returns {*}
 */
function readJson(filePath, defaults) {
  var json;
  try {
    filePath = plugins.path.join(filePath);
    json     = plugins.fs.readFileSync(filePath, 'utf8');
    json     = JSON.parse(json);
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
function concatArrays(a, b) {
  if (_.isArray(a)) {
    return a.concat(b);
  }
}

/**
 * @describe if not absolute path and not relative path. e.g., foo/bar/app.config
 *  prefix the path with "./" to make it relative. e.g., ./foo/bar/app.config
 * @param path
 * @returns {*}
 */
function fixRelativePath(path) {
  var retPath = path;
  if (path && !path.startsWith('/') && !path.startsWith('.')) {
    //append "./" to make it "./foo/bar/app.config"
    retPath = "./" + retPath;
  }
  return retPath;
}