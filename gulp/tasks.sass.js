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
  gulp.task('sass', [], function () {
    return gulp
      .src(config.app.module.scss)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({ errLogToConsole: true }))
      .pipe(plugins.mobilizer('app.css', {
        'app.css'  : {
          hover  : 'exclude',
          screens: ['0px']
        },
        'hover.css': {
          hover  : 'only',
          screens: ['0px']
        }
      }))
      //.pipe(plugins.cssmin())
      .pipe(plugins.concat('app.css'))
      .pipe(plugins.rename({ basename: 'main', suffix: '.min' }))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'css')))
      .pipe(plugins.size());
  });
}