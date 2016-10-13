/**
 * Created by hzou on 3/3/16.
 */


var angularTranslate = require('gulp-angular-translate-extract');

module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  var anySpace = '\\s*';  //0 or more spaces
  var pipex2 = '\\|\\|'; //two pipes
  var anything = '.+';  //1 or more non-space chars
  var captureAnythingInQuotes = `["'](${anything})["']`; //in single or double quotes
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
    HtmlWithDoubleStart: `${leftMustache}${captureAnythingInQuotes}${anySpace}${pipex2}${anySpace}${anything}${pipeTranslateWithRightMustache}`,

    // {{ ("my translation" || $ctrl.condition) | translate }}
    // {{ "my translation" || $ctrl.condition | translate }}
    // REGEX: `\\{\\{\\s*\\(?\\s*.+\\s*\\|\\|\\s*["'](.+)["']\\s*\\)?\\s*\\|\\s*translate\\s*\\}\\}`,
    HtmlWithDoubleEnd: `${leftMustache}${anything}${anySpace}${pipex2}${anySpace}${captureAnythingInQuotes}${pipeTranslateWithRightMustache}`,

    // {{ (foo ? "bar" : baz) | translate }}
    // {{ foo ? "bar" : baz | translate }}
    // REGEX: `\\{\\{\\s*\\(?\\s*.+\\s*\\?\\s*.+\\s*\\:\\s*["'](.+)["']\\s*\\)?\\s*\\|\\s*translate\\s`,
    HtmlTertiaryStart: `${leftMustache}${anything}${anySpace}\\?${anySpace}${anything}${anySpace}\\:${anySpace}${captureAnythingInQuotes}${pipeTranslateWithRightMustache}`,

    // {{ (foo ? bar : "baz") | translate }}
    // {{ foo ? bar : "baz" | translate }}
    // REGEX: `\\{\\{\\s*\\(?\\s*.+\\s*\\?\\s*["'](.+)["']\\s*\\:\\s*.+\\s*\\)?\\s*\\|\\s*translate\\s`,
    HtmlTertiaryEnd: `${leftMustache}${anything}${anySpace}\\?${anySpace}${captureAnythingInQuotes}${anySpace}\\:${anySpace}${anything}${pipeTranslateWithRightMustache}`,

    // translation: "Patient Page"  #used by state config
    // REGEX: `\\s*translationKey\\s*:\\s*['"](.+)['"]`
    AngularStateConfigTranslationKey: `${anySpace}translationKey${anySpace}:${anySpace}${captureAnythingInQuotes}`
  };

  gulp.task('i18nExtract:common', function () {

    var files = _.concat(
      config.common.module.modules, config.common.module.js,
      config.common.module.html,
      "!**/svg/*.html");

    return extract(files, "-common");

  });

  gulp.task('i18nExtract:components', function () {

    var files = _.concat(
      config.component.module.modules, config.component.module.js,
      config.component.module.html,
      "!**/svg/*.html");

    return extract(files, "-components");

  });

  gulp.task('i18nExtract:app', function () {

    var files = _.concat(
      config.app.module.modules, config.app.module.js,
      config.app.module.html,
      "!**/svg/*.html");

    return extract(files, "-app");

  });


  gulp.task('i18nExtract', function () {

    return    plugins.seq(["i18nExtract:common", "i18nExtract:components", "i18nExtract:app"]);

  });

  function extract(files, suffix){
    if( !_.get( config, "app.dest.i18nExtract" ) ){
      throw new Error( 'Missing config.app.js key: dest.i18nExtract' );
    }

    suffix = suffix || "";
    return gulp
      .src(files)
      .pipe(angularTranslate({
        lang: ['en-us'+suffix],
        customRegex: customRegex
      }))
      .pipe(gulp.dest(config.app.dest.i18nExtract))
      .pipe(plugins.filelog());
  }
}
