angular.module('encore.ui.rxApp')
.directive('rxApp', function ($window, appRoutes) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/rxApp.html',
    link: function (scope) {
      scope.routes = appRoutes;
      scope.isEmbedded = $window.self !== $window.top;
    }
  };
});
