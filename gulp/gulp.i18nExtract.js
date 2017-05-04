/**
 * Created by hzou on 3/3/16.
 */


var convert          = require( './i18n.xml.converter' );
var angularTranslate = require( 'gulp-angular-translate-extract' );
var gulpMergeJson    = require( 'gulp-merge-json' );
var mergeJson        = require( './plugins/merge-json' );
var extractFdnProps  = require( './plugins/extract-fdn-props' );
var path             = require( 'path' );
module.exports       = {
  init: init
};

function init( gulp, plugins, config, _ ) {
  var anySpace                      = '\\s*';  //0 or more spaces
  var pipex2                        = '\\|\\|'; //two pipes
  var anything                      = '.+';  //1 or more non-space chars
  var captureAnythingInSingleQuotes = `'([^']*)'`; //in single quotes
  var captureAnythingInDblQuotes    = `"([^"]*)"`; //in single quotes
  //tests: "{{ ( "
  //tests: "{{ "
  var leftMustache = '\\{\\{\\s*\\(?\\s*';
  //tests: " ) | translate }}"
  //tests: " | translate }}"
  var pipeTranslateWithRightMustache = '\\s*\\)?\\s*\\|\\s*translate\\s*\\}\\}';

  var generatedI18nFiles = [
    path.join( _.get( config, 'app.dest.i18nExtract', '' ), 'en-us.lang.json' ),
    path.join( _.get( config, 'app.dest.i18nExtract', '' ), 'en-us.fdn.json' )
  ];


  var customRegex = {
    // {{ ($ctrl.condition || "my translation") | translate }} #html
    // {{ $ctrl.condition || "my translation" | translate }} #html
    // REGEX: `\\{\\{\\s*\\(?["'](.+)["']\\s*\\|\\|\\s*.+\\)?\\s*\\|\\s*translate\\s*\\}\\}`,
    HtmlWithDoubleStart      : `${leftMustache}${captureAnythingInDblQuotes}${anySpace}${pipex2}${anySpace}${anything}${pipeTranslateWithRightMustache}`,
    HtmlWithDoubleStartSingle: `${leftMustache}${captureAnythingInSingleQuotes}${anySpace}${pipex2}${anySpace}${anything}${pipeTranslateWithRightMustache}`,

    // {{ ("my translation" || $ctrl.condition) | translate }}
    // {{ "my translation" || $ctrl.condition | translate }}
    // REGEX: `\\{\\{\\s*\\(?\\s*.+\\s*\\|\\|\\s*["'](.+)["']\\s*\\)?\\s*\\|\\s*translate\\s*\\}\\}`,
    HtmlWithDoubleEnd      : `${leftMustache}${anything}${anySpace}${pipex2}${anySpace}${captureAnythingInDblQuotes}${pipeTranslateWithRightMustache}`,
    HtmlWithDoubleEndSingle: `${leftMustache}${anything}${anySpace}${pipex2}${anySpace}${captureAnythingInSingleQuotes}${pipeTranslateWithRightMustache}`,

    // {{ (foo ? "bar" : baz) | translate }}
    // {{ foo ? "bar" : baz | translate }}
    // REGEX: `\\{\\{\\s*\\(?\\s*.+\\s*\\?\\s*.+\\s*\\:\\s*["'](.+)["']\\s*\\)?\\s*\\|\\s*translate\\s`,
    HtmlTertiaryStart      : `${leftMustache}${anything}${anySpace}\\?${anySpace}${anything}${anySpace}\\:${anySpace}${captureAnythingInDblQuotes}${pipeTranslateWithRightMustache}`,
    HtmlTertiaryStartSingle: `${leftMustache}${anything}${anySpace}\\?${anySpace}${anything}${anySpace}\\:${anySpace}${captureAnythingInSingleQuotes}${pipeTranslateWithRightMustache}`,

    // {{ (foo ? bar : "baz") | translate }}
    // {{ foo ? bar : "baz" | translate }}
    // REGEX: `\\{\\{\\s*\\(?\\s*.+\\s*\\?\\s*["'](.+)["']\\s*\\:\\s*.+\\s*\\)?\\s*\\|\\s*translate\\s`,
    HtmlTertiaryEnd      : `${leftMustache}${anything}${anySpace}\\?${anySpace}${captureAnythingInDblQuotes}${anySpace}\\:${anySpace}${anything}${pipeTranslateWithRightMustache}`,
    HtmlTertiaryEndSingle: `${leftMustache}${anything}${anySpace}\\?${anySpace}${captureAnythingInSingleQuotes}${anySpace}\\:${anySpace}${anything}${pipeTranslateWithRightMustache}`,

    // translation: "Patient Page"  #used by state config
    // REGEX: `\\s*translationKey\\s*:\\s*['"](.+)['"]`
    AngularStateConfigTranslationKey      : `${anySpace}translationKey${anySpace}:${anySpace}${captureAnythingInDblQuotes}`,
    AngularStateConfigTranslationKeySingle: `${anySpace}translationKey${anySpace}:${anySpace}${captureAnythingInSingleQuotes}`,

    // translation: config-item-translation-key="my literal"
    // REGEX: `\\s*config-item-translation-key\=['"](.+)['"]`
    HtmlConfigItemConfigKey      : `${anySpace}config-item-translation-key\=${captureAnythingInDblQuotes}`,
    HtmlConfigItemConfigKeySingle: `${anySpace}config-item-translation-key\=${captureAnythingInSingleQuotes}`

  };

  // Scrape templates and js files
  gulp.task( 'i18nExtract:extractFiles', function( done ) {
    var files = _.concat(
      config.common.module.modules,
      config.common.module.js,
      config.common.module.html,
      config.component.module.modules,
      config.component.module.js,
      config.component.module.html,
      config.app.module.modules,
      config.app.module.js,
      config.app.module.html,
      "!**/svg/*.html" );

    return gulp
      .src( files )
      .pipe( angularTranslate( {
        lang       : ['en-us'],
        suffix     : '.lang.json',
        customRegex: customRegex
      } ) )
      .pipe( gulp.dest( config.app.dest.i18nExtract ) )
    // .pipe( plugins.filelog() );
  } );

  // Scrape FDN assets
  gulp.task( 'i18nExtract:extractFdn', function( done ) {
    var fdn = _.compact( _.concat(
      config.common.module.assets.FDN,
      config.component.module.assets.FDN,
      config.app.module.assets.FDN ) );

    return gulp
      .src( fdn )
      .pipe( extractFdnProps( {
        lang  : 'en-us',
        suffix: '.fdn.json'
      } ) )
      .pipe( gulp.dest( config.app.dest.i18nExtract ) )
    // .pipe( plugins.filelog() );
  } );

  gulp.task( 'i18nExtract:combine', function( done ) {
    var domain = _.get( config, "app.module.assets.i18nDomain" );

    // Combine generated files
    var json = gulp
      .src( generatedI18nFiles )
      .pipe( gulpMergeJson( 'en-us.json' ) )
      .pipe( gulp.dest( config.app.dest.i18nExtract ) )
    // .pipe( plugins.filelog() );

    // Generate xml version
    json
      .pipe( convert( { domain: domain } ) )
      .pipe( gulp.dest( config.app.dest.i18nXml ) )
    // .pipe( plugins.filelog() );

    // Generate greek-text version
    return json
      .pipe( mergeJson( 'en-us' + '-greek-text.json', {
        parsers: {
          "*": function wrap( source, replacer, key, sourceParent, replacerParent ) {
            if ( _.isString( replacer ) ) {
              sourceParent[key] = ("英" + replacer + "文");
            }
          }
        }
      } ) )
      .pipe( gulp.dest( config.app.dest.i18nExtract ) )
    // .pipe( plugins.filelog() );
  } );

  gulp.task( 'i18nExtract:clean', function( done ) {
    // Delete temp files
    plugins.del( generatedI18nFiles );

    return done();
  } );

  return gulp.task( 'i18nExtract', function( done ) {
    if ( !_.get( config, "app.dest.i18nExtract" ) ) {
      throw new Error( 'Missing config.app.js key: dest.i18nExtract' );
    }

    return plugins.seq(
      ['i18nExtract:extractFiles', 'i18nExtract:extractFdn'],
      'i18nExtract:combine',
      'i18nExtract:clean',
      done );
  } );
}
