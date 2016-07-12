/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  return gulp.task('build', function (done) {
    var tasks = ['fonts', 'images', 'scripts', 'templates', 'i18n', 'mocks', 'sass', 'favicon'];
    plugins.seq('clean', tasks, 'html', done);
  });
}
