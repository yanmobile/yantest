
module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {

  gulp.task('watch', [] ,function () {

    gulp.watch('src/common/assets/images/**/*',           ['images']);
    gulp.watch('src/common/assets/sass/**/*',             ['sass']);
    gulp.watch('src/common/assets/vendors/**/*',          ['scripts']);
    gulp.watch('src/common/modules/**/*.js',              ['test:common', 'jshint', 'scripts']);
    gulp.watch('src/common/modules/**/*.html',            ['templates']);
    gulp.watch('test/unit/common/**/*.js',                ['test:common']);

    gulp.watch('src/components/**/assets/images/**/*',    ['images']);
    gulp.watch('src/components/**/assets/sass/**/*',      ['sass']);
    gulp.watch('src/components/**/assets/vendors/**/*',   ['scripts']);
    gulp.watch('src/components/**/modules/**/*.js',       ['test:components', 'jshint', 'scripts']);
    gulp.watch('src/components/**/modules/**/*.html',     ['templates']);
    gulp.watch('test/unit/components/**/*.js',            ['test:components']);

    gulp.watch('src/app/assets/i18n/**/*',                ['i18n']);
    gulp.watch('src/app/assets/images/**/*',              ['images']);
    gulp.watch('src/app/assets/sass/**/*',                ['sass']);
    gulp.watch('src/app/assets/mockData/**/*',            ['mocks', 'scripts']);
    gulp.watch('src/app/assets/vendors/**/*',             ['scripts']);
    gulp.watch('src/app/modules/**/*.js',                 ['test:app', 'jshint', 'scripts']);
    gulp.watch('src/app/modules/**/*.html',               ['templates']);
    gulp.watch('test/unit/app/**/*.js',                   ['test:app']);

    gulp.watch('src/index.html',                          ['html']);

    gulp.watch('gulp/**',                                 ['build']);
  });

}
