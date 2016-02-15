var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss'],
  sass_src: ['./www/sass'],
  sass_dest: ['./www/css']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  browserSync({
    files: ['www/*', 'www/**/*'],
    server: {baseDir:['www'],
    index: 'index.html'
  }
  });

  gulp.src(['./scss/ionic.app.scss', './www/sass/*.scss'])
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('sass-styles', function(){
  gulp.src(paths.sass_src)
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(paths.sass_dest))
  .pipe(reload({stream:true}));
});
gulp.task('sasswatch', function(){
  browserSync({
    files: ['www/*'],
    server: {baseDir:['www'],
    index: 'index.html'
  }
  });
  gulp.watch(paths.sass_src, ['sass-styles'])
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
