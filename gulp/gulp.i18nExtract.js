/**
 * Created by hzou on 3/3/16.
 */


var angularTranslate = require('gulp-angular-translate-extract');

module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  var customRegex = {
      // {{ ($ctrl.condition || "my translation") | translate }} #html
      // {{ $ctrl.condition || "my translation" | translate }} #html
      HtmlWithDoubleStart: `\\{\\{\\s*\\(?["'](.+)["']\\s*\\|\\|\\s*.+\\)?\\s*\\|\\s*translate\\s*\\}\\}`,
      // {{ ("my translation" || $ctrl.condition) | translate }}
      // {{ "my translation" || $ctrl.condition | translate }}
      HtmlWithDoubleEnd: `\\{\\{\\s*\\(?\\s*.+\\s*\\|\\|\\s*["'](.+)["']\\s*\\)?\\s*\\|\\s*translate\\s*\\}\\}`,
      // {{ (foo ? "bar" : baz) | translate }}
      // {{ foo ? "bar" : baz | translate }}
      HtmlTertiaryStart: `\\{\\{\\s*\\(?\\s*.+\\s*\\?\\s*.+\\s*\\:\\s*["'](.+)["']\\s*\\)?\\s*\\|\\s*translate\\s`,
      // {{ (foo ? bar : "baz") | translate }}
      // {{ foo ? bar : "baz" | translate }}
      HtmlTertiaryEnd: `\\{\\{\\s*\\(?\\s*.+\\s*\\?\\s*["'](.+)["']\\s*\\:\\s*.+\\s*\\)?\\s*\\|\\s*translate\\s`,
      // translation: "Patient Page"  #used by state config
      AngularStateConfigTranslationKey: `\\stranslationKey\\s*:\\s*['"](.+)['"]`
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