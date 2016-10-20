'use strict';

var test = require('tape');
var exec = require('child_process').exec;
var mainFile = require('../package.json').main.replace(/\.js/,'')

// with regards to averting npm publishing disasters https://github.com/floridoo/gulp-sourcemaps/issues/246
test('index: can load main file', function(t) {
  // return t.fail("mock fail");
  require('fake-dom')
  require('angular/angular')
  require('angular-mocks')
  require('../state-files')
  t.end();
});
