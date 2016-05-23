angular.module('demoApp', [
  'ngRoute',
  'encore.bridge'
])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'home.html'
  })
  .when('/components/rxSortableColumn', {
    templateUrl: 'rxSortableColumn.html',
    controller: 'rxSortableColumnCtrl'
  })
  .when('/components/rxActionMenu', {
    templateUrl: 'rxActionMenu.html',
    controller: 'rxActionMenuCtrl'
  })
  .when('/components/rxMetadata', {
    templateUrl: 'rxMetadata.html',
    controller: 'rxMetadataCtrl'
  })
  .when('/components/rxStatusColumn', {
    templateUrl: 'rxStatusColumn.html',
    controller: 'rxStatusColumnCtrl'
  })
  .otherwise('/');
})
.run(function ($rootScope) {
  $rootScope.components = _.chain(angular.module('encore.bridge').requires)
  .filter(function (mod) {
    return mod !== 'encore.ui.utilities';
  })
  .map(function (mod) {
    return _.last(mod.split('.'));
  })
  .value();
})
// TODO: remove when build system supports demo controller overrides
.factory('rxNotify', function () {
  return {}
});
