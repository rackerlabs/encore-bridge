angular.module('encore.ui.rxActionMenu')
.config(function ($provide) {
  $provide.decorator('rxActionMenuDirective', function ($delegate) {
    // https://github.com/angular/angular.js/issues/10149
    _.each(['type', 'text'], function (key) {
      $delegate[0].$$isolateBindings[key] = {
        attrName: key,
        mode: '@',
        optional: true
      };
    });
    return $delegate;
  });
});
