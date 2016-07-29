angular.module('encore.ui.rxApp')
.provider('appRoutes', function () {
  this.routes = [];
  this.$get = function () {
    return this.routes;
  };
});
