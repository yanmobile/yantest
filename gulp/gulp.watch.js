

(function(){
  'use strict';

  var gulp = require('gulp');

  gulp.task('watch', ['jshint'] ,function () {

    gulp.watch('src/common/assets/images/**/*',           ['images']);
    gulp.watch('src/common/assets/sass/**/*',             ['sass']);
    gulp.watch('src/common/assets/vendors/**/*',          ['scripts']);
    gulp.watch('src/common/modules/**/*.js',              ['scripts']);
    gulp.watch('src/common/modules/**/*.html',            ['templates']);

    gulp.watch('src/components/assets/images/**/*',       ['images']);
    gulp.watch('src/components/assets/sass/**/*',         ['sass']);
    gulp.watch('src/components/assets/vendors/**/*',      ['scripts']);
    gulp.watch('src/components/modules/**/*.js',          ['scripts']);
    gulp.watch('src/components/modules/**/*.html',        ['templates']);

    gulp.watch('src/app/assets/i18n/**/*',                ['i18n']);
    gulp.watch('src/app/assets/images/**/*',              ['images']);
    gulp.watch('src/app/assets/sass/**/*',                ['sass']);
    gulp.watch('src/app/assets/mockData/**/*',            ['mocks', 'scripts']);
    gulp.watch('src/app/assets/vendors/**/*',             ['scripts']);
    gulp.watch('src/app/modules/**/*.js',                 ['scripts']);
    gulp.watch('src/app/modules/**/*.html',               ['templates']);

    gulp.watch('src/index.html',                          ['html']);
  });

})();
