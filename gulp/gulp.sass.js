/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  gulp.task('sass', [], function () {
    var autoprefixer = require('gulp-autoprefixer');
    
    return gulp
      .src(config.app.module.scss)
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass.sync({ errLogToConsole: true }))
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
      .pipe(autoprefixer())
      .pipe(plugins.concat('app.css'))
      .pipe(plugins.rename({ basename: 'main', suffix: '.min' }))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(plugins.path.join(config.app.dest.folder, 'css')))
      .pipe(plugins.size());
  });
}