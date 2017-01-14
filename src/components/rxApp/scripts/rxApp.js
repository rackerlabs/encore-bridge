angular.module('encore.ui.rxApp')
.directive('rxApp', function ($window, appRoutes, rxUserData) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/rxApp.html',
    link: function (scope) {
      scope.myrackHostname = 'https://' + (rxUserData.isProd ? '' : 'staging.') + 'my.rackspace.com';
      scope.reachHostname = 'https://' + (rxUserData.isProd ? 'mycloud' : 'ui.staging.reach') +
                            '.rackspace.com/cloud/' + rxUserData.accountNumber;
      scope.routes = appRoutes;
      _.assign(scope, rxUserData);
      scope.isEmbedded = $window.self !== $window.top;
    }
  };
});
