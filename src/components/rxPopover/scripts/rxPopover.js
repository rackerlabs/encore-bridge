angular.module('encore.ui.rxPopover')
.directive('rxPopover', function (rxActionMenuDirective) {
  var ddo = _.cloneDeep(rxActionMenuDirective[0]);
  return _.assign(ddo, {
    templateUrl: 'templates/rxPopover.html'
  });
});
