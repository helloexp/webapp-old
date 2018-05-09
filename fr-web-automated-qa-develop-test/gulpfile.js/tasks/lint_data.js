let jshint = require('gulp-jshint');
let gulp   = require('gulp');
let stylish = require('jshint-stylish');

gulp.task('lint_data', function() {
  return gulp.src('./e2e/data/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});