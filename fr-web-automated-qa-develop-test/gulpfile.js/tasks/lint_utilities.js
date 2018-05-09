let jshint = require('gulp-jshint');
let gulp   = require('gulp');
let stylish = require('jshint-stylish');

gulp.task('lint_utilities', function() {
  return gulp.src('./e2e/utilities/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});