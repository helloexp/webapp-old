/* jshint node: true */
'use strict';

let requireDir = require('require-dir');

requireDir('./tasks', {
    recurse: true
});
