'use strict';

var test = require('tape');
var exec = require('child_process').exec;
var mainFile = require('../package.json').main.replace(/\.js/,'')

function cleanUp(cb) {
  return exec('rm -rf ./tmp', cb);
}

function makeTestPackage(cb) {
  return exec('./scripts/mockPublish', cb);
}

// with regards to averting npm publishing disasters https://github.com/floridoo/gulp-sourcemaps/issues/246
test('publish: can load a published version', function(t) {
  // return t.fail("mock fail");
  require('fake-dom')
  require('angular/angular')
  require('angular-mocks')
  cleanUp(function() {
    makeTestPackage(function() {
      try {
        // attempt to load a packed / unpacked potential deployed version
        require('../tmp/package/' + mainFile);
      }
      catch (error){
        console.log(error.stack);
        t.fail(error);
      }
      finally{
        cleanUp(function() {
          t.end();
        });
      }
    });
  });
});
