angular.module('encore.ui.rxApp')
.directive('rxApp', function () {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/rxApp.html'
  };
});
