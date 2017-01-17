angular.module('encore.ui.rxApp')
.directive('rxApp', function ($window, appRoutes, rxUserData) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/rxApp.html',
    link: function (scope) {
      if (rxUserData.accountType === 'hybrid') {
          scope.portalName = 'MyRackspace';
          scope.portalBaseUrl = 'https://' + (rxUserData.isProd ? '' : 'staging.') + 'my.rackspace.com';
          scope.ticketsUrl = scope.portalBaseUrl + '/portal/ticket/index';
          scope.createTicketUrl = scope.portalBaseUrl + '/portal/ticket/create';
      } else if (rxUserData.accountType === 'cloud') {
          scope.portalName = 'Reach';
          scope.portalBaseUrl = 'https://' + (rxUserData.isProd ? 'mycloud' : 'ui.staging.reach') +
                                '.rackspace.com/cloud/' + rxUserData.accountNumber;
          scope.ticketsUrl = scope.portalBaseUrl + '/tickets';
          scope.createTicketUrl = scope.portalBaseUrl + '/tickets#new';
      }
      scope.routes = appRoutes;
      _.assign(scope, rxUserData);
      scope.isEmbedded = $window.self !== $window.top;
    }
  };
});
