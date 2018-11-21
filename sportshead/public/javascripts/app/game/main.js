'use strict';

var cetelemHeadsGameApp = angular.module('cetelemHeadsGameApp', [
  'ngRoute',

  'cetelemHeadsGameControllers',
  'cetelemHeadsGameDirectives',
  'cetelemHeadsGameFactories'
]);

cetelemHeadsGameApp.config(function($routeProvider) {
    $routeProvider
      .when('/main-menu', {
        templateUrl: '/partials/main-menu',
        controller: 'MainMenuController'
      })
      .when('/game', {
        template: '<div></div>'
      })
    ;
});

angular.module('cetelemHeadsGameControllers', []);
angular.module('cetelemHeadsGameDirectives', []);
angular.module('cetelemHeadsGameFactories', []);
