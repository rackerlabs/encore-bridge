angular.module('encore.bridge', ['encore.ui.rxCollapse','encore.ui.rxForm','encore.ui.rxRadio','encore.ui.rxSortableColumn','encore.ui.rxStatusColumn','encore.ui.utilities','encore.ui.elements']);

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

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:rxNestedElement
 * @description
 * Helper function to aid in the creation of boilerplate DDO definitions
 * required to validate nested custom elements.
 *
 * @param {Object=} opts - Options to merge with default DDO definitions
 * @param {String} opts.parent - Parent directive name
 * (i.e. defined NestedElement is an immediate child of this parent element)
 *
 * @return {Object} Directive Definition Object for a rxNestedElement
 *
 * @example
 * <pre>
 * angular.module('myApp', [])
 * .directive('parentElement', function (rxNestedElement) {
 *   return rxNestedElement();
 * })
 * .directive('childElement', function (rxNestedElement) {
 *   return rxNestedElement({
 *      parent: 'parentElement'
 *   });
 * });
 * </pre>
 */
.factory('rxNestedElement', function () {
    return function (opts) {
        opts = opts || {};

        var defaults = {
            restrict: 'E',
            /*
             * must be defined for a child element to verify
             * correct hierarchy
             */
            controller: angular.noop
        };

        if (angular.isDefined(opts.parent)) {
            opts.require = '^' + opts.parent;
            /*
             * bare minimum function definition needed for "require"
             * validation logic
             *
             * NOTE: `angular.noop` and `_.noop` WILL NOT trigger validation
             */
            opts.link = function () {};
        }

        return _.defaults(opts, defaults);
    };
});

/**
 * @ngdoc overview
 * @name elements
 * @requires utilities
 * @description
 * # Elements
 * Elements are visual directives.
 *
 * ## Directives
 * * {@link elements.directive:rxAccountInfo rxAccountInfo}
 * * {@link elements.directive:rxActionMenu rxActionMenu}
 * * {@link elements.directive:rxButton rxButton}
 * * {@link elements.directive:rxCheckbox rxCheckbox}
 * * {@link elements.directive:rxDatePicker rxDatePicker}
 * * {@link elements.directive:rxMetadata rxMetadata}
 * * {@link elements.directive:rxTimePicker rxTimePicker}
 */
angular.module('encore.ui.elements', [
    'encore.ui.utilities'
]);

angular.module('encore.ui.elements')
/**
 * @ngdoc directive
 * @name elements.directive:rxMetadata
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
 *       <li>{@link elements.directive:rxMeta rxMeta}</li>
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

angular.module('encore.ui.elements')
/**
 * @ngdoc directive
 * @name elements.directive:rxMeta
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
 *       <li>{@link elements.directive:rxMetadata rxMetadata}</li>
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

angular.module('encore.ui.elements')
/**
 * @name elements.directive:rxTimePicker
 * @ngdoc directive
 * @restrict E
 * @scope
 * @requires utilities.service:rxTimePickerUtil
 * @requires utilities.constant:UtcOffsets
 * @requires elements.directive:rxButton
 * @description Time Picker
 *
 * ## Notice
 * This element is designed to be used in conjunction with other picker
 * elements to compose a valid ISO 8601 DateTime string in the format of
 * <code>YYYY-MM-DDTHH:mmZ</code>.
 *
 * * This element will generate a **String** in the format of `HH:mmZ`
 *   to be used as the time portion of the ISO 8601 standard DateTime string
 *   mentioned above.
 * * This element will never generate anything other than a String.
 *
 * @param {expression} ngModel
 * Expression that evaluates to a time string in `HH:mmZ` format, where `Z`
 * should match `/[-+]\d{2}:\d{2}/`.
 *
 * @return {String} **IMPORTANT** returns an ISO 8601 standard time string in the
 * format of `HH:mmZ`.
 */
.directive('rxTimePicker', function (rxTimePickerUtil, UtcOffsets) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            modelValue: '=ngModel',
            isDisabled: '=ngDisabled'
        },
        templateUrl: 'templates/rxTimePicker.html',
        link: function (scope, el, attrs, ngModelCtrl) {
            var pickerUtil = rxTimePickerUtil;

            scope.availableUtcOffsets = UtcOffsets;

            scope.isPickerVisible = false;

            scope.openPopup = function () {
                scope.isPickerVisible = true;

                // default
                scope.hour = '';
                scope.minutes = '';
                scope.period = 'AM';
                scope.offset = '+00:00';

                if (!_.isEmpty(scope.modelValue)) {
                    var parsed = pickerUtil.modelToObject(scope.modelValue);
                    scope.hour = parsed.hour;
                    scope.minutes = parsed.minutes;
                    scope.period = parsed.period;
                    scope.offset = parsed.offset;
                }
            };//openPopup

            scope.closePopup = function () {
                scope.isPickerVisible = false;
            };

            /**
             * Toggle the popup and initialize form values.
             */
            scope.togglePopup = function () {
                if (!scope.isDisabled) {
                    if (scope.isPickerVisible) {
                        scope.closePopup();
                    } else {
                        scope.openPopup();
                    }
                }
            };//togglePopup()

            /**
             * Apply the popup selections to the $viewValue.
             */
            scope.submitPopup = function () {
                var time = moment([
                    (scope.hour + ':' + scope.minutes),
                    scope.period,
                    scope.offset
                ].join(' '), 'hh:mm A Z');

                // ensure moment is in expected timezone
                time.utcOffset(scope.offset);

                ngModelCtrl.$setViewValue(time.format(pickerUtil.viewFormat));

                // update the view
                ngModelCtrl.$render();

                scope.closePopup();
            };//submitPopup()

            /* Model -> View */
            ngModelCtrl.$formatters.push(function (modelVal) {
                var momentValue = moment(modelVal, pickerUtil.modelFormat);

                if (momentValue.isValid()) {
                    var offset = pickerUtil.parseUtcOffset(modelVal);

                    // change offset of moment to that of model value
                    // without this, moment will default to local offset
                    // (CST = -06:00) and the formatted output will be incorrect
                    momentValue.utcOffset(offset);

                    // Ensure that display value is in proper format
                    return momentValue.format(pickerUtil.viewFormat);
                } else {
                    return modelVal;
                }
            });

            /* View -> Model */
            ngModelCtrl.$parsers.push(function (viewVal) {
                var momentValue = moment(viewVal, pickerUtil.viewFormat);

                if (momentValue.isValid()) {
                    var offset = pickerUtil.parseUtcOffset(viewVal);

                    // change offset of moment to that of view value
                    // without this, moment will default to local offset
                    // (CST = -06:00) and the formatted output will be incorrect
                    momentValue.utcOffset(offset);

                    // Ensure that model value is in proper format
                    return momentValue.format(pickerUtil.modelFormat);
                } else {
                    return viewVal;
                }
            });

            ngModelCtrl.$render = function () {
                scope.displayValue = ngModelCtrl.$viewValue || '';
            };
        }//link
    };
});

angular.module('encore.ui.elements')
/**
 * @name elements.directive:rxDatePicker
 * @ngdoc directive
 * @restrict E
 * @scope
 * @description
 * Basic date picker.
 *
 * ## Notice
 * This element is designed to be used in conjunction with other picker
 * elements to compose a valid ISO 8601 DateTime string in the format of
 * <code>YYYY-MM-DDTHH:mmZ</code>.
 *
 * `rxDatePicker` provides the user a 10-year range before and after the selected date,
 * if present.  Otherwise, the range is calculated from today's date.
 *
 * * This element will generate a **String** in the format of `YYYY-MM-DD`
 *   to be used as the date portion of the ISO 8601 standard DateTime string
 *   mentioned above.
 * * This element will never generate anything other than a String.
 *
 * @param {expression} ngModel
 * Expression that evaluates to a date string in `YYYY-MM-DD` format
 *
 * @return {String} **IMPORTANT** returns an ISO 8601 standard date string in the
 * format of `YYYY-MM-DD`.
 */
.directive('rxDatePicker', function () {
    var isoFormat = 'YYYY-MM-DD';
    const YEAR_RANGE = 10;

    /**
     * @param {Moment} firstOfMonth
     * @return {Array<Moment>}
     * @description
     * Generate an array of Moment objects representing the visible
     * days on the calendar. This will automatically pad the calendar
     * with dates from previous/next month to fill out the weeks.
     */
    function buildCalendarDays (firstOfMonth) {
        var dateToken = firstOfMonth.clone().startOf('day');
        var currentMonth = dateToken.month();
        var days = [];
        var prependDay, appendDay;

        // add calendar month's days
        while (dateToken.month() === currentMonth) {
            days.push(dateToken.clone());
            dateToken.add(1, 'day');
        }

        // until first item of array is Sunday, prepend earlier days to array
        while (_.first(days).day() > 0) {
            prependDay = _.first(days).clone();
            days.unshift(prependDay.subtract(1, 'day'));
        }

        // until last item of array is Saturday, append later days to array
        while (_.last(days).day() < 6) {
            appendDay = _.last(days).clone();
            days.push(appendDay.add(1, 'day'));
        }

        return days;
    }//buildCalendarDays

    /**
     * @param {Moment} midpoint
     * @return {Array<ISO 8601 Year> }
     * @description
     * Generate an array of ISO 8601 Year (format "YYYY") years.
     */
    function generateCalendarYears (midpoint) {
        var calendarYears = [];
        var iterator = midpoint.clone().subtract(YEAR_RANGE, 'years');
        var limit = midpoint.clone().add(YEAR_RANGE, 'years');

        while (iterator.year() <= limit.year()) {
            calendarYears.push(iterator.year());

            iterator.add(1, 'year');
        }

        return calendarYears;
    }//generateCalendarYears

    return {
        templateUrl: 'templates/rxDatePicker.html',
        restrict: 'E',
        require: 'ngModel',
        scope: {
            selected: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            var today = moment(new Date());

            scope.calendarVisible = false;
            // keep track of which month we're viewing in the popup (default to 1st of this month)
            scope.calendarMonth = today.clone().startOf('month');

            /* ===== "Public" Functions ===== */
            scope.toggleCalendar = function () {
                if (_.isUndefined(attrs.disabled)) {
                    scope.calendarVisible = !scope.calendarVisible;
                }
            };//toggleCalendar()

            scope.closeCalendar = function () {
                scope.calendarVisible = false;
            };

            /**
             * @param {String} destination
             * @description Modifies `scope.calendarMonth` to regenerate calendar
             */
            scope.navigate = function (destination) {
                var newCalendarMonth = scope.calendarMonth.clone();
                switch (destination) {
                    case 'nextMonth': {
                        newCalendarMonth.add(1, 'month');
                        break;
                    }
                    case 'prevMonth': {
                        newCalendarMonth.subtract(1, 'month');
                        break;
                    }
                }
                scope.calendarMonth = newCalendarMonth;
            };//navigate

            /**
             * @param {Moment} date
             */
            scope.selectDate = function (date) {
                scope.selected = date.format(isoFormat);
                scope.calendarVisible = false;
            };//selectDate()

            /**
             * @param {Moment} day
             * @return {Boolean}
             */
            scope.isToday = function (day) {
                return moment(day).isSame(today, 'day');
            };//isToday()

            /**
             * @param {Moment} day
             * @return {Boolean}
             */
            scope.isMonth = function (day) {
                return moment(day).isSame(scope.calendarMonth, 'month');
            };//isMonth()

            /**
             * @param {Moment} day
             * @return {Boolean}
             */
            scope.isSelected = function (day) {
                if (_.isUndefined(scope.selected)) {
                    return false;
                } else {
                    return moment(day).isSame(scope.selected, 'day');
                }
            };//isSelected()

            /* ===== OBSERVERS ===== */

            // Set calendar month on change of selected date
            scope.$watch('selected', function (newVal) {
                if (_.isEmpty(newVal)) {
                    scope.calendarMonth = today.clone().startOf('month');
                } else {
                    var parsed = moment(newVal, isoFormat);

                    if (parsed.isValid()) {
                        scope.calendarMonth = parsed.startOf('month');
                    }
                }
            });

            // Regenerate calendar if month changes
            scope.$watch('calendarMonth', function (newVal) {
                scope.calendarDays = buildCalendarDays(newVal);
                scope.currentMonth = newVal.format('MM');
                scope.currentYear = newVal.format('YYYY');
                scope.calendarYears = generateCalendarYears(newVal);
            });

            scope.$watch('currentMonth', function (newVal) {
                if (!_.isEmpty(newVal)) {
                    var dateString = [scope.currentYear, newVal, '01'].join('-');
                    var parsed = moment(dateString, isoFormat);

                    if (parsed.isValid()) {
                        scope.calendarMonth = parsed;
                    }
                }
            });

            scope.$watch('currentYear', function (newVal) {
                if (!_.isEmpty(newVal)) {
                    var dateString = [newVal, scope.currentMonth, '01'].join('-');
                    var parsed = moment(dateString, isoFormat);

                    if (parsed.isValid()) {
                        scope.calendarMonth = parsed;
                    }
                }
            });

            ngModelCtrl.$formatters.push(function (modelVal) {
                var parsed = moment(modelVal, isoFormat);
                ngModelCtrl.$setValidity('date', parsed.isValid());

                if (parsed.isValid()) {
                    return parsed.format('MMMM DD, YYYY');
                } else {
                    return null;
                }
            });

            ngModelCtrl.$render = function () {
                scope.displayValue = ngModelCtrl.$viewValue;
            };
        }
    };
});

angular.module('encore.ui.elements')
/**
 * @name elements.directive:rxCheckbox
 * @ngdoc directive
 * @restrict A
 * @scope
 * @description
 * Attribute directive that wraps a native checkbox element in markup required for styling purposes.
 *
 * ## Styling
 *
 * Directive results in an **inline-block element**
 * You can style the output against decendents of the **`.rxCheckbox`** CSS class.
 *
 * ## Show/Hide
 *
 * If you wish to show/hide your `rxCheckbox` element (and its label), we recommend
 * placing the element (and its label) inside of a `<div>` or `<span>` wrapper,
 * and performing the show/hide logic on the wrapper.
 *
 * <pre>
 * <span ng-show="isShown">
 *     <input rx-checkbox id="chkDemo" ng-model="chkDemo" />
 *     <label for="chkDemo">Label for Demo Checkbox</label>
 * </span>
 * </pre>
 *
 * It is highly recommended that you use `ng-show` and `ng-hide` for purposes of
 * display logic. Because of the way that `ng-if` and `ng-switch` directives behave
 * with scope, they may introduce unnecessary complexity in your code.
 *
 * @example
 * <pre>
 * <input rx-checkbox ng-model="demoValue" />
 * </pre>
 *
 * @param {Boolean=} [ng-disabled=false] Determines if the control is disabled.
 */
.directive('rxCheckbox', function () {
    return {
        restrict: 'A',
        scope: {
            ngDisabled: '=?'
        },
        compile: function (tElement, tAttrs) {
            // automatically set input type
            tElement.attr('type', 'checkbox');
            tAttrs.type = 'checkbox';

            return function (scope, element, attrs) {
                var disabledClass = 'rx-disabled';
                var wrapper = '<div class="rxCheckbox"></div>';
                var fakeCheckbox = '<div class="fake-checkbox">' +
                        '<div class="tick fa fa-check"></div>' +
                    '</div>';

                element.wrap(wrapper);
                element.after(fakeCheckbox);
                // must be defined AFTER the element is wrapped
                var parent = element.parent();

                // apply/remove disabled attribute so we can
                // apply a CSS selector to style sibling elements
                if (attrs.disabled) {
                    parent.addClass(disabledClass);
                }
                if (_.has(attrs, 'ngDisabled')) {
                    scope.$watch('ngDisabled', function (newVal) {
                        if (newVal === true) {
                            parent.addClass(disabledClass);
                        } else {
                            parent.removeClass(disabledClass);
                        }
                    });
                }

                var removeParent = function () {
                    parent.remove();
                };

                // remove stylistic markup when element is destroyed
                element.on('$destroy', function () {
                    scope.$evalAsync(removeParent);
                });
            };
        }//compile
    };
});//rxCheckbox

angular.module('encore.ui.elements')
/**
 * @ngdoc directive
 * @name elements.directive:rxActionMenu
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

angular.module('encore.ui.elements')
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
 * @name rxRadio
 * @description
 * # rxRadio Component
 *
 * The rxRadio component wraps a native radio element in markup required for styling purposes.
 *
 * ## Directives
 * * {@link rxRadio.directive:rxRadio rxRadio}
 */
angular.module('encore.ui.rxRadio', []);

angular.module('encore.ui.rxRadio')
/**
 * @name rxRadio.directive:rxRadio
 * @ngdoc directive
 * @restrict A
 * @scope
 * @description
 * rxRadio is an attribute directive that wraps a native radio element in markup required for styling purposes.
 * To use the directive, you can replace `type="radio"` with `rx-radio`. The directive is smart enough to set
 * the correct input type.
 *
 * # Styling
 * Directive results in an inline-block element.
 * You can style the output against decendents of the **`.rxRadio`** CSS class.
 *
 * # Show/Hide
 * If you wish to show/hide your `rxRadio` element (and its label), we recommend placing the element (and its label)
 * inside of a `<div>` or `<span>` wrapper, and performing the show/hide logic on the wrapper.
 * <pre>
 * <span ng-show="isShown">
 *   <input rx-radio id="radDemo" ng-model="radDemo" />
 *   <label for="radDemo">Label for Demo Radio</label>
 * </span>
 * </pre>
 *
 * It is highly recommended that you use `ng-show` and `ng-hide` for display logic.
 * Because of the way that `ng-if` and `ng-switch` directives behave with scope, they may
 * introduce unnecessary complexity in your code.
 *
 * @example
 * <pre>
 * <input rx-radio id="radDemo" ng-model="radDemo" />
 * <label for="radDemo">Label for Demo Radio</label>
 * </pre>
 *
 * @param {Boolean=} [ng-disabled=false] Determines if control is disabled.
 */
.directive('rxRadio', function () {
    return {
        restrict: 'A',
        scope: {
            ngDisabled: '=?'
        },
        compile: function (tElement, tAttrs) {
            // automatically set input type
            tElement.attr('type', 'radio');
            tAttrs.type = 'radio';

            return function (scope, element, attrs) {
                var disabledClass = 'rx-disabled';
                var wrapper = '<div class="rxRadio"></div>';
                var fakeRadio = '<div class="fake-radio">' +
                        '<div class="tick"></div>' +
                    '</div>';

                element.wrap(wrapper);
                element.after(fakeRadio);
                // must be defined AFTER the element is wrapped
                var parent = element.parent();

                // apply/remove disabled attribute so we can
                // apply a CSS selector to style sibling elements
                if (attrs.disabled) {
                    parent.addClass(disabledClass);
                }
                if (_.has(attrs, 'ngDisabled')) {
                    scope.$watch('ngDisabled', function (newVal) {
                        if (newVal === true) {
                            parent.addClass(disabledClass);
                        } else {
                            parent.removeClass(disabledClass);
                        }
                    });
                }

                var removeParent = function () {
                    parent.remove();
                };

                // remove stylistic markup when element is destroyed
                element.on('$destroy', function () {
                    scope.$evalAsync(removeParent);
                });
            };
        }//compile
    };
});

/**
 * @ngdoc overview
 * @name rxForm
 * @description
 * # rxForm Component
 *
 * The rxForm component contains a set of directives used to create forms throughout Encore.  These directives provide
 * a common HTML layout and style for all form elements, which helps ensure form accessibility and makes creating new
 *  forms easier.
 *
 * ## Directives Are Hierarchical
 *
 * To provide a standard layout of form fields (and so CSS rules can apply that layout), most of the new directives
 *  must be nested in a specific hierarchy.
 *  If you do not nest these elements properly, Angular will throw an error (this is by design). So, rule of thumb,
 *  aim for `0` console errors.
 *
 * These directives must be nested in the following hierarchy (*the ranges (e.g., 0..1) below denote how many items can
 *  be nested within its parent*):
 *
 * * {@link rxForm.directive:rxForm rxForm}
 *   * {@link rxForm.directive:rxFormSection rxFormSection} (0..N)
 *      * {@link rxSelectFilter.directive:rxSelectFilter rxSelectFilter} (0..N)
 *      * {@link rxForm.directive:rxField rxField} (0..N)
 *        * {@link rxForm.directive:rxFieldName rxFieldName} (0..1)
 *        * {@link rxForm.directive:rxFieldContent rxFieldContent} (0..1)
 *          * {@link rxForm.directive:rxInput rxInput} (0..N)
 *            * {@link rxForm.directive:rxPrefix rxPrefix} (0..1)
 *            * {@link rxForm.directive:rxInfix rxInfix} (0..1)
 *            * {@link rxForm.directive:rxSuffix rxSuffix} (0..1)
 *
 * ## Free-Range Directives
 * These directives are not limited to their placement and can be used anywhere:
 *
 * * {@link rxForm.directive:rxHelpText rxHelpText}
 *   * Designed to style form control help text.
 * * {@link rxForm.directive:rxInlineError rxInlineError}
 *   * Designed to style form control error messages.
 *
 * ## Compatible Modules
 * These modules work well with rxForm.
 *
 * * {@link elements.directive:rxButton rxButton}
 * * {@link rxCharacterCount}
 * * {@link elements.directive:rxCheckbox rxCheckbox}
 * * {@link rxMultiSelect}
 * * {@link rxOptionTable}
 * * {@link rxRadio}
 * * {@link rxSearchBox}
 * * {@link rxSelect}
 * * {@link rxToggleSwitch}
 * * {@link typeahead}
 *
 * # Layout
 *
 * ## Stacked Field Arrangement
 * By default, `rx-form-section` will arrange its children inline, in a row.  To obtain a stacked, columnar layout
 * for a particular section, place the `stacked` attribute on the `rx-form-section` element.  This will arrange the
 * `rx-field`, `rx-select-filter`, and `div` children elements in a columnar fashion.  This can be used in conjunction
 * with sections taking the full width of the form.
 *
 *  *See "Advanced Inputs" in the {@link /encore-ui/#/components/rxForm demo} for an example.*
 *
 * ## Responsive
 * `rx-field` and `div` elements that are immediate children of `rx-form-section` will grow from 250px to full width of
 * the section.  As such, you will see that these elements will wrap in the section if there's not enough width to
 * accomodate more than one child.
 *
 * *You can see this in the {@link /encore-ui/#/components/rxForm demo} if you resize the width of your browser.*
 *
 * # Validation
 *
 * ## Required Fields
 * When displaying a field that should be required, please make use of the `ng-required` attribute for rxFieldName.
 * When the value evaluates to true, an asterisk will display to the left of the field name.  You can see an example
 * of this with the "Required Textarea" field name in the {@link /encore-ui/#/components/rxForm demo}.
 *
 * See {@link rxForm.directive:rxFieldName rxFieldName}
 * API Documentation for more information.
 *
 * ## Custom Validators
 *
 * Angular provides its own validator when you use `type="email"`, and you can use `<rx-inline-error>` to turn email
 * validation errors into a styled message.  You can also use this element if you define a custom validator.
 *
 * ### Foocheck validator
 * The example shown in the "Email Address" example, uses a custom `foocheck` validator. Note that it is enabled by
 * placing the `foocheck` attribute in the `<input>` element, and using it with
 * `ng-show="demoForm.userEmail.$error.foocheck"`.  Check out the Javascript tab in
 * the {@link /encore-ui/#/components/rxForm demo} to see how this validator is implemented.
 *
 * There are plenty of examples online showing the same thing.
 *
 * # Migrating Old Code
 *
 * ## Deprecated Directives
 * **The following directives have been deprecated and *will be removed* in a future release of the EncoreUI
 * framework.** They are still functional, but **WILL display a warning in the javascript console** to let you know
 * you should upgrade your code.
 *
 * ### **rxFormItem**
 * See "Before & After" below
 *
 * ### **rxFormFieldset**
 * Closest equivalent is to use `rxFormSection`. Your individual project requirements will vary, but the `legend`
 * attribute can be replaced with a heading variant where applicable.
 *
 * * If your legend pertains to at least one row, place a heading variant before the desired `rx-form-section`
 * element.
 * * If your legend pertains to controls in a single column, place a heading variant within the `rx-field`
 * element at the top.
 *
 * ## Before &amp; After
 * The `rxFormItem` has been found to be incredibly brittle and prone to breakage. The new markup may look a little
 * wordy, but it is designed to provide enough flexibility for advanced field inputs. To be explicit, the new directives
 * were designed based on feedback around:
 *
 * * applying custom HTML markup for `label`, `description`, `prefix`, and `suffix` properties
 * * standardizing form layout functionality
 * * eliminating unnecessary CSS class definitions
 *
 * The following are some examples comparing what code looked like using the old directives versus the new directives.
 *
 * ### Email Address
 * #### Before
 * <pre>
 * <form name="demoForm">
 *   <rx-form-item label="Email address" description="Must contain foo.">
 *     <input name="userEmail" type="email" ng-model="details.email" foocheck />
 *     <div ng-show="demoForm.userEmail.$error.email" class="inline-error">
 *         Invalid email
 *     </div>
 *     <div ng-show="demoForm.userEmail.$error.foocheck" class="inline-error">
 *         Your email address must contain 'foo'
 *     </div>
 *   </rx-form-item>
 * </form>
 * </pre>
 *
 * #### After
 * <pre>
 * <form name="demoForm" rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Email address:</rx-field-name>
 *       <rx-field-content>
 *         <rx-input>
 *           <input name="userEmail" type="email" ng-model="details.email" foocheck />
 *         </rx-input>
 *         <rx-help-text>Must contain foo.</rx-help-text>
 *         <rx-inline-error ng-show="demoForm.userEmail.$error.email">
 *             Invalid email
 *         </rx-inline-error>
 *         <rx-inline-error ng-show="demoForm.userEmail.$error.foocheck">
 *             Your email address must contain 'foo'
 *         </rx-inline-error>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * </pre>
 *
 * ### Monthly Cost
 * #### Before
 * <pre>
 * <form name="demoForm">
 *   <rx-form-item label="Monthly Cost" prefix="$" suffix="million">
 *     <input type="number" ng-model="volume.cost" />
 *   </rx-form-item>
 * </form>
 * </pre>
 * #### After
 * <pre>
 * <form name="demoForm" rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Monthly Cost:</rx-field-name>
 *       <rx-field-content>
 *         <rx-input>
 *           <rx-prefix>$</rx-prefix>
 *           <input type="number" ng-model="volume.cost" />
 *           <rx-suffix>million</rx-suffix>
 *         </rx-input>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * </pre>
 *
 * ## Hierarchical Directives
 * * {@link rxForm.directive:rxForm rxForm}
 * * {@link rxForm.directive:rxFormSection rxFormSection}
 * * {@link rxForm.directive:rxField rxField}
 * * {@link rxForm.directive:rxFieldName rxFieldName}
 * * {@link rxForm.directive:rxFieldContent rxFieldContent}
 * * {@link rxForm.directive:rxInput rxInput}
 * * {@link rxForm.directive:rxPrefix rxPrefix}
 * * {@link rxForm.directive:rxSuffix rxSuffix}
 *
 * ## Free-Range Directives
 * * {@link rxForm.directive:rxHelpText rxHelpText}
 * * {@link rxForm.directive:rxInlineError rxInlineError}
 *
 * ### Related Directives
 * * {@link elements.directive:rxButton rxButton}
 * * {@link rxCharacterCount.directive:rxCharacterCount rxCharacterCount}
 * * {@link elements.directive:rxCheckbox rxCheckbox}
 * * {@link rxOptionTable.directive:rxOptionTable rxOptionTable}
 * * {@link rxRadio.directive:rxRadio rxRadio}
 * * {@link rxSelect.directive:rxSelect rxSelect}
 * * {@link rxToggleSwitch.directive:rxToggleSwitch rxToggleSwitch}
 *
 */
angular.module('encore.ui.rxForm', [
    'ngSanitize',
    'encore.ui.utilities'
]);

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxSuffix
 * @ngdoc directive
 * @restrict E
 * @description
 * Structural element directive used to wrap content to be placed
 * inline with a form control element.
 *
 * * Best placed after a form control element.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**inline block** *(only as wide as necessary for content)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>{@link rxForm.directive:rxInput rxInput}</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxPrefix rxPrefix}</li>
 *       <li>{@link rxForm.directive:rxInfix rxInfix}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 *
 *   <dt>Children:</dt>
 *   <dd>Any HTML Element</dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Salary:</rx-field-name>
 *       <rx-field-content>
 *         <rx-input>
 *           <rx-prefix>$</rx-prefix>
 *           <input type="number" />
 *           <rx-suffix>Million</rx-suffix>
 *         </rx-input>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxSuffix', function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxInput'
    });
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxPrefix
 * @ngdoc directive
 * @restrict E
 * @description
 * Structural element directive used to wrap content to be placed
 * inline with a form control element.
 *
 * * Best placed before a form control element.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**inline block** *(only as wide as necessary for content)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>{@link rxForm.directive:rxInput rxInput}</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxInfix rxInfix}</li>
 *       <li>{@link rxForm.directive:rxSuffix rxSuffix}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 *
 *   <dt>Children:</dt>
 *   <dd>Any HTML Element</dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Salary:</rx-field-name>
 *       <rx-field-content>
 *         <rx-input>
 *           <rx-prefix>$</rx-prefix>
 *           <input type="number" />
 *           <rx-suffix>Million</rx-suffix>
 *         </rx-input>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxPrefix', function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxInput'
    });
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxInput
 * @ngdoc directive
 * @restrict E
 * @description
 * Structural element directive used for layout of sub-elements.
 * Place your HTML control elements within this directive.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**block** *(full width of parent)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>{@link rxForm.directive:rxFieldContent rxFieldContent}</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>Any HTML Element</dd>
 *
 *   <dt>Children:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxPrefix rxPrefix}</li>
 *       <li>{@link rxForm.directive:rxSuffix rxSuffix}</li>
 *       <li>{@link elements.directive:rxCheckbox rxCheckbox}</li>
 *       <li>{@link rxRadio.directive:rxRadio rxRadio}</li>
 *       <li>{@link rxSelect.directive:rxSelect rxSelect}</li>
 *       <li>{@link rxToggleSwitch.directive:rxToggleSwitch rxToggleSwitch}</li>
 *       <li>{@link rxOptionTable.directive:rxOptionTable rxOptionTable}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Salary:</rx-field-name>
 *       <rx-field-content>
 *         <rx-input>
 *           <input type="number" />
 *         </rx-input>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxInput', function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxFieldContent'
    });
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxInlineError
 * @ngdoc directive
 * @restrict E
 * @description
 * Stylistic element directive used to wrap an error message.
 *
 * * **block** element *(full width of parent)*
 * * Best used as a sibling after {@link rxForm.directive:rxInput rxInput},
 *   and {@link rxForm.directive:rxHelpText rxHelpText} elements.
 *
 * @example
 * <pre>
 * ...
 * <form rx-form name="demoForm">
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Salary:</rx-field-name>
 *       <rx-field-content>
 *         <rx-input>
 *           <rx-prefix>$</rx-prefix>
 *           <input type="number" name="salary" min="1000000" ng-model="salary" />
 *           <rx-suffix>Million</rx-suffix>
 *         </rx-input>
 *         <rx-inline-error ng-show="demoForm.salary.$errors.min">
 *           Salary must be above $1,000,000
 *         </rx-inline-error>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxInlineError', function () {
    return {
        restrict: 'E'
    };
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxInfix
 * @ngdoc directive
 * @restrict E
 * @description
 * Structural element directive used to wrap content to be placed
 * inline with a form control element.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**inline block** *(only as wide as necessary for content)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>{@link rxForm.directive:rxInput rxInput}</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxPrefix rxPrefix}</li>
 *       <li>{@link rxForm.directive:rxSuffix rxSuffix}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 *
 *   <dt>Children:</dt>
 *   <dd>Any HTML Element</dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Time of Day:</rx-field-name>
 *       <rx-field-content>
 *         <rx-input>
 *           <input type="number" name="hours" />
 *           <rx-infix>:</rx-infix>
 *           <input type="number" name="minutes" />
 *         </rx-input>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxInfix', function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxInput'
    });
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxHelpText
 * @ngdoc directive
 * @restrict E
 * @description
 * Stylistic element directive used to wrap form input help text.
 *
 * * **block** element *(full width of parent)*
 * * Best used as a sibling after {@link rxForm.directive:rxInput rxInput},
 *   but before {@link rxForm.directive:rxInlineError rxInlineError} elements.
 *
 * @example
 * <pre>
 * ...
 * <form rx-form name="demoForm">
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Salary:</rx-field-name>
 *       <rx-field-content>
 *         <rx-input>
 *           <rx-prefix>$</rx-prefix>
 *           <input type="number" name="salary" />
 *           <rx-suffix>Million</rx-suffix>
 *         </rx-input>
 *         <rx-help-text>Must be greater than $1,000,000</rx-help-text>
 *         <rx-inline-error ng-show="demoForm.salary.$errors.minimum">
 *           Salary must be above $1,000,000
 *         </rx-inline-error>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxHelpText', function () {
    return {
        restrict: 'E'
    };
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxFormSection
 * @ngdoc directive
 * @restrict E
 * @description
 * Structural element directive used for layout of sub-elements.
 *
 * By default, all `rxField`, `rxSelectFilter`, and `<div>` elements will display inline (horizontally).
 * If you wish to display these elements in a stacked manner, you may
 * place the `stacked` attribute on `rx-form-section`.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**block** *(full width of parent)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>{@link rxForm.directive:rxForm rxForm}</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>Any HTML Element</dd>
 *
 *   <dt>Children:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxField rxField}</li>
 *       <li>{@link rxSelectFilter.directive:rxSelectFilter rxSelectFilter}</li>
 *       <li>HTML DIV Element</li>
 *     </ul>
 *   </dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form>
 *   <rx-form-section>
 *     <rx-field>...</rx-field>
 *     <rx-select-filter>...</rx-select-filter>
 *     <div>...</div>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 *
 * @param {*=} stacked
 * If present, `rxField` children will stack vertically rather than
 * display horizontally.
 */
.directive('rxFormSection', function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxForm'
    });
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxForm
 * @ngdoc directive
 * @restrict A
 * @description
 * The rxForm directive is an attribute directive meant to be used for
 * hierarchical validation of form-related elements. This directive may
 * be placed on ANY DOM element, not just `<form>`.
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
 *       <li>{@link rxForm.directive:rxFormSection rxFormSection}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form><!-- you can use a DIV, if desired -->
 *   <rx-form-section>
 *     ...
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxForm', function (rxNestedElement) {
    return rxNestedElement({
        restrict: 'A'
    });
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxFieldName
 * @ngdoc directive
 * @restrict E
 * @scope
 * @description
 * Stylistic element directive that provides a standardized UI for
 * form field names.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**block** *(full width of parent)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>{@link rxForm.directive:rxField rxField}</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxFieldContent rxFieldContent}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 *
 *   <dt>Children:</dt>
 *   <dd>Any HTML Element</dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>Salary</rx-field-name>
 *       <rx-field-content>...</rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 *
 * @param {Boolean=} [ng-required=false]
 * Is this field required? This will add/remove the required symbol to the left of the name.
 */
.directive('rxFieldName', function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxField',
        transclude: true,
        scope: {
            ngRequired: '=?'
        },
        templateUrl: 'templates/rxFieldName.html'
    });
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxFieldContent
 * @ngdoc directive
 * @restrict E
 * @description
 * Structural element directive used for layout of sub-elements.
 * This element is used to wrap the actual content markup for your
 * controls, labels, help text, and error messages.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**block** *(full width of parent)*</dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>{@link rxForm.directive:rxField rxField}</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxFieldName rxFieldName}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 *
 *   <dt>Children:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxInput rxInput}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>
 *          <i class="fa fa-exclamation"></i>
 *          Important Field Name
 *       </rx-field-name>
 *       <rx-field-content>
 *          <rx-input>...</rx-input>
 *       </rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxFieldContent', function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxField'
    });
});

angular.module('encore.ui.rxForm')
/**
 * @name rxForm.directive:rxField
 * @ngdoc directive
 * @restrict E
 * @description
 * Structural element directive used for layout of sub-elements.
 *
 * <dl>
 *   <dt>Display:</dt>
 *   <dd>**block**
 *     <ul>
 *       <li>default: *shares width equally with sibling `rxField` and `div` elements*</li>
 *       <li>stacked: *max-width: 400px*</li>
 *     </ul>
 *   </dd>
 *
 *   <dt>Parent:</dt>
 *   <dd>{@link rxForm.directive:rxFormSection rxFormSection}</dd>
 *
 *   <dt>Siblings:</dt>
 *   <dd>Any HTML Element</dd>
 *
 *   <dt>Children:</dt>
 *   <dd>
 *     <ul>
 *       <li>{@link rxForm.directive:rxFieldName rxFieldName}</li>
 *       <li>{@link rxForm.directive:rxFieldContent rxFieldContent}</li>
 *       <li>Any HTML Element</li>
 *     </ul>
 *   </dd>
 * </dl>
 *
 * @example
 * <pre>
 * ...
 * <form rx-form>
 *   <rx-form-section>
 *     <rx-field>
 *       <rx-field-name>...</rx-field-name>
 *       <rx-field-content>...</rx-field-content>
 *     </rx-field>
 *   </rx-form-section>
 * </form>
 * ...
 * </pre>
 */
.directive('rxField', function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxFormSection'
    });
});

/**
 * @ngdoc overview
 * @name rxCollapse
 * @description
 * # rxCollapse Component
 *
 * `rxCollapse` component is used to display and hide content on a page.
 *
 * ## Directives
 * * {@link rxCollapse.directive:rxCollapse rxCollapse}
 */
angular.module('encore.ui.rxCollapse', []);

angular.module('encore.ui.rxCollapse')
/**
 * @ngdoc directive
 * @name rxCollapse.directive:rxCollapse
 * @restrict E
 * @scope
 * @description
 * `rxCollapse` directive hides and shows an element with a transition.  It can be configured to show as either expanded
 * or collapsed on page load.  A double chevron(**>>**) is used to toggle between show and hide contents, while keeping
 * the header and border visible.
 *
 * ## Hide/Show Content
 *
 * * This pattern was developed for areas displaying metadata that may be short on screen real estate, as a way to hide
 *  data on load that is not as important to the user in the context where they are presented.  `rxCollapse` toggles
 *  between the *optional* `title` parameter with "*See More*" or "*See Less*".
 * * This pattern is not very responsive-friendly, since as browser width decreases, columns will wrap. As columns wrap,
 *  the "*See More*" `rxCollapse` elements get lost in the new context, which is bad for user experience.
 * * To avoid the problem described above, "*See More*" `rxCollapse` elements should only be used at the end of the
 * final column present on the page, so that when the columns wrap via flexbox, "*See More*" is always last and doesn't
 * get lost in between metadata key/value pairs.
 *
 *
 * @param {String=} [title="See More/See Less"]
 * The title to display next to the toggle button. Default is "See More/See Less" toggle.
 * @param {Boolean=} [expanded='true']
 * Initially expanded or collapsed. Default is expanded.
 *
 * @example
 * <pre>
 * <rx-collapse title="Filter results" expanded="true">Text Here</rx-collapse>
 * <rx-collapse expanded="true">Text Here</rx-collapse>
 * </pre>
 */
.directive('rxCollapse', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/rxCollapse.html',
        transclude: true,
        scope: {
            title: '@'
        },
        link: function (scope, element, attrs) {
            scope.isExpanded = (attrs.expanded === 'false') ? false : true;

            scope.toggleExpanded = function () {
                scope.isExpanded = !scope.isExpanded;
            };
        }
    };
});

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxCollapse.html',
    '<div class="rs-facet-section rs-collapsible-section {{isExpanded ? \'expanded\' : \'collapsed\'}}"><div ng-if="title" class="rs-detail-section-header"><div class="rs-caret" ng-click="toggleExpanded()"></div><div class="rs-detail-section-title">{{title}}</div></div><div class="rs-detail-section-body" ng-transclude></div><div ng-if="!title && !isExpanded" class="rs-facet-section-toggle" ng-click="toggleExpanded()"><i class="rs-facet-toggle-arrow"></i> more</div><div ng-if="!title && isExpanded" class="rs-facet-section-toggle" ng-click="toggleExpanded()"><i class="rs-facet-toggle-arrow"></i> less</div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxFieldName.html',
    '<span class="wrapper"><span ng-show="ngRequired" class="required-symbol">*</span> <span ng-transclude class="rx-field-name-content"></span></span>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxFormItem.html',
    '<div class="form-item" ng-class="{\'text-area-label\': isTextArea}"><label class="field-label">{{label}}:</label><div class="field-content"><span class="field-prefix" ng-if="prefix">{{prefix}}</span><!-- Form input will be added here --> <span class="field-input-wrapper" ng-transclude></span><!-- The directve will also put \n' +
    '            \n' +
    '            <span class="field-suffix">{{ suffix }}</span> \n' +
    '        \n' +
    '        in after the `input` that we transclude, but before any other content we transclude\n' +
    '        --><div ng-if="description" class="field-description" ng-bind-html="description"></div></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxSortableColumn.html',
    '<div class="panel-header" ng-class="{ \'rs-table-sort-asc\': !reverse && predicate === sortProperty, \'rs-table-sort-desc\': reverse && predicate === sortProperty}" ng-click="sortMethod({property:sortProperty})"><span class="visually-hidden">Sort by&nbsp;</span> <span class="display-value" ng-transclude></span> <span class="visually-hidden">Sorted {{reverse ? \'ascending\' : \'descending\'}}</span> <span ng-if="predicate === sortProperty" class="rs-table-sort-indicator"></span></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxStatusColumn.html',
    '<span></span>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxActionMenu.html',
    '<div class="rs-dropdown rs-{{type}}-dropdown" ng-class="{\'rs-nav-item\': type}"><a ng-if="text" class="rs-nav-link rs-dropdown-toggle" ng-click="toggle()">{{text}} <i class="rs-caret"></i> </a><button ng-if="!text" class="rs-cog" ng-click="toggle()"></button><div ng-class="{\'visible\': displayed }" ng-click="modalToggle()" ng-transclude></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxDatePicker.html',
    '<div class="rxDatePicker wrapper"><div class="control" ng-click="toggleCalendar()"><time class="displayValue" datetime="{{selected}}">{{displayValue}} </time><i class="icon fa fa-fw fa-calendar"></i></div><div class="backdrop" ng-click="closeCalendar()" ng-if="calendarVisible"></div><div class="popup" ng-show="calendarVisible"><nav><span class="arrow prev fa fa-lg fa-angle-double-left" ng-click="navigate(\'prevMonth\')"></span> <span class="month-wrapper"><select rx-select class="month" ng-model="currentMonth" ng-selected="{{month = currentMonth}}"><option value="01">Jan</option><option value="02">Feb</option><option value="03">Mar</option><option value="04">Apr</option><option value="05">May</option><option value="06">Jun</option><option value="07">Jul</option><option value="08">Aug</option><option value="09">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option></select></span><span class="year-wrapper"><select rx-select class="year" ng-model="currentYear" ng-selected="{{year = currentYear}}"><option ng-repeat="year in calendarYears">{{year}}</option></select></span><span class="arrow next fa fa-lg fa-angle-double-right" ng-click="navigate(\'nextMonth\')"></span></nav><div class="calendar"><header><h6>S</h6><h6>M</h6><h6>T</h6><h6>W</h6><h6>T</h6><h6>F</h6><h6>S</h6></header><div class="day {{ isMonth(day) ? \'inMonth\' : \'outOfMonth\' }}" data-date="{{day.format(\'YYYY-MM-DD\')}}" ng-class="{ today: isToday(day), selected: isSelected(day) }" ng-repeat="day in calendarDays" ng-switch="isMonth(day)"><span class="circle" ng-switch-when="true" ng-click="selectDate(day)">{{ day.date() }} </span><span ng-switch-when="false">{{ day.date() }}</span></div></div></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxTimePicker.html',
    '<div class="rxTimePicker wrapper"><div class="control" ng-click="togglePopup()"><input type="text" data-time="{{modelValue}}" class="displayValue" ng-model="displayValue"><div class="overlay"><i class="icon fa fa-fw fa-clock-o"></i></div></div><div class="popup" ng-show="isPickerVisible"><form rx-form name="timePickerForm"><rx-form-section><rx-field><rx-field-content><rx-input><input type="text" name="hour" class="hour" maxlength="2" autocomplete="off" ng-required="true" ng-pattern="/^(1[012]|0?[1-9])$/" ng-model="hour"><rx-infix>:</rx-infix><input type="text" name="minutes" class="minutes" maxlength="2" autocomplete="off" ng-required="true" ng-pattern="/^[0-5][0-9]$/" ng-model="minutes"><rx-suffix><select rx-select name="period" class="period" ng-model="period"><option value="AM">AM</option><option value="PM">PM</option></select></rx-suffix><rx-suffix class="offsetWrapper"><select rx-select name="utcOffset" class="utcOffset" ng-model="offset"><option ng-repeat="utcOffset in availableUtcOffsets" ng-selected="{{utcOffset === offset}}">{{utcOffset}}</option></select></rx-suffix></rx-input><rx-inline-error ng-if="timePickerForm.hour.$dirty && !timePickerForm.hour.$valid">Invalid Hour</rx-inline-error><rx-inline-error ng-if="timePickerForm.minutes.$dirty && !timePickerForm.minutes.$valid">Invalid Minutes</rx-inline-error></rx-field-content></rx-field></rx-form-section><rx-form-section class="actions"><div><rx-button classes="done" default-msg="Done" disable="!timePickerForm.$valid" ng-click="submitPopup()"></rx-button>&nbsp;<rx-button classes="cancel" default-msg="Cancel" ng-click="closePopup()"></rx-button></div></rx-form-section></form></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxMeta.html',
    '<!-- TODO: remove in favor of auto detection --><div><div class="label">{{label}}:</div><div class="definition ng-transclude"></div></div>');
}]);
