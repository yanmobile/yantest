

(function(){
  'use strict';

  var gulp = require('gulp');

  gulp.task('watch', ['jshint'] ,function () {

    gulp.watch('src/common/assets/images/**/*',           ['images']);
    gulp.watch('src/common/assets/sass/**/*',             ['sass']);
    gulp.watch('src/common/assets/plugins/**/*',          ['js']);
    gulp.watch('src/common/modules/**/*.js',              ['js']);
    gulp.watch('src/common/modules/**/*.html',            ['html', 'js']);

    gulp.watch('src/custom/assets/configuration/**/*',    ['configuration']);
    gulp.watch('src/custom/assets/i18n/**/*',             ['i18n']);
    gulp.watch('src/custom/assets/images/**/*',           ['images']);
    gulp.watch('src/custom/assets/sass/**/*',             ['sass']);
    gulp.watch('src/custom/assets/mockData/**/*',         ['mocks', 'js']);
    gulp.watch('src/custom/assets/plugins/**/*',          ['js']);
    gulp.watch('src/custom/modules/**/*.js',              ['js']);
    gulp.watch('src/custom/modules/**/*.html',            ['html', 'js']);

    gulp.watch('src/common/index.html',                   ['html', 'js']);
  });

})();
