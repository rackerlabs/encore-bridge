angular.module('encore.ui.rxApp')
.directive('rxApp', function ($window, appRoutes, rxUserData) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/rxApp.html',
    link: function (scope) {
      scope.routes = appRoutes;
      _.assign(scope, rxUserData);
      scope.isEmbedded = $window.self !== $window.top;
    }
  };
});
