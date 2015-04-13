

 (function(){
   'use strict';

   var gulp = require('gulp');
   var util = require('util');
   var browserSync = require('browser-sync');
   var middleware = require('./proxy');
   var seq = require('run-sequence');

   function browserSyncInit( baseDir, files, browser ){
     browser = browser === undefined ? 'default' : browser;

     var routes = null;
     if(baseDir === 'src' || (util.isArray(baseDir) && baseDir.indexOf('src') !== -1)) {
       routes = {
         '/bower_components': 'bower_components'
       };
     }

     browserSync.instance = browserSync.init(
       files,
       { startPath: '/index.html',
         server: {
           baseDir: baseDir,
           middleware: middleware,
           routes: routes
         },
         browser: browser
       });
   }

   gulp.task('server', ['watch'], function () {
     browserSyncInit(
       [ 'www' ],
       [ 'www/assets/**/*',
         'www/css/*.css',
         'www/js/*.js',
         'www/index.html' ]);
   });

   gulp.task('server:phonegap', ['watch:phonegap'], function () {
     browserSyncInit(
       [ 'www' ],
       [ 'www/assets/**/*',
         'www/css/*.css',
         'www/js/*.js',
         'www/index.html' ]);
   });

   gulp.task('serve:dist', ['build'], function () {
     browserSyncInit('www');
   });

   gulp.task('serve:e2e', function () {
     browserSyncInit('www', null, []);
   });

   gulp.task('serve:e2e-dist', ['watch'], function () {
     browserSyncInit('www', null, []);
   });

   /*======================================
    =                BUILD                =
    ======================================*/

   gulp.task('serve', function(done) {
     seq('build', 'server', done);
   });

   gulp.task('serve:phonegap', function(done) {
     seq('build:phonegap', 'server:phonegap', done);
   });


 })();
