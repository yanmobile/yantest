/**
 * Created by hzou on 3/3/16.
 */


module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {

  /*======================================
   =   Determine version info from git   =
   =======================================*/

  var today            = new Date();
  var todayISO         = plugins.dateFormat(today, 'yyyy-mm-dd') + 'T00:00:00.000';
  var suffix           = '';
  var outputDateFormat = 'yyyymmdd';
  var syncEncoding     = { encoding: 'utf-8' };
  var upstreamUpdated  = false;

  var appBuildno, appCodeno,
      coreBuildno, coreBuildCount, coreCodeno,
      coreSHA = '';

  gulp.task('gitFetch', function (callback) {
    return plugins.exec('git fetch --multiple origin upstream',
      function (err, stdout) {
        upstreamUpdated = !err;
        callback();
      });
  });

  // Looks through local and remote:upstream history for the most recent shared commit
  gulp.task('gitCoreInfo', function (callback) {
    if (!upstreamUpdated) {
      console.log('Warning: Unable to update remote "upstream" for version system')
    }
    else {
      // Get all merged commits for this repo
      var commits = plugins.execSync('git log origin/master --merges --pretty="%H|%ci" ', syncEncoding);

      var lines = _.compact(commits.split('\n'));
      var done  = false;

      // Check each merged commit against upstream/master for a match
      _.forEach(lines, function (commitLine) {
        var commitInfo = _.compact(commitLine.split('|')),
            commitSHA  = commitInfo[0],
            commitDate = new Date(commitInfo[1]),
            sinceDate  = new Date(commitDate).toISOString();

        // Look at all merges from upstream/master since the local SHA we are checking against
        var cmd = 'git log upstream/master --merges --pretty="%H|%ci" --since=\'' + sinceDate + '\'';

        var upstream      = plugins.execSync(cmd, syncEncoding).trim();
        var upstreamLines = _.compact(upstream.split('\n'));

        _.forEach(upstreamLines, function (upstreamLine) {
          var upstreamInfo = _.compact(upstreamLine.split('|')),
              upstreamSHA  = upstreamInfo[0],
              upstreamDate = new Date(upstreamInfo[1]);

          // If the commit SHA matches, this is the most recent commit that is shared between core and this app
          if (upstreamSHA === commitSHA) {
            // Count up the number of builds from core on that date
            coreBuildno = plugins.dateFormat(upstreamDate, outputDateFormat);
            coreSHA     = upstreamSHA;
            coreCodeno  = coreSHA.substr(0, 6);

            // Get the build count for upstream/master on the date of the commit
            var sinceDate = plugins.dateFormat(upstreamDate.toISOString(), 'yyyy-mm-dd') + 'T00:00:00.000',
                untilDate = new Date(upstreamDate).toISOString();

            var countCmd = 'git rev-list upstream/master --count --merges '
              + ' --since=\'' + sinceDate + '\''
              + ' --until=\'' + untilDate + '\'';

            coreBuildCount = plugins.execSync(countCmd, syncEncoding).trim();

            done = true;
            return false; // break _.forEach
          }
        });

        // Short-circuit for outer _.forEach
        if (done) {
          return false;
        }
      });

      if (!coreCodeno) {
        console.log('Warning: No commits matching remote "upstream/master" were found');
        coreBuildno = coreCodeno = 'unavailable';
      }
      else {
        coreBuildno += ('.' + coreBuildCount);
      }
    }

    callback();
  });

  gulp.task('gitLocalInfo', function (callback) {
    var branchName = '';

    // Get branch name
    var branchList = plugins.execSync('git branch --list', syncEncoding);
    var lines      = branchList.split('\n');
    _.forEach(lines, function (line) {
      if (line.match(/^\*/)) {
        var split  = _.compact(line.split(/[ \t]/g));
        branchName = split[_.indexOf(split, "*") + 1];

        if (branchName != 'master') {
          suffix = '|' + branchName.substr(0, 10);
        }
      }
    });

    // Get latest commit for this branch
    var sha   = plugins.execSync('git log -n 1 --pretty=format:"%H" --branches=' + branchName + "*", syncEncoding);
    appCodeno = sha.substr(0, 6);

    // Get commit count for the current branch for today
    var commitCount = plugins.execSync(
      'git rev-list HEAD --count --since=\'' + todayISO + '\'' + ' --branches=' + branchName + "*",
      syncEncoding
    );

    var count  = parseInt(commitCount) + 1;
    appBuildno = plugins.dateFormat(today, outputDateFormat) + "." + count;

    callback();
    return;
  });

  // Merge the results into the version.json template
  gulp.task('setVersion', function () {
    return gulp.src('version.json')
      .pipe(plugins.replace('{{appBuildno}}', appBuildno + suffix))
      .pipe(plugins.replace('{{appCodeno}}', appCodeno + suffix))
      .pipe(plugins.replace('{{coreBuildno}}', coreBuildno))
      .pipe(plugins.replace('{{coreCodeno}}', coreCodeno))
      .pipe(gulp.dest(config.app.dest.folder));
  });

  // Sequence tasks
  gulp.task('version', function (done) {
    return plugins.seq('gitFetch', 'gitCoreInfo', 'gitLocalInfo', 'setVersion', done);
  });

}