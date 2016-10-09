import gulp from 'gulp';
import nodemon from 'nodemon';
import browserSync from 'browser-sync';

const
  bs = browserSync.create(),
  reload = bs.reload;

gulp.task('nodemon', function ( cb ) {
  var called = false;
  nodemon({
    script: 'server.js',
    ignore: ['gulpfile.babel.js', '.babelrc', '/node_modules/']
  })
  .on('start', function () {
    if ( !called ) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('browserSync', ['nodemon'], function () {
  bs.init({
    proxy: 'localhost:8080',
    port: 3000,
    notify: true
  });
});

gulp.task('default', ['browserSync'], function () {
  gulp.watch(
    [
      'public/*.html',
      'public/templates/*.html',
      'public/stylesheets/**/*.css',
      'public/javascripts/**/*.js'
    ],
    reload
  );
});