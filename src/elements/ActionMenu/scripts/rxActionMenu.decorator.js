angular.module('encore.ui.elements')
.config(function ($provide) {
  $provide.decorator('rxActionMenuDirective', function ($delegate) {
    // https://github.com/angular/angular.js/issues/10149
    // TODO: figure out why isolateBindings are undefined and remove setTimeout
    setTimeout(function () {
      _.each(['type', 'text'], function (key) {
        $delegate[0].$$isolateBindings[key] = {
          attrName: key,
          mode: '@',
          optional: true
        };
      });
    }, 2000);
    return $delegate;
  });
});
