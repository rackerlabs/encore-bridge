angular.module('demoApp', [
  'ngRoute',
  'encore.bridge'
])
.config(function ($routeProvider, appRoutesProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'home.html'
  })
  .when('/components/rxCollapse', {
    templateUrl: 'rxCollapse.html',
  })
  .when('/components/rxForm', {
    templateUrl: 'rxForm.html',
    controller: 'rxFormDemoCtrl'
  })
  .when('/components/rxPopover', {
    templateUrl: 'rxPopover.html'
  })
  .when('/components/rxRadio', {
    templateUrl: 'rxRadio.html',
    controller: 'rxRadioCtrl'
  })
  .when('/components/rxSortableColumn', {
    templateUrl: 'rxSortableColumn.html',
    controller: 'rxSortableColumnCtrl'
  })
  .when('/components/rxStatusColumn', {
    templateUrl: 'rxStatusColumn.html',
    controller: 'rxStatusColumnCtrl'
  })
  .when('/components/:id', {
    template: 'Component not supported'
  })
  .when('/elements/ActionMenu', {
    templateUrl: 'rxActionMenu.html',
    controller: 'rxActionMenuCtrl'
  })
  .when('/elements/Buttons', {
    templateUrl: 'Buttons.docs.html'
  })
  .when('/elements/Forms', {
    templateUrl: 'forms.docs.html'
  })
  .when('/elements/Metadata', {
    templateUrl: 'rxMetadata.html',
    controller: 'metadataSimpleExampleCtrl'
  })
  .when('/elements/Tags', {
    templateUrl: 'tags.simple.html'
  })
  .otherwise('/');

  var components = angular.module('encore.bridge').requires
  .filter(function (mod) {
    return mod !== 'encore.ui.utilities' && mod !== 'encore.ui.elements';
  })
  .map(function (mod) {
    return _.last(mod.split('.'));
  })
  var elements = ['ActionMenu', 'Buttons', 'Forms', 'Metadata', 'Tags'];

  var defineRoute = _.curry(function (type, name) {
      return {
        linkText: name,
        href: '#/' + type + '/' + name
      }
  });

  appRoutesProvider.routes = [{
    title: 'Components',
    children: components.map(defineRoute('components'))
  }, {
    title: 'Elements',
    children: elements.map(defineRoute('elements'))
  }];
})
.run(function ($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function (event, route) {
    $rootScope.activePrimaryNavItem = route.$$route.originalPath.split('/')[1];
  });
})
// TODO: remove when build system supports demo controller overrides
.factory('rxNotify', function () {
  return {}
});
angular.module('demoApp')
.directive('alwaysInvalid', function () {
  return {
    require: 'ngModel',
    link: function (scope, el, attrs, ctrl) {
      ctrl.$setValidity('alwaysInvalid', false);
      ctrl.$setDirty();
    }
  };
});
