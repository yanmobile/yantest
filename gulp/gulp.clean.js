/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init( gulp, plugins, config, _, util ) {
  gulp.task('clean', function (done) {
    var filesToRemove = ['./www/**'];

    var appI18nXmlDest = _.get( config.app.dest, 'i18nXml', '' );
    if (appI18nXmlDest !== '') {
      if ( appI18nXmlDest.charAt( appI18nXmlDest.length - 1 ) !== '/' ) {
        appI18nXmlDest += '/';
      }
      appI18nXmlDest += '**';
      filesToRemove.push(appI18nXmlDest);
    }

    return plugins.del( filesToRemove, done);
  });
}