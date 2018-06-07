var gulp = require('gulp');
var inject = require('gulp-inject');
 
gulp.task('inject', function () {
  var target = gulp.src('index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['app/pages/**/*.js'], {read: false});
 
  return target.pipe(inject(sources))
    // .pipe(gulp.dest('./'));
    .pipe(gulp.dest('/'));
});