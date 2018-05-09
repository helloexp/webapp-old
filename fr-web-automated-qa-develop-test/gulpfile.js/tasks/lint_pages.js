let jshint = require('gulp-jshint');
let gulp   = require('gulp');
let stylish = require('jshint-stylish');

gulp.task('lint_pages', function() {
  return gulp.src('./e2e/pages/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});