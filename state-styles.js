/**
 * Forked from tennisgent/angular-route-styles by Christopher Tobin-Campbell on 7/10/2014
 * tobalsemail@gmail.com
 */

(function(){

angular.module('stateStyles',[]).
  directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
      return {
        restrict: 'E',
        link: function(scope, elem){
          var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" >';
          elem.append($compile(html)(scope));
          scope.routeStyles = {};
          $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            console.log(fromState);
            console.log(fromParams);
            if(fromState && fromState.css){
              if(!Array.isArray(fromState.css)){
                fromState.css = [fromState.css];
              }
              angular.forEach(fromState.css, function(sheet){
                delete scope.routeStyles[sheet];
              });
            }
            if(toState && toState.css){
              if(!Array.isArray(toState.css)){
                toState.css = [toState.css];
              }
              angular.forEach(toState.css, function(sheet){
                scope.routeStyles[sheet] = sheet;
              });
            }
          });
        }
      };
    }
]);

})();
