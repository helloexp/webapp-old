let jshint = require('gulp-jshint');
let gulp   = require('gulp');
let stylish = require('jshint-stylish');

gulp.task('lint_specs', function() {
  return gulp.src('./e2e/specs/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});