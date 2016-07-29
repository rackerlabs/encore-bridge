angular.module('encore.ui.rxApp')
.directive('rxApp', function (appRoutes) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/rxApp.html',
    link: function (scope) {
      scope.routes = appRoutes;
    }
  };
});
