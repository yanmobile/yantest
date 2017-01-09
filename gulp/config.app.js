/**
 * This config.app.js is now responsible for aggregating the common and component configurations.
 *
 * This config file now has full power and can modify the contents of config.common.js and config.component.js.
 *
 * This is very powerful because individual application no longer needs to rely on gulpfile to create custom logic
 * to handle things like edition support, overrides (the existing approach still works). This config.app.js file
 * can now read multiple edition configs and update ```module.exports.component``` configuration directly.
 */

const _ = require( 'lodash' );

module.exports.masterConfig = {};
module.exports.common       = require( "./config.common" );
module.exports.component    = require( "../src/components/foundation/base/config.components" );
module.exports.app          = getAppConfig();

var appBasePath = "src/uifw-modules/"; // change this value to empty string for uifw-modules application

includeUiModules( module.exports.app.submoduleComponents );

/**
 * @Description
 * Automatically include components inside of uifw-modules as part of the applciation's gulp build process
 *
 * folder names inside of submodule, uifw-modules/src/modules, folder
 *  src/uifw-modules/src/app/modules/timeline
 *  src/uifw-modules/src/app/modules/inbox
 *  includeUiModules( ["timeline", "inbox"] );
 */
function includeUiModules( uiModuleNames ) {

  var configBasePath = `../${appBasePath || ''}src/app/modules/`;

  var masterDepConfig = readJson( `${configBasePath}build.json`, null );
  if ( masterDepConfig ) {
    _.forEach( uiModuleNames, injectDependencies );
  }

  _.forEach( uiModuleNames, injectModuleFiles );

  function injectDependencies( uiModuleName ) {
    var individualModuleConfig = readJson( `${configBasePath}${uiModuleName}/build.json`, {} );

    // For each peer dependency (uifw-module component), push to the uiModuleNames' array
    _.forEach( individualModuleConfig.peerDependencies, function( peer ) {
      // push peerDep into uiModuleNames array as we are looping through it via for each
      // as the array grows, the loop will visit the newly added item
      uiModuleNames.push( peer );
    } );

    _.forEach( individualModuleConfig.dependencies, function( dependency ) {
      recursivelyPrefixAppPath( masterDepConfig[dependency], appBasePath );
      _.mergeWith( module.exports.app, masterDepConfig[dependency], concatArrays );
    } );
  }

  function injectModuleFiles( uiModuleName ) {
    var uiModulePath = `${appBasePath}src/app/modules/${uiModuleName}/`;
    module.exports.app.module.modules.unshift( uiModulePath + "**/*.module.js" );
    module.exports.app.module.js.unshift( uiModulePath + "**/*.js" );
    module.exports.app.module.scssInjectSrc.unshift( uiModulePath + "**/*.scss" ); //scss files are auto injected to have access to vars and mixins
    module.exports.app.module.html.unshift( uiModulePath + "**/*.html" );
    module.exports.app.module.assets.images.unshift( uiModulePath + "/assets/images/**/*" );
    module.exports.app.module.assets.FDN.unshift( uiModulePath + "/assets/FDN/**/*" );
  }

  function concatArrays( a, b ) {
    if ( _.isArray( a ) ) {
      return a.concat( b );
    }
  }

  /**
   * @Description
   *
   * This recursive function will automatically prefix "src/uifw-modules/" to each and every string value in the object.
   * It assumes the contents of the arrays are strings
   *
   * see jsbin link with runnable a example: http://jsbin.com/vasuzoxaza/1/edit?js,console
   *
   * @Examples:
   * var source = {
   *  "angular-cookies": {
   *    "module": {
   *      "modules": [
   *        "src/app/modules/app.module.js",
   *        "src/app/modules/admin.user/admin.user.module.js"
   *      ],
   *      "js": [],
   *      "scss": [],
   *      "scssInjectSrc": [],
   *      "html": "hello/world.html"
   *    }
   *  }
   * }
   *
   * var output = {
   *  "angular-cookies": {
   *    "module": {
   *      "modules": [
   *        "src/uifw-modules/src/app/modules/app.module.js",
   *        "src/uifw-modules/src/app/modules/admin.user/admin.user.module.js"
   *      ],
   *      "js": [],
   *      "scss": [],
   *      "scssInjectSrc": [],
   *      "html": "src/uifw-modules/hello/world.html"
   *    }
   *  }
   * }
   *
   */
  function recursivelyPrefixAppPath( config, prefix, level ) {
    level = level || 0;
    if ( level > 15 ) {
      throw new Error( 'More than 15 levels of recursion are not supported. This is an indication of infinite recursion caused by circular reference.' );
    }

    if ( _.isString( config ) ) {
      return prefix + config;
    } else if ( _.isArray( config ) ) {
      return _.map( config, function( value ) {
        return recursivelyPrefixAppPath( value, prefix, level + 1 );
      } );
    }

    _.forEach( config, function( value, nestedKey ) {
      config[nestedKey] = recursivelyPrefixAppPath( value, prefix, level + 1 );
    } );
    return config;
  }

}

function getAppConfig() {
  return {
    "modulePath"         : "src/app/modules/",
    "submoduleComponents": [], //Simply include the module folder name. For example: ["timeline", "inbox", "admin.user"]
    "customer"           : {
      "assets": {
        "i18n": [  //order matters
          // The default algorithm is "replace". In order to specify "merge", be sure to add "_UifwMergeAlgorithm" : "merge"' as a property in the json files.
          "customer/assets/i18n/**/*.json"
        ],
        "FDN" : [
          // The default algorithm is "replace". In order to specify "merge", be sure to add "_UifwMergeAlgorithm" : "merge"' as a property in the json files.
          "customer/assets/FDN/**/*.json"
        ]
      }
    },
    "vendor"             : {
      "js"   : [
        'src/app/node_modules/angular-http-backup/dist/httpbackup.js'
      ],
      "mocks": [],
      "fonts": []
    },
    "module"             : {
      "modules"      : [
        "src/app/modules/**/app.module.js",
        "src/app/modules/**/*.module.js"
      ],
      "js"           : [
        "src/app/modules/**/*.js"
      ],
      "scss"         : [
        "src/app/assets/sass/main.scss"
      ],
      "scssInjectSrc": [
        // uncomment this following line if you want to dynamically inject scss files inside of modules folder into your main.scss file
        "src/app/modules/**/*.scss"
      ],
      "html"         : [
        "src/app/modules/**/*.html"
      ],
      "assets"       : {
        "FDN"              : [  //order matters
          "src/app/assets/FDN/**/*.json"
        ],
        "i18n"             : [  //order matters
          "src/app/assets/i18n/**/*.json"
        ],
        "comments"         : "i18nDomain value will be used as a part of the generated i18n XML",
        "i18nDomain"       : "hs-temp-app-scaffold",
        // for specifying a filename prefix that should be project-specific
        "i18nXmlFilePrefix": "",
        "mocks"            : [
          "src/app/assets/mockData/**"
        ],
        "images"           : [
          "src/app/assets/images/**/*"
        ],
        "vendor"           : {
          "js": []
        }
      },
      "mocks"        : [
        "test/unit/app/appUnitTestMocks.js"
      ],
      "tests"        : [
        "test/unit/app/**/*.test.js",
        "test/unit/app/**/*Tests.js"
      ]
    },
    "dest"               : {
      "folder"       : "www",
      "comments"     : "i18nXml is used for specifying destination location of converted i18n files",
      "fdn"          : "www/assets/FDN/",
      "i18n"         : "www/assets/i18n/",
      "i18nXml"      : "isc-tools/localize",
      "i18nExtract"  : "isc-tools/i18nExtract",
      // for specifying which files are to be copied over.
      // Since development only uses "en-us.json", no need t// o update the gulp task to account for
      // multiple translation files: e.g. "en-us.json", "en-uk.json" and "en.json".
      "i18nXmlFilter": "**/en-us.xml"
    },
    "cordova"            : false,
    "excludeConfig"      : "!src/app/modules/app.config.js",
    "edition"            : [
      {
        "name": "base",
        "path": "src/components/foundation/base/config.components.js"
      }
    ],
    // JavaScript files can't be overridden like css selector cascading or Angular's templateCache templates.
    // If we want to override lower level JS files, we must exclude them from the list.
    // The overrides below are used to exclude base files by specifying glob patterns.
    // e.g. ```common: ['!src/modules/isc.filters/myFilter.js']```
    // update: common and components config can now be directly modified by this file.
    "overrides"          : {
      "js"      : {
        "common"    : [],
        "components": []
      },
      "comments": "Used to exclude files in common/component. e.g. ```common: ['!src/modules/isc.filters/myFilter.html']```",
      "html"    : {
        "common"    : [],
        "components": []
      }
    }
  };
}

/**
 * Reads the json file and returns its content. If the file is not found, it will return defaults or {}
 *
 * @param filePath
 * @returns {*}
 */
function readJson( filePath, defaults ) {
  var path = require( 'path' );
  var fs   = require( 'fs' );
  var json = defaults;
  filePath = path.join( __dirname, filePath );

  if ( fs.existsSync( filePath ) ) {
    json = require( filePath );
  }

  return json;
}
