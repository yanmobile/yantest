/**
 * Created by hzou on 3/3/16.
 */


var convert          = require( './i18n.xml.converter' );
var angularTranslate = require( 'gulp-angular-translate-extract' );
var mergeJson        = require( './plugins/merge-json' );
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

  gulp.task( 'i18nExtract', function(done) {

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

    extract( files, done );

  } );

  function extract( files, done ) {
    if ( !_.get( config, "app.dest.i18nExtract" ) ) {
      throw new Error( 'Missing config.app.js key: dest.i18nExtract' );
    }

    var domain = _.get( config, "app.module.assets.i18nDomain" );

    var json = gulp
      .src( files )
      .pipe( angularTranslate( {
        lang       : ['en-us'],
        customRegex: customRegex
      } ) )
      .pipe( gulp.dest( config.app.dest.i18nExtract ) )

      .pipe( plugins.filelog() );

    json.pipe( mergeJson( 'en-us' + '-greek-text.json', {
      parsers: {
        "*": function wrap( source, replacer, key, sourceParent, replacerParent ) {
          if ( _.isString( replacer ) ) {
            sourceParent[key] = ("英" + replacer + "文");
          }
        }
      }
    } ) )
      .pipe( gulp.dest( config.app.dest.i18nExtract ) )

      .pipe( plugins.filelog() );

    json.pipe( convert( { domain: domain } ) )
      .pipe( gulp.dest( config.app.dest.i18nXml ) )
      .pipe( plugins.filelog() );

    return done();
  }
}
