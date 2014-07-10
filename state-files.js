/**
 * Forked from tennisgent/angular-route-styles by Christopher Tobin-Campbell on 7/10/2014
 * tobalsemail@gmail.com
 */

(function(){

angular.module('stateFiles',[]).
  directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
      return {
        restrict: 'E',
        link: function(scope, elem){
          var style_html = '<link rel="stylesheet" ng-repeat="(stateCtrl, cssUrl) in stateStyles" ng-href="{{cssUrl}}" >';
          elem.append($compile(style_html)(scope));
          var script_html = '<script type="text/javascript" ng-repeat="(stateCtrl, jsUrl) in stateScripts" ng-src="{{jsUrl}}"></script>';
          elem.append($compile(script_html)(scope));

          scope.stateStyles = {};
          scope.stateScripts = {};
          $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState) {
            // css
            if(fromState && fromState.css){
              if(!Array.isArray(fromState.css)){
                fromState.css = [fromState.css];
              }
              angular.forEach(fromState.css, function(sheet){
                delete scope.stateStyles[sheet];
              });
            }
            if(toState && toState.css){
              if(!Array.isArray(toState.css)){
                toState.css = [toState.css];
              }
              angular.forEach(toState.css, function(sheet){
                scope.stateStyles[sheet] = sheet;
              });
            }

            // javascript
            if(fromState && fromState.js){
              if(!Array.isArray(fromState.js)){
                fromState.js = [fromState.js];
              }
              angular.forEach(fromState.js, function(script){
                delete scope.stateScripts[script];
              });
            }
            if(toState && toState.js){
              if(!Array.isArray(toState.js)){
                toState.js = [toState.js];
              }
              angular.forEach(toState.js, function(script){
                scope.stateScripts[script] = script;
              });
            }
          });
        }
      };
    }
]);

})();
