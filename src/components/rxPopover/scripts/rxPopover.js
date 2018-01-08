angular.module('encore.ui.rxPopover')
.directive('rxPopover', function () {
    return {
        restrict: 'EA',
        controller: function ($scope) {
            var displayed = false;

            this.onChange = _.noop;

            this.close = function () {
                displayed = false;
                this.onChange(displayed);
            };

            this.toggle = function () {
                displayed = !displayed;
                this.onChange(displayed);
            };
        },
        link: function (scope, element, attrs) {
            attrs.$addClass('action-menu-container');
        }
    };
})
.directive('rxPopoverTrigger', function () {
    return {
        require: '^^rxPopover',
        restrict: 'A',
        link: function (scope, element, attrs, rxPopover) {
            element.on('click', function () {
                scope.$apply(function () {
                    rxPopover.toggle();
                });
            });
        }
    };
})
.directive('rxPopoverContent', function () {
    return {
        require: '^^rxPopover',
        restrict: 'E',
        template: '<div class="action-list" ng-if="displayed" ng-transclude></div>',
        transclude: true,
        link: function (scope, element, attrs, rxPopover) {
            rxPopover.onChange = function (displayed) {
                scope.displayed = displayed;
            };
        }
    };
});
