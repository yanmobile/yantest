

(function(){
  'use strict';

  var gulp = require('gulp');

  gulp.task('watch', ['jshint'] ,function () {

    gulp.watch('src/common/assets/images/**/*',           ['images']);
    gulp.watch('src/common/assets/sass/**/*',             ['sass']);
    gulp.watch('src/common/assets/plugins/**/*',          ['js']);
    gulp.watch('src/common/modules/**/*.js',              ['js']);
    gulp.watch('src/common/modules/**/*.html',            ['html', 'js']);

    gulp.watch('src/components/assets/images/**/*',       ['images']);
    gulp.watch('src/components/assets/sass/**/*',         ['sass']);
    gulp.watch('src/components/assets/plugins/**/*',      ['js']);
    gulp.watch('src/components/modules/**/*.js',          ['js']);
    gulp.watch('src/components/modules/**/*.html',        ['html', 'js']);

    gulp.watch('src/app/assets/configuration/**/*',       ['configuration']);
    gulp.watch('src/app/assets/i18n/**/*',                ['i18n']);
    gulp.watch('src/app/assets/images/**/*',              ['images']);
    gulp.watch('src/app/assets/sass/**/*',                ['sass']);
    gulp.watch('src/app/assets/mockData/**/*',            ['mocks', 'js']);
    gulp.watch('src/app/assets/plugins/**/*',             ['js']);
    gulp.watch('src/app/modules/**/*.js',                 ['js']);
    gulp.watch('src/app/modules/**/*.html',               ['html', 'js']);

    gulp.watch('src/index.html',                          ['html', 'js']);
  });

})();
