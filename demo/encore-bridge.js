angular.module('encore.bridge', ['encore.ui.rxActionMenu','encore.ui.rxMetadata','encore.ui.rxSortableColumn','encore.ui.rxStatusColumn','encore.ui.utilities']);

/**
 * @ngdoc overview
 * @name utilities
 * @description
 * # Utilities
 * Utilities are modules related to:
 *
 * * business logic
 *   * values, constants, controllers, services
 * * display logic & application flow control
 *   * convenience, "if"-like, and "switch"-like directives
 *   * filters
 *
 * ## Values & Constants
 * * {@link utilities.value:devicePaths devicePaths}
 * * {@link utilities.constant:feedbackApi feedbackApi}
 * * {@link utilities.value:feedbackTypes feedbackTypes}
 * * {@link utilities.object:rxStatusColumnIcons rxStatusColumnIcons}
 *
 * ## Controllers
 * * {@link utilities.controller:rxBulkSelectController rxBulkSelectController}
 * * {@link utilities.controller:rxFeedbackController rxFeedbackController}
 * * {@link utilities.controller:rxModalCtrl rxModalCtrl}
 *
 * ## Directives
 * * {@link utilities.directive:rxFavicon rxFavicon}
 *
 * ## Filters
 * * {@link utilities.filter:Page Page}
 * * {@link utilities.filter:Paginate Paginate}
 * * {@link utilities.filter:PaginatedItemsSummary PaginatedItemsSummary}
 * * {@link utilities.filter:rxAge rxAge}
 * * {@link utilities.filter:rxCapitalize rxCapitalize}
 * * {@link utilities.filter:rxDiskSize rxDiskSize}
 * * {@link utilities.filter:rxEnvironmentMatch rxEnvironmentMatch}
 * * {@link utilities.filter:rxEnvironmentUrl rxEnvironmentUrl}
 * * {@link utilities.filter:rxSortEmptyTop rxSortEmptyTop}
 * * {@link utilities.filter:rxUnsafeRemoveHTML rxUnsafeRemoveHTML}
 * * {@link utilities.filter:titleize titleize}
 * * {@link utilities.filter:xor xor}
 *
 * ## Services
 * * {@link utilities.service:Auth Auth}
 * * {@link utilities.service:encoreRoutes encoreRoutes}
 * * {@link utilities.service:Environment Environment}
 * * {@link utilities.service:ErrorFormatter ErrorFormatter}
 * * {@link utilities.service:hotkeys hotkeys}
 * * {@link utilities.service:Identity Identity}
 * * {@link utilities.service:NotifyProperties NotifyProperties}
 * * {@link utilities.service:PageTracking PageTracking}
 * * {@link utilities.service:Permission Permission}
 * * {@link utilities.service:routesCdnPath routesCdnPath}
 * * {@link utilities.service:rxAppRoutes rxAppRoutes}
 * * {@link utilities.service:rxAutoSave rxAutoSave}
 * * {@link utilities.service:rxBreadcrumbsSvc rxBreadcrumbsSvc}
 * * {@link utilities.service:rxBulkSelectUtils rxBulkSelectUtils}
 * * {@link utilities.service:rxDOMHelper rxDOMHelper}
 * * {@link utilities.service:rxFeedbackSvc rxFeedbackSvc}
 * * {@link utilities.service:rxFormUtils rxFormUtils}
 * * {@link utilities.service:rxHideIfUkAccount rxHideIfUkAccount}
 * * {@link utilities.service:rxLocalStorage rxLocalStorage}
 * * {@link utilities.service:rxModalFooterTemplates rxModalFooterTemplates}
 * * {@link utilities.service:rxNestedElement rxNestedElement}
 * * {@link utilities.service:rxNotify rxNotify}
 * * {@link utilities.service:rxPageTitle rxPageTitle}
 * * {@link utilities.service:rxPaginateUtils rxPaginateUtils}
 * * {@link utilities.service:rxPromiseNotifications rxPromiseNotifications}
 * * {@link utilities.service:rxScreenshotSvc rxScreenshotSvc}
 * * {@link utilities.service:rxSortUtil rxSortUtil}
 * * {@link utilities.service:rxStatusMappings rxStatusMappings}
 * * {@link utilities.service:rxStatusTags rxStatusTags}
 * * {@link utilities.service:rxVisibility rxVisibility}
 * * {@link utilities.service:rxVisibilityPathParams rxVisibilityPathParams}
 * * {@link utilities.service:Session Session}
 * * {@link utilities.service:Status Status}
 * * {@link utilities.service:StatusUtil StatusUtil}
 * * {@link utilities.service:TokenInterceptor TokenInterceptor}
 * * {@link utilities.service:UnauthorizedInterceptor UnauthorizedInterceptor}
 * * {@link utilities.service:urlUtils urlUtils}
 */
angular.module('encore.ui.utilities', [
    'ngResource',
    'debounce',
]);

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:rxStatusMappings
 * @description
 *
 * A set of methods for creating mappings between a product's notion
 * of statuses, and the status identifiers used in EncoreUI
 *
 * To accommodate different statuses, the `rxStatusMappings` factory includes
 * methods for defining mappings from your own statuses to the six defined ones.
 * The basic methods for this are `rxStatusMappings.addGlobal()` and
 * `rxStatusMappings.addAPI()`.
 *
 * ## mapToActive()/mapToWarning()/mapToError()/mapToInfo()/mapToPending()
 *
 * While `.addGlobal()` and `.addAPI()` would be sufficient on their own,
 * they can be slightly cumbersome. If you have a list of statuses that all
 * need to get mapped to the same EncoreUI status, the mapping object will
 * be forced to have repetition, leaving room for errors. For example,
 * something like this:
 *
 * <pre>
 * rxStatusMappings.addGlobal({
 *     'BLOCKED': 'ERROR',
 *     'SHUTDOWN': 'ERROR',
 *     'FAILED': 'ERROR'
 * });
 * </pre>
 *
 * There is required repetition of `"ERROR"` in each pair, and there's always
 * the chance of misspelling `"ERROR"`. Instead, we provide a utility method
 * `mapToError` to help with this:
 *
 * <pre>
 * rxStatusMappings.mapToError(['BLOCKED', 'SHUTDOWN', 'FAILED']);
 * </pre>
 *
 * This has the advantage that it's shorter to type, eliminates the chance of
 * mistyping or misassigning `"ERROR"`, and keeps all `"ERROR"` mappings
 * physically grouped. With this, you could easily keep your mapping values
 * in an Angular `.value` or `.constant`, and just pass them to these methods
 * in your `.run()` method.
 *
 * There are equivalent `mapToWarning`, `mapToActive`, `mapToDisabled`,
 * `mapToPending` and `mapToInfo` methods.
 *
 * All six of these methods can take an array or a single string as the first
 * argument. The call above is equivalent to this group of individual calls:
 *
 * <pre>
 * rxStatusMappings.mapToError('BLOCKED');
 * rxStatusMappings.mapToError('SHUTDOWN');
 * rxStatusMappings.mapToError('FAILED');
 * </pre>
 *
 * All six can also take `api` as a second, optional parameter. Thus we could
 * define the `rxStatusMappings.addAPI({ 'FOO': 'ERROR' }, 'z')` example from
 * above as:
 *
 * <pre>
 * rxStatusMappings.mapToError('FOO', 'z');
 * </pre>
 *
 */
.factory('rxStatusMappings', function () {
    var globalMappings = {};
    var apiMappings = {};
    var rxStatusMappings = {};

    var upperCaseCallback = function (objectValue, sourceValue) {
        return sourceValue.toUpperCase();
    };
    /**
     * @ngdoc function
     * @name rxStatusMappings.addGlobal
     * @methodOf utilities.service:rxStatusMappings
     * @description
     *
     * Takes a full set of mappings to be used globally
     *
     * `rxStatusMappings.addGlobal()` takes an object as an argument, with the
     * keys being your own product's statuses, and the values being one of the six
     * internal statuses that it should map to. For example:
     *
     * <pre>
     * rxStatusMappings.addGlobal({
     *     'RUNNING': 'ACTIVE',
     *     'STANDBY': 'INFO',
     *     'SUSPENDED': 'WARNING',
     *     'FAILURE': 'ERROR'
     * });
     * </pre>
     *
     * These mappings will be used throughout all instances of `rx-status-column`
     * in your code.
     *
     * @param {String} mapping This is mapping with keys and values
     */
    rxStatusMappings.addGlobal = function (mapping) {
        _.assign(globalMappings, mapping, upperCaseCallback);
    };

    /**
     * @ngdoc function
     * @name rxStatusMappings.addAPI
     * @methodOf utilities.service:rxStatusMappings
     * @description
     *
     * Create a mapping specific to a particular API. This will
     * only be used when the directive receives the `api="..."`
     * attribute
     *
     * Say that you are using three APIs in your product, `X`, `Y` and `Z`. Both
     * `X` and `Y` define a status `"FOO"`, which you want to map to EncoreUI's
     * `"WARNING"`. You can declare this  mapping with
     * `rxStatusMappings.addGlobal({ 'FOO': 'WARNING' })`. But your API `Z` also
     * returns a `"FOO"` status, which you need mapped to EncoreUI's
     * `"ERROR"` status.
     *
     * You _could_ do a transformation in your product to convert the `"FOO"`
     * from `Z` into something else, or you can make use of
     * `rxStatusMappings.addAPI()`, as follows:
     *
     * <pre>
     * rxStatusMappings.addAPI('z', { 'FOO': 'ERROR' });
     * </pre>
     *
     * Then in your template code, you would use `rx-status-column` as:
     *
     * <pre>
     * <td rx-status-column status="{{ status }}" api="z"></td>
     * </pre>
     *
     * This will tell EncoreUI that it should first check if the passed in
     * `status` was defined separately for an api `"z"`, and if so, to use that
     * mapping. If `status` can't be found in the mappings defined for `"z"`,
     * then it will fall back to the mappings you defined in your `.addGlobal()`
     * call.
     *
     * @param {String} apiName This is api name of the mapping
     * @param {String} mapping This is mapping with keys and values
     */
    rxStatusMappings.addAPI = function (apiName, mapping) {
        var api = apiMappings[apiName] || {};
        _.assign(api, mapping, upperCaseCallback);
        apiMappings[apiName] = api;
    };

    var buildMapFunc = function (mapToString) {
        return function (statusString, api) {
            var obj = {};
            if (_.isString(statusString)) {
                obj[statusString] = mapToString;
            } else if (_.isArray(statusString)) {
                _.each(statusString, function (str) {
                    obj[str] = mapToString;
                });
            }

            if (api) {
                rxStatusMappings.addAPI(api, obj);
            } else {
                rxStatusMappings.addGlobal(obj);
            }
        };
    };

    // All four of these map a string, or an array of strings,
    // to the corresponding internal status (Active/Warning/Error/Info)
    // Each can optionally take a string as the second parameter, indictating
    // which api the mapping belongs to
    rxStatusMappings.mapToActive = buildMapFunc('ACTIVE');
    rxStatusMappings.mapToWarning = buildMapFunc('WARNING');
    rxStatusMappings.mapToError = buildMapFunc('ERROR');
    rxStatusMappings.mapToInfo = buildMapFunc('INFO');
    rxStatusMappings.mapToPending = buildMapFunc('PENDING');
    rxStatusMappings.mapToDisabled = buildMapFunc('DISABLED');

    /**
     * @ngdoc function
     * @name rxStatusMappings.getInternalMapping
     * @methodOf utilities.service:rxStatusMappings
     * @description
     *
     * `rxStatusMappings` defines a `getInternalMapping(statusString, api)` method,
     * which the framework uses to map a provided `status` string based on the
     * mapping rules from all the methods above. It's intended for internal use,
     * but there's nothing stopping you from using it if you find a need.
     *
     * If you ask it to map a string that is not registered for a mapping, it will
     * return back that same string.
     *
     * @param {String} statusString This is status string based on mapping rules
     * @param {String} api This is an api based on mapping rules
     */
    rxStatusMappings.getInternalMapping = function (statusString, api) {
        if (_.has(apiMappings, api) && _.has(apiMappings[api], statusString)) {
            return apiMappings[api][statusString];
        }

        var mapped = globalMappings[statusString];

        return mapped ? mapped : statusString;
    };

    return rxStatusMappings;
});

angular.module('encore.ui.utilities')
/**
 * @ngdoc object
 * @name utilities.object:rxStatusColumnIcons
 * @description
 *
 * Mapping of internal statuses to FontAwesome icons.
 * The keys map to the names defined in rxStatusColumn.less
 */
.value('rxStatusColumnIcons', {
    'ERROR': 'fa-ban',
    'WARNING': 'fa-exclamation-triangle',
    'INFO': 'fa-info-circle',
});

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:rxSortUtil
 * @description
 * Service which provided utility methods for sorting collections.
 *
 * @example
 * <pre>
 * rxSortUtil.getDefault() // returns a sort object with name as the default.
 * rxSortUtil.sortCol($scope, 'name') // sorts the collection based on the predicate
 * </pre>
 */
.factory('rxSortUtil', function () {
    var util = {};

    util.getDefault = function (property, reversed) {
        return { predicate: property, reverse: reversed };
    };

    util.sortCol = function ($scope, predicate) {
        var reverse = ($scope.sort.predicate === predicate) ? !$scope.sort.reverse : false;
        $scope.sort = { reverse: reverse, predicate: predicate };

        // This execution should be moved outside of the scope for rxSortUtil
        // already rxSortUtil.sortCol has to be wrapped, and can be implemented there
        // rather than have rxSortUtil.sortCol check/expect for a pager to be present.
        if ($scope.pager) {
            $scope.pager.pageNumber = 0;
        }
    };

    return util;
});

/**
 * @ngdoc overview
 * @name rxStatusColumn
 * @description
 * # rxStatusColumn Component
 *
 * This component provides directives and styles for putting status columns
 * into tables.
 *
 * ## Directives
 * * {@link rxStatusColumn.directive:rxStatusColumn rxStatusColumn}
 * * {@link rxStatusColumn.directive:rxStatusHeader rxStatusHeader}
 */
angular.module('encore.ui.rxStatusColumn', [
    'encore.ui.utilities'
]);

angular.module('encore.ui.rxStatusColumn')
/**
 * @ngdoc directive
 * @name rxStatusColumn.directive:rxStatusHeader
 * @description
 *
 * Place this attribute directive on the `<th>` for the status columns. It
 * ensures correct styling.
 *
 * For the `<th>` component representing the status column, add the
 * `rx-status-header` attribute, i.e.
 *
 * <pre>
 * <th rx-status-header></th>
 * </pre>
 * Note that status columns are sortable with
 * {@link /encore-ui/#/components/rxSortableColumn rxSortableColumn}, just like any
 * other column. The demo below shows an example of this.
 *
 * One few things to note about the
 * {@link /encore-ui/#/components/rxStatusColumn demo}: The `<th>` is defined as:
 *
 * <pre>
 * <th rx-status-header>
 *     <rx-sortable-column
 *         sort-method="sortcol(property)"
 *         sort-property="status"
 *         predicate="sort.predicate"
 *         reverse="sort.reverse">
 *     </rx-sortable-column>
 * </th>
 * </pre>
 *
 * Note that `sort-property="status"` is referring to the `server.status`
 * property on each row. Thus the sorting is done in this example by the status
 * text coming from the API.
 */
.directive('rxStatusHeader', function () {
    return {
        link: function (scope, element) {
            element.addClass('rx-status-header');
        }
    };
});

angular.module('encore.ui.rxStatusColumn')
/**
 * @ngdoc directive
 * @name rxStatusColumn.directive:rxStatusColumn
 * @restrict A
 * @scope
 * @description
 *
 * A directive for drawing colored status columns in a table. This
 * takes the place of the <td></td> for the column it's in.
 *
 * For the corresponding `<td>`, you will need to add the `rx-status-column`
 * attribute, and set the `status` attribute appropriately. You can optionally
 * set `api` and `tooltip-content` attributes. `tooltip-content` sets the
 * tooltip that will be used. If not set, it will default to the value you
 * passed in for `status`. The `api` attribute will be explained below.
 *
 * We currently support six statuses, with corresponding CSS styles. Namely,
 * `"ACTIVE"`, `"DISABLED"`, `"WARNING"`, `"ERROR"`, `"INFO"` and `"PENDING"`.
 * If your code happens to already use those statuses, then you can simply pass
 * them to the `status` attribute as appropriate. However, it's likely that
 * internally you will be receiving a number of different statuses from your
 * APIs, and will need to map them to these six statuses.
 *
 * The example in the {@link /encore-ui/#/components/rxStatusColumn demo} shows a typical
 * use of this directive, such as:
 *
 * <pre>
 * <tbody>
 *     <tr ng-repeat="server in servers">
 *         <!-- Both `api` and `tooltip-content` are optional -->
 *         <td rx-status-column
 *             status="{{ server.status }}"
 *             api="{{ server.api }}"
 *             tooltip-content="{{ server.status }}"></td>
 *         <td>{{ server.title }}</td>
 *         <td>{{ server.value }}</td>
 *    </tr>
 * </tbody>
 * </pre>
 *
 * # A note about color usage for rxStatusColumn
 *
 * Encore uses the color red for destructive and "delete" actions, and the
 * color green for additive or "create" actions, and at first it may seem that
 * the styles of rxStatusColumn do not follow that same logic. However, the
 * distinction here is that when an action or status on an item is
 * "in progress" or "pending" (i.e. the user cannot take any additional action
 * on that item until a transition completes), it is given the yellow animated
 * `PENDING` treatment. This is true even for "create"/"add" actions or
 * "delete" actions. A general rule of thumb to follow is that if a status
 * ends in -`ING`, it should get the animated yellow stripes of `PENDING`.
 *
 * @param {String} status The status to draw
 * @param {String} [api] Optionally specify which API mapping to use for the status
 * @param {String} [tooltip] The string to use for the tooltip. If omitted,
 *                           it will default to using the passed in status
 */
.directive('rxStatusColumn', function (rxStatusMappings, rxStatusColumnIcons) {
    return {
        templateUrl: 'templates/rxStatusColumn.html',
        restrict: 'A',
        scope: {
            status: '@',
            api: '@',
            tooltipContent: '@'
        },
        link: function (scope, element) {

            var lastStatusClass = '';

            var updateTooltip = function () {
                scope.tooltipText = scope.tooltipContent || scope.status || '';
            };

            var setStatus = function (status) {
                scope.mappedStatus = rxStatusMappings.getInternalMapping(status, scope.api);
                updateTooltip();

                // We use `fa-exclamation-circle` when no icon should be visible. Our LESS file
                // makes it transparent
                scope.statusIcon = rxStatusColumnIcons[scope.mappedStatus] || 'fa-exclamation-circle';
                element.addClass('status');
                element.removeClass(lastStatusClass);
                lastStatusClass = 'status-' + scope.mappedStatus;
                element.addClass(lastStatusClass);
                element.addClass('rx-status-column');
            };

            scope.$watch('status', function (newStatus) {
                setStatus(newStatus);
            });

            scope.$watch('tooltipContent', function () {
                updateTooltip();
            });
        }
    };
});

/**
 * @ngdoc overview
 * @name rxSortableColumn
 * @description
 * # rxSortableColumn Component
 *
 * The rxSortableColumn component provides functionality to sort a table on a
 * single property value.
 *
 * ## Directives
 * * {@link rxSortableColumn.directive:rxSortableColumn rxSortableColumn}
 */
angular.module('encore.ui.rxSortableColumn', []);

angular.module('encore.ui.rxSortableColumn')
/**
 * @ngdoc directive
 * @name rxSortableColumn.directive:rxSortableColumn
 * @restrict E
 * @description
 * Renders a clickable link in a table heading which will sort the table by
 * the referenced property in ascending or descending order.
 *
 * @param {String} displayText - The text to be displayed in the link
 * @param {Function} sortMethod - The sort function to be called when the link is
 * clicked
 * @param {String} sortProperty - The property on the array to sort by when the
 * link is clicked.
 * @param {Object} predicate - The current property the collection is sorted by.
 * @param {Boolean} reverse - Indicates whether the collection should sort the
 * array in reverse order.
 */
.directive('rxSortableColumn', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/rxSortableColumn.html',
        transclude: true,
        scope: {
            sortMethod: '&',
            sortProperty: '@',
            predicate: '=',
            reverse: '='
        }
    };
});

/**
 * @ngdoc overview
 * @name rxMetadata
 * @description
 * # rxMetadata Component
 *
 * rxMetadata contains directives to provide consistent styling for
 * the display of metadata information.
 *
 * ## Organizing Metadata into Columns
 * It is highly recommended that you make use of `<section>` elements to separate metadata information into columns.
 * The `<section>` elements will be set to a fixed width and will wrap/stack if the container cannot fit all columns
 * in a single row.
 *
 * <pre>
 * <rx-metadata>
 *   <section>
 *     <rx-meta label="Status" id="metaStatus">Active</rx-meta>
 *     <rx-meta label="RCN">RCN-555-555-555</rx-meta>
 *     <rx-meta label="Type">Cloud</rx-meta>
 *     <rx-meta label="Service Level">Managed &rarr; Intensive</rx-meta>
 *     <rx-meta label="Service Type">DevOps &rarr; SysOps</rx-meta>
 *   </section>
 * </rx-metadata>
 * </pre>
 *
 * ## Long Data Values
 *
 * For data values that do not naturally break to fit the width of the column, a `.force-word-break` CSS class is
 * available on the `<rx-meta>` element to prevent the value from overflowing to adjacent content.
 *
 * <pre>
 *   <rx-meta label="Super Long Value" class="force-word-break">
 *     A super long data value with anunseeminglyunbreakablewordthatcouldoverflowtothenextcolumn
 *   </rx-meta>
 * </pre>
 *
 * ## Directives
 * * {@link rxMetadata.directive:rxMetadata rxMetadata}
 * * {@link rxMetadata.directive:rxMeta rxMeta}
 */
angular.module('encore.ui.rxMetadata', []);

angular.module('encore.ui.rxMetadata')
/**
 * @ngdoc directive
 * @name rxMetadata.directive:rxMetadata
 * @restrict E
 * @description
 * Parent directive used for styling and arranging metadata information.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**block** *(full width of parent)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>Any HTML Element</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>Any HTML Element</dd>
 *
 *   <dt>Children:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxMetadata.directive:rxMeta rxMeta}</li>
 *       <li>SECTION element</li>
 *     </ul>
 *   </dd>
 * </dl>
 *
 * It is highly recommended to use `<section>` blocks for purposes
 * of arranging information into columns.
 *
 * Each `<section>` will be 300px wide and will wrap and stack vertically
 * if the container isn't wide enought to accommodate all sections in a
 * single row.
 *
 * @example
 * <pre>
 * <rx-metadata>
 *   <section>
 *     <rx-meta label="Status">
 *       degraded; system maintenance
 *     </rx-meta>
 *   </section>
 *   <section>
 *     <rx-meta label="Field Name">Field Value Example</rx-meta>
 *   </section>
 *   <section>
 *     <rx-meta label="Another Field Name">Another Field Value Example</rx-meta>
 *   </section>
 * </rx-metadata>
 * </pre>
 */
.directive('rxMetadata', function () {
    return {
        restrict: 'E'
    };
});

angular.module('encore.ui.rxMetadata')
/**
 * @ngdoc directive
 * @name rxMetadata.directive:rxMeta
 * @scope
 * @restrict E
 * @description
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**block** *(full width of parent)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxMetadata.directive:rxMetadata rxMetadata}</li>
 *       <li>SECTION element</li>
 *     </ul>
 *   </dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>Any HTML Element</dd>
 *
 *   <dt>Children:</dt>
 *   <dd>Any HTML Element</dd>
 * </dl>
 *
 * @example
 * <pre>
 * <rx-metadata>
 *   <section>
 *     <rx-meta label="Status">
 *       degraded; system maintenance
 *     </rx-meta>
 *   </section>
 * </rx-metadata>
 * </pre>
 *
 * @param {String=} label Label for metadata definition/value
 */
.directive('rxMeta', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/rxMeta.html',
        scope: {
            label: '@'
        }
    };
});

/**
 * @ngdoc overview
 * @name rxActionMenu
 * @description
 * # rxActionMenu Component
 *
 * A component to create a configurable action menu.
 *
 * ## Directives
 * * {@link rxActionMenu.directive:rxActionMenu rxActionMenu}
 */
angular.module('encore.ui.rxActionMenu', []);

angular.module('encore.ui.rxActionMenu')
/**
 * @ngdoc directive
 * @name rxActionMenu.directive:rxActionMenu
 * @restrict E
 * @scope
 * @description
 *
 * Component to add a clickable cog which brings up a menu of configurable actions.
 *
 * Normally the menu is dismissable by clicking anywhere on the page, but this can
 * be disabled by passing an optional `global-dismiss="false"` attribute to the
 * directive.
 *
 * @param {Boolean=} [globalDismiss=true] - optional attribute to make menu dismissable by clicking anywhere on the page
 */
.directive('rxActionMenu', function ($rootScope, $document) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/rxActionMenu.html',
        scope: {
            globalDismiss: '=?'
        },
        link: function ($scope, element) {
            if (!_.isBoolean($scope.globalDismiss)) {
                $scope.globalDismiss = true;
            }
            $scope.displayed = false;

            $scope.toggle = function () {
                $scope.displayed = !$scope.displayed;
                $rootScope.$broadcast('actionMenuShow', element);
            };

            $scope.modalToggle = function () {
                if ($scope.globalDismiss) {
                    $scope.toggle();
                }
            };

            $scope.$on('actionMenuShow', function (ev, el) {
                if ($scope.globalDismiss && el[0] !== element[0]) {
                    $scope.displayed = false;
                }
            });

            $document.on('click', function (clickEvent) {
                if ($scope.globalDismiss && $scope.displayed && !element[0].contains(clickEvent.target)) {
                    $scope.$apply(function () { $scope.displayed = false;});
                }
            });

            // TODO: Center the Action Menu box so it
            // takes the height of the translucded content
            // and then centers it with CSS.
            // I spent an afternoon trying to see if I could
            // repurpose angularjs' bootstrap popover library
            // and their position.js file, but I spent too
            // much time and had to table this.  -Ernie

            // https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js
            // https://github.com/angular-ui/bootstrap/blob/master/src/tooltip/tooltip.js
        }
    };
});

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

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxActionMenu.html',
    '<div class="rs-dropdown rs-{{type}}-dropdown" ng-class="{\'rs-nav-item\': type}"><a ng-if="text" class="rs-nav-link rs-dropdown-toggle" ng-click="toggle()">{{text}} <i class="rs-caret"></i> </a><button ng-if="!text" class="rs-cog" ng-click="toggle()"></button><div ng-class="{\'visible\': displayed }" ng-click="modalToggle()" ng-transclude></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxMeta.html',
    '<!-- TODO: remove in favor of auto detection --><div><div class="label">{{label}}:</div><div class="definition ng-transclude"></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxSortableColumn.html',
    '<div class="panel-header" ng-class="{ \'rs-table-sort-asc\': !reverse && predicate === sortProperty, \'rs-table-sort-desc\': reverse && predicate === sortProperty}" ng-click="sortMethod({property:sortProperty})"><span class="visually-hidden">Sort by&nbsp;</span> <span class="display-value" ng-transclude></span> <span class="visually-hidden">Sorted {{reverse ? \'ascending\' : \'descending\'}}</span> <span ng-if="predicate === sortProperty" class="rs-table-sort-indicator"></span></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxStatusColumn.html',
    '<span></span>');
}]);
