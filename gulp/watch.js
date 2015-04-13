
(function(){
  'use strict';

  var gulp = require('gulp');

  gulp.task('watch', ['jshint'] ,function () {
    gulp.watch('src/assets/configuration/**/*',    ['configuration']);
    gulp.watch('src/assets/i18n/**/*',             ['i18n']);
    gulp.watch('src/assets/images/**/*',           ['images']);
    gulp.watch('src/js/common/assets/images/**/*', ['images']);
    gulp.watch('src/assets/sass/**/*',             ['sass']);
    gulp.watch('src/js/common/assets/sass/**/*',   ['sass']);
    gulp.watch('src/assets/mockData/**/*',         ['mocks', 'html']);
    gulp.watch('src/assets/plugins/**/*',          ['js', 'html']);
    gulp.watch('src/js/**/*.js',                   ['js']);
    gulp.watch('src/templates/**/*.html',          ['js', 'html']);
    gulp.watch('src/index.html',                   ['html']);
    gulp.watch('bower.json',                       ['wiredep']);
  });

  gulp.task('watch:phonegap', ['jshint'] ,function () {
    gulp.watch('src/assets/configuration/**/*',    ['configuration']);
    gulp.watch('src/assets/i18n/**/*',             ['i18n']);
    gulp.watch('src/assets/images/**/*',           ['images']);
    gulp.watch('src/js/common/assets/images/**/*', ['images']);
    gulp.watch('src/assets/sass/**/*',             ['sass']);
    gulp.watch('src/assets/mockData/**/*',         ['mocks', 'html']);
    gulp.watch('src/assets/plugins/**/*',          ['js:phonegap', 'html']);
    gulp.watch('src/js/**/*',                      ['js:phonegap', 'html']);
    gulp.watch('src/templates/**/*.html',          ['js:phonegap', 'html']);
    gulp.watch('bower.json',                       ['wiredep']);
    gulp.watch('src/index.html',                   ['html']);
  });
})();
