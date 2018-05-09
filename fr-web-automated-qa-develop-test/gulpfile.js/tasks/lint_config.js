let jshint = require('gulp-jshint');
let gulp   = require('gulp');
let stylish = require('jshint-stylish');

gulp.task('lint_config', function() {
  return gulp.src('./wido.*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});