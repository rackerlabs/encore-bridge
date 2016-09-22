angular.module('encore.ui.elements')
.directive('rxTooltip', function ($timeout) {
    return {
        restrict: 'E',
        compile: function (tElement) {
            var contents = tElement.contents().remove();
            var template = angular.element('<div rx-tooltip-anchor><i class="fa fa-question-circle"></i>' +
                                           '<rx-tooltip-content></rx-tooltip-content></div>');
            template.find('rx-tooltip-content').append(contents);
            tElement.append(template);
        }
    };
})
.directive('rxTooltipAnchor', function ($timeout) {
    return {
        restrict: 'A',
        require: 'rxTooltipAnchor',
        controller: function ($scope) {
            var self = this;
            var pendingTimeout = null;

            this.onVisibilityChange = _.noop;

            this.setVisibility = function (visible) {
                if (visible && pendingTimeout) {
                    $timeout.cancel(pendingTimeout);
                    pendingTimeout = null;
                }
                this.onVisibilityChange(visible);
            };

            this.scheduleHide = function () {
                if (pendingTimeout) {
                    return;
                }

                pendingTimeout = $timeout(function () {
                    self.setVisibility(false);
                    pendingTimeout = null;
                }, 500)
            };

            $scope.$on('$destroy', function () {
                $timeout.cancel(pendingTimeout);
            });
        },
        link: function (scope, element, attrs, rxTooltipAnchor) {
            var visible = false;

            function toggleVisibility () {
                visible = !visible;
                rxTooltipAnchor.setVisibility(visible);
            }

            element.on('mouseenter', function () {
                rxTooltipAnchor.setVisibility(true);
            });
            element.on('mouseleave', rxTooltipAnchor.scheduleHide);
        }
    };
})
.directive('rxTooltipContent', function () {
    return {
        restrict: 'E',
        require: '^rxTooltipAnchor',
        transclude: true,
        scope: {},
        template: '<div class="tooltip bottom" ng-class="{in: visible}" ><div class="tooltip-arrow"></div>' +
                  '<div class="tooltip-inner" ng-transclude></div></div>',
        link: function (scope, element, attrs, rxTooltipAnchor) {
            scope.visible = false;
            rxTooltipAnchor.onVisibilityChange = function (visible) {
                scope.$apply(function () {
                    scope.visible = visible;
                });
            };

            element.on('mouseenter', function () {
                rxTooltipAnchor.setVisibility(true);
            });
            element.on('mouseleave', rxTooltipAnchor.scheduleHide);
        }
    };
});
