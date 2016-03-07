/**
 * Created by hzou on 3/3/16.
 */


/*==================================
 =            Copy fonts            =
 ==================================*/
module.exports = {
  init: init
};

function init(gulp, plugins, config) {
  gulp.task('build', function (done) {
    var tasks = ['html', 'fonts', 'images', 'js', 'assets', 'sass', 'favicon', 'version'];
    plugins.seq('clean', tasks, done);
  });
}