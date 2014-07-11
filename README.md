angular-state-files
====================

This is a simple module for AngularJS that provides the ability to have state-specific CSS stylesheets and javascript files, by integrating with Angular's `ui.router` service.

Major props to Zach Boman for getting this setup for `ngRoute`. See his repository here: https://github.com/tennisgent/angular-route-styles

What does it do?
---------------

It allows you to declare partial-specific or state-specific css or javascript files for your app using
Angular's `ui.router` service.  For example, if you are already using
`ui.router`, you know that it allows you to easily setup your SPA states by declaring
a `.state()` block and telling Angular what template (or templateUrl) to use for each
route, and also which controller to associate with that route.  Well, up until now, Angular
did not provide a way to add specific CSS stylesheets or javascript files that should be dynamically loaded
when the given state is hit.  This solves that problem by allowing you to do something like this:

```javascript
app.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider

      // HOME STATES AND NESTED VIEWS ========================================
      .state('/some/state/1', {
        url: '/some/state/1',
        templateUrl: 'views/view1.html',
        controller: 'SomeCtrl',
        css: 'styles/style.css'
      })

      .state('/some/state/2', {
        url: '/some/state/2',
        templateUrl: 'views/view2.html',
        controller: 'OtherCtrl',
        css: ['styles/other-style.css','styles/another-style.css']
        js: 'scripts/flatui-checkbox.js1'
      })
        // more states can be declared here
}]);
```

How to install:
---------------

**1) bower install angular-state-files --save**

**2) or you can download or clone this repository**

**3) Include the `state-files.js` file to your `index.html` file**

```html
<!-- should be added at the end of your body tag -->
<body>
    ...
    <script scr="path/to/state-files.js"></script>
</body>
```

**4) Declare the `'stateFiles'` module as a dependency in your main app**

```javascript
angular.module('myApp', ['ui.router','stateFiles' /* other dependencies here */]);
```
**NOTE**: you must also include the `ui.router` service module from angular, or at least make the
module available by adding the `angular-ui-router.js` (or `angular-ui-router.min.js`) script
to your html page.

**NOTE:** this code also requires that your Angular app has access to the `<head>` element.  Typically this
requires that your `ng-app` directive is on the `<html>` element.  For example: `<html ng-app="myApp">`.

**5) Add your state-specific styles or javascript files to the `$stateProvider` in your app's config**

```javascript
var app = angular.module('myApp', []);
app.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider

      // HOME STATES AND NESTED VIEWS ========================================
      .state('/some/state/1', {
        url: '/some/state/1',
        templateUrl: 'views/view1.html',
        controller: 'SomeCtrl',
        css: 'styles/style.css'
      })

      .state('/some/state/2', {
        url: '/some/state/2',
        templateUrl: 'views/view2.html',
        controller: 'OtherCtrl',
        css: ['styles/other-style.css','styles/another-style.css']
        js: 'scripts/flatui-checkbox.js1'
      })
        // more states can be declared here
}]);
```
**Things to notice:**
* Specifying a css property or js property on the state is completely optional, as js was omitted from the `'/some/state/1'` example. If the state doesn't have a css or js property, the service will simply do nothing for that state.
* You can even have multiple page-specific stylesheets  or javascript files per state, as in the `'/some/state/2'` example above, where the css property is an **array** of relative paths to the stylesheets needed for that state.


How does it work?
-----------------
###State Setup:

This config adds custom css and js properties to the object that is used to setup each page's state. That object gets passed to each `'$stateChangeStart'` event. So when listening to the `'$stateChangeStart'` event, we can grab the css property or the js property that we specified and append/remove those `<link />` or `<script>` tags as needed.

###Custom Head Directive:

```javascript
app.directive('head', ['$rootScope','$compile',
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
```

This directive does the following things:

* It compiles (using `$compile`) an html string that creates a set of `<link />` tags for every item in the `scope.stateStyles` object using `ng-repeat` and `ng-href`.
* It compiles (using `$compile`) an html string that creates a set of `<script>` tags for every item in the `scope.stateScripts` object using `ng-repeat` and `ng-src`.
* It appends that compiled set of `<link />` elements and `<script>` elements to the `<head>` tag.
* It then uses the `$rootScope` to listen for `'$stateChangeStart'` events. For every `'$stateChangeStart'` event, it grabs the "fromState" object (the state that the user is about to leave) and removes its partial-specific css file(s) and javascript file(s) from the `<head>` tag. It also grabs the "toState" object (the state that the user is about to go to) and adds any of its partial-specific css file(s) and javascript file(s) to the `<head>` tag.
* And the `ng-repeat` part of the compiled `<link />` and `<script>` tags handles all of the adding and removing of the page-specific stylesheets and javascript files based on what gets added to or removed from the `scope.stateStyles` and `scope.stateScripts` object.