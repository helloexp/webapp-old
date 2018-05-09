/* jshint node: true */
'use strict';

let gulp = require('gulp-help')(require('gulp'));
let runSequence = require('run-sequence');

let lintTask = function(cb) {
  runSequence(
    'lint_config',
    'lint_data',
    'lint_pages',
    'lint_specs',
    'lint_utilities',
    cb
  );
};

gulp.task('lint', 'Lint the app in full.', lintTask);
module.exports = lintTask;
