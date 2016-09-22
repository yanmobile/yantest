/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  gulp.task('build', ['clean', 'jshint'], function (done) {
    var tasks = ['fonts', 'images', 'templates', 'scripts', 'i18n', 'mocks', 'sass', 'favicon', 'version'];
    return plugins.seq(tasks, 'html', 'test', done);
  });
}