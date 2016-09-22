angular.module('encore.bridge', ['encore.ui.layout','encore.ui.rxApp','encore.ui.rxCollapse','encore.ui.rxForm','encore.ui.rxPopover','encore.ui.rxRadio','encore.ui.rxSortableColumn','encore.ui.rxStatusColumn','encore.ui.utilities','encore.ui.elements']);

angular.module('encore.ui.utilities', []);

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:rxTimePickerUtil
 *
 * @description
 * Utility service used by {@link elements.directive:rxTimePicker rxTimePicker}.
 */
.factory('rxTimePickerUtil', function () {
    /**
     * @ngdoc property
     * @propertyOf utilities.service:rxTimePickerUtil
     * @name modelFormat
     * @description formatting mask for Time model/data values
     */
    var modelFormat = 'HH:mmZ';

    /**
     * @ngdoc property
     * @propertyOf utilities.service:rxTimePickerUtil
     * @name viewFormat
     * @description formatting mask for Time view/display values
     */
    var viewFormat = 'HH:mm (UTCZZ)';

    /**
     * @ngdoc method
     * @methodOf utilities.service:rxTimePickerUtil
     * @name parseUtcOffset
     * @param {String} stringValue string containing UTC offset
     * @return {String} UTC Offset value
     *
     * @description parse offset value from given string, if present
     *
     * **NOTE:** Logic in this function must match the logic in
     * the page object.
     */
    function parseUtcOffset (stringValue) {
        var regex = /([-+]\d{2}:?\d{2})/;
        var matched = stringValue.match(regex);
        return (matched ? matched[0] : '');
    }//parseUtcOffset()

    /**
     * @ngdoc method
     * @methodOf utilities.service:rxTimePickerUtil
     * @name modelToObject
     * @param {String} stringValue time in `HH:mmZ` format
     * @return {Object} parsed data object
     *
     * @description
     * Parse the model value to fetch hour, minutes, period, and offset
     * to populate the picker form with appropriate values.
     */
    function modelToObject (stringValue) {
        var momentValue = moment(stringValue, modelFormat);
        var offset = parseUtcOffset(stringValue);
        var parsed = {
            hour: '',
            minutes: '',
            period: 'AM',
            offset: (_.isEmpty(offset) ? '+0000' : offset)
        };

        if (!_.isEmpty(offset)) {
            momentValue.utcOffset(offset);
        }

        if (momentValue.isValid()) {
            parsed.hour = momentValue.format('h');
            parsed.minutes = momentValue.format('mm');
            parsed.period = momentValue.format('A');
        }

        return parsed;
    }//modelToObject()

    return {
        parseUtcOffset: parseUtcOffset,
        modelToObject: modelToObject,
        modelFormat: modelFormat,
        viewFormat: viewFormat,
    };
});//rxTimePickerUtil

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
 * @ngdoc filter
 * @name utilities.filter:rxSortEmptyTop
 * @description
 *
 * Filter that moves rows with an empty predicate to the top of the column in
 * ascending order, and to the bottom in descending order.
 *
 * @example
 * ### Empty Sort
 * <pre>
 * var emptySort = [
 *     { name: { firstName: 'Adam' } },
 *     { }
 * ];
 * emptySort | rxSortEmptyTop 'name.firstName':false
 * </pre>
 * Will sort as [{}, { name: { firstName: 'Adam' } }].
 *
 * ### Null Sort
 * <pre>
 * var nullSort = [
 *     { name: { firstName: 'Adam' } },
 *     { name: { firstName: null }
 * ];
 * nullSort | rxSortEmptyTop 'name.firstName':true
 * </pre>
 * Will sort as [{ name: { firstName: 'Adam' } }, {}]
 */
.filter('rxSortEmptyTop', ['$filter', '$parse', function ($filter, $parse) {
    return function (array, key, reverse) {

        var predicateGetter = $parse(key);

        var sortFn = function (item) {
            return predicateGetter(item) || '';
        };

        return $filter('orderBy')(array, sortFn, reverse);
    };
}]);

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

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:rxLocalStorage
 * @description
 * A simple wrapper for injecting the global variable `localStorage`
 * for storing values in the browser's local storage object. This service is similar to Angular's
 * `$window` and `$document` services.  The API works the same as the W3C's
 * specification provided at: https://html.spec.whatwg.org/multipage/webstorage.html.
 * This service also includes helper functions for getting and setting objects.
 *
 * @example
 * <pre>
 * rxLocalStorage.setItem('Batman', 'Robin'); // no return value
 * rxLocalStorage.key(0); // returns 'Batman'
 * rxLocalStorage.getItem('Batman'); // returns 'Robin'
 * rxLocalStorage.removeItem('Batman'); // no return value
 * rxLocalStorage.setObject('hero', {name:'Batman'}); // no return value
 * rxLocalStorage.getObject('hero'); // returns { name: 'Batman'}
 * rxLocalStorage.clear(); // no return value
 * </pre>
 */
.service('rxLocalStorage', ["$window", function ($window) {
    var localStorage = $window.localStorage;
    if ($window.self !== $window.top && $window.top.localStorage) {
        localStorage = $window.top.localStorage;
    }

    this.setItem = function (key, value) {
        localStorage.setItem(key, value);
    };

    this.getItem = function (key) {
        return localStorage.getItem(key);
    };

    this.key = function (key) {
        return localStorage.key(key);
    };

    this.removeItem = function (key) {
        localStorage.removeItem(key);
    };

    this.clear = function () {
        localStorage.clear();
    };

    this.__defineGetter__('length', function () {
        return localStorage.length;
    });

    this.setObject = function (key, val) {
        var value = _.isObject(val) || _.isArray(val) ? JSON.stringify(val) : val;
        this.setItem(key, value);
    };

    this.getObject = function (key) {
        var item = localStorage.getItem(key);
        try {
            item = JSON.parse(item);
        } catch (error) {
            return item;
        }

        return item;
    };
}]);

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:rxDOMHelper
 * @description
 * A small set of functions to provide some functionality
 * that isn't present in [Angular's jQuery-lite](https://docs.angularjs.org/api/ng/function/angular.element),
 * and other DOM-related functions that are useful.
 *
 * **NOTE:** All methods take jQuery-lite wrapped elements as arguments.
 */
.factory('rxDOMHelper', ["$document", "$window", function ($document, $window) {
    var scrollTop = function () {
        // Safari and Chrome both use body.scrollTop, but Firefox needs
        // documentElement.scrollTop
        var doc = $document[0];
        var scrolltop = $window.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop || 0;
        return scrolltop;
    };

    var offset = function (elm) {
        //http://cvmlrobotics.blogspot.co.at/2013/03/angularjs-get-element-offset-position.html
        var rawDom = elm[0];
        var _x = 0;
        var _y = 0;
        var doc = $document[0];
        var body = doc.documentElement || doc.body;
        var scrollX = $window.pageXOffset || body.scrollLeft;
        var scrollY = scrollTop();
        var rect = rawDom.getBoundingClientRect();
        _x = rect.left + scrollX;
        _y = rect.top + scrollY;
        return { left: _x, top: _y };
    };

    var style = function (elem) {
        if (elem instanceof angular.element) {
            elem = elem[0];
        }
        return $window.getComputedStyle(elem);
    };

    var width = function (elem) {
        return style(elem).width;
    };

    var height = function (elem) {
        return style(elem).height;
    };

    var shouldFloat = function (elem, maxHeight) {
        var elemOffset = offset(elem),
            scrolltop = scrollTop();

        return ((scrolltop > elemOffset.top) && (scrolltop < elemOffset.top + maxHeight));
    };

    // An implementation of wrapAll, based on
    // http://stackoverflow.com/a/13169465
    // Takes a raw DOM `newParent`, and moves all of `elms` (either
    // a single element or an array of elements) into it. It then places
    // `newParent` in the location that elms[0] was originally in
    var wrapAll = function (newParent, elms) {
        // Figure out if it's one element or an array
        var isGroupParent = ['SELECT', 'FORM'].indexOf(elms.tagName) !== -1;
        var el = (elms.length && !isGroupParent) ? elms[0] : elms;

        // cache the current parent node and sibling
        // of the first element
        var parentNode = el.parentNode;
        var sibling = el.nextSibling;

        // wrap the first element. This automatically
        // removes it from its parent
        newParent.appendChild(el);

        // If there are other elements, wrap them. Each time
        // it will remove the element from its current parent,
        // and also from the `elms` array
        if (!isGroupParent) {
            while (elms.length) {
                newParent.appendChild(elms[0]);
            }
        }

        // If there was a sibling to the first element,
        // insert newParent right before it. Otherwise
        // just add it to parentNode
        if (sibling) {
            parentNode.insertBefore(newParent, sibling);
        } else {
            parentNode.appendChild(newParent);
        }
    };

    // bind `f` to the scroll event
    var onscroll = function (f) {
        angular.element($window).bind('scroll', f);
    };

    var find = function (elem, selector) {
        return angular.element(elem[0].querySelector(selector));
    };

    return {
        offset: offset,
        scrollTop: scrollTop,
        width: width,
        height: height,
        shouldFloat: shouldFloat,
        onscroll: onscroll,
        find: find,
        wrapAll: wrapAll
    };
}]);

angular.module('encore.ui.utilities')
/**
 * @ngdoc filter
 * @name utilities.filter:rxAge
 * @description
 * Several filters are available to parse dates.
 *
 * ## Two Digit Display
 * 1. You can just have it use the default abbreviated method and it truncates it
 *  to the two largest units.
 *
 *  <pre>
 *    <div ng-controller="rxAgeCtrl">
 *      <ul>
 *        <li>{{ageHours}} &rarr; {{ageHours | rxAge}}</li>
 *      </ul>
 *    </div>
 *  </pre>
 *  `Tue Sep 22 2015 00:44:00 GMT-0500 (CDT) → 10h 30m`
 *
 * ## Full Word Representation
 * 2. You can also pass in a second value of `true` and have it expand the units
 *  from the first letter to their full word representation.
 *
 *  <pre>
 *    <div ng-controller="rxAgeCtrl">
 *      <ul>
 *        <li>{{ageHours}} &rarr; {{ageHours | rxAge:true}}</li>
 *      </ul>
 *    </div>
 *  </pre>
 *  `Tue Sep 22 2015 00:35:30 GMT-0500 (CDT) → 10 hours, 33 minutes`
 *
 * ## Mulitple Digits
 * 3. Or you can pass in a number from `1` to `3` as the second value to allow for
 *  different amounts of units.
 *
 *  <pre>
 *    <div ng-controller="rxAgeCtrl">
 *      <ul>
 *        <li>{{ageYears}} &rarr; {{ageYears | rxAge:3}}</li>
 *      </ul>
 *    </div>
 *  </pre>
 *  `Sun Sep 07 2014 08:46:05 GMT-0500 (CDT) → 380d 2h 27m`
 *
 * ## Multiple Argument Usage
 * 4. **OR** you can pass in a number as the second argument and `true` as the
 *    third argument to combine these two effects.
 *
 *  <pre>
 *    <div ng-controller="rxAgeCtrl">
 *      <ul>
 *        <li>{{ageMonths}} &rarr; {{ageMonths | rxAge:3:true}}</li>
 *      </ul>
 *    </div>
 *  </pre>
 *  `Thu Aug 13 2015 06:22:05 GMT-0500 (CDT) → 40 days, 4 hours, 49 minutes`
 *
 *
 * **NOTE:** This component requires [moment.js](http://momentjs.com/) to parse, manipulate, and
 * display dates which is provided by Encore Framework.
 */
.filter('rxAge', function () {
    return function (dateString, maxUnits, verbose) {
        if (!dateString) {
            return 'Unavailable';
        } else if (dateString === 'z') {
            return '--';
        }

        var now = moment();
        var date = moment(new Date(dateString));
        var diff = now.diff(date);
        var duration = moment.duration(diff);
        var days = parseInt(duration.asDays(), 10);
        var hours = parseInt(duration.asHours(), 10);
        var mins = parseInt(duration.asMinutes(), 10);
        var age = [];

        if (_.isBoolean(maxUnits)) {
            // if maxUnits is a boolean, then we assume it's meant to be the verbose setting
            verbose = maxUnits;
        } else if (!_.isBoolean(verbose)) {
            // otherwise, if verbose isn't set, default to false
            verbose =  false;
        }

        // This initialization has to happen AFTER verbose init so that we can
        // use the original passed in value.
        maxUnits = (_.isNumber(maxUnits)) ? maxUnits : 2;

        var dateUnits = [days, hours - (24 * days), mins - (60 * hours)];
        var suffixes = ['d', 'h', 'm'];

        if (verbose) {
            suffixes = [' day', ' hour', ' minute'];

            _.forEach(suffixes, function (suffix, index) {
                suffixes[index] += ((dateUnits[index] !== 1) ? 's' : '');
            });
        }

        if (days > 0) {
            age.push({ value: days, suffix: suffixes[0] });
        }

        if (hours > 0) {
            age.push({ value: hours - (24 * days), suffix: suffixes[1] });
        }

        age.push({ value: mins - (60 * hours), suffix: suffixes[2] });

        return _.map(age.slice(0, maxUnits), function (dateUnit, index, listOfAges) {
            if (index === listOfAges.length - 1) {
                return Math.round(dateUnit.value) + dateUnit.suffix;
            } else {
                return Math.floor(dateUnit.value) + dateUnit.suffix;
            }
        }).join((verbose) ? ', ' : ' ');
    };
});

angular.module('encore.ui.utilities')
/**
 * @ngdoc parameters
 * @name utilities.constant:UtcOffsets
 *
 * @description
 * List of known UTC Offset Values
 * See https://en.wikipedia.org/wiki/List_of_UTC_time_offsets
 *
 * Utility service used by {@link elements.directive:rxTimePicker rxTimePicker}.
 */
.constant('UtcOffsets', [
    '-12:00',
    '-11:00',
    '-10:00',
    '-09:30',
    '-09:00',
    '-08:00',
    '-07:00',
    '-06:00',
    '-05:00',
    '-04:30',
    '-04:00',
    '-03:30',
    '-03:00',
    '-02:00',
    '-01:00',
    '+00:00',
    '+01:00',
    '+02:00',
    '+03:00',
    '+03:30',
    '+04:00',
    '+04:30',
    '+05:00',
    '+05:30',
    '+05:45',
    '+06:00',
    '+06:30',
    '+07:00',
    '+08:00',
    '+08:30',
    '+08:45',
    '+09:00',
    '+09:30',
    '+10:00',
    '+10:30',
    '+11:00',
    '+12:00',
    '+12:45',
    '+13:00',
    '+14:00',
]);

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:UnauthorizedInterceptor
 * @description
 * Simple injector which will intercept HTTP responses. If a HTTP 401 response error code is returned,
 * the ui redirects to `/login`.
 *
 * @requires $q
 * @requires @window
 * @requires utilities.service:Session
 *
 * @example
 * <pre>
 * angular.module('encoreApp', ['encore.ui'])
 *     .config(function ($httpProvider) {
 *         $httpProvider.interceptors.push('UnauthorizedInterceptor');
 *     });
 * </pre>
 */
.factory('UnauthorizedInterceptor', ["$q", "$window", "Session", function ($q, $window, Session) {
    var svc = {
        redirectPath: function () {
            // This brings in the entire relative URI (including the path
            // specified in a <base /> tag), along with query params as a
            // string.
            // e.g https://www.google.com/search?q=woody+wood+pecker
            // window.location.pathname = /search?q=woody+wood+pecker
            return $window.location.pathname;
        },
        redirect: function (loginPath) {
            loginPath = loginPath ? loginPath : '/login?redirect=';
            $window.location = loginPath + encodeURIComponent(svc.redirectPath());
        },
        responseError: function (response) {
            if (response.status === 401) {
                Session.logout(); // Logs out user by removing token
                svc.redirect();
            }

            return $q.reject(response);
        }
    };

    return svc;
}]);

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:TokenInterceptor
 * @description
 * Simple $http injector which will intercept http request and inject the
 * Rackspace Identity's token into every http request.
 *
 * @requires rxSession.service:Session
 *
 * @example
 * <pre>
 * angular.module('encoreApp', ['encore.ui'])
 *     .config(function ($httpProvider) {
 *         $httpProvider.interceptors.push('TokenInterceptor');
 *     });
 * </pre>
 */
.provider('TokenInterceptor', function () {
    var exclusionList = this.exclusionList = [ 'rackcdn.com' ];

    this.$get = ["Session", "$document", function (Session, $document) {
        var url = $document[0].createElement('a');
        return {
            request: function (config) {
                // Don't add the X-Auth-Token if the request URL matches
                // something in exclusionList
                // We're specifically looking at hostnames, so we have to
                // do the `createElement('a')` trick to turn the config.url
                // into something with a `.hostname`
                url.href = config.url;
                var exclude = _.some(exclusionList, function (item) {
                    if (_.contains(url.hostname, item)) {
                        return true;
                    }
                });

                if (!exclude) {
                    config.headers['X-Auth-Token'] = Session.getTokenId();
                }

                return config;
            }
        };
    }];
});

angular.module('encore.ui.utilities')
/**
 * @ngdoc service
 * @name utilities.service:Session
 * @description
 *
 * Service for managing user session in encore-ui.
 *
 * @requires utilities.service:rxLocalStorage
 *
 * @example
 * <pre>
 * Session.getToken(); // Returns the stored token
 * Session.storeToken(token); // Stores token
 * Session.logout(); // Logs user off
 * Session.isCurrent(); // Returns true/false if the token has expired.
 * Session.isAuthenticated(); // Returns true/false if the user token is valid.
 * </pre>
 */
.factory('Session', ["rxLocalStorage", function (rxLocalStorage) {
    var TOKEN_ID = 'encoreSessionToken';
    var session = {};

    /**
    * Dot walks the token without throwing an error.
    * If key exists, returns value otherwise returns undefined.
    */
    session.getByKey = function (key) {
        var tokenValue,
            token = session.getToken(),
            keys = key ? key.split('.') : undefined;

        if (_.isEmpty(token) || !keys) {
            return;
        }

        tokenValue = _.reduce(keys, function (val, key) {
            return val ? val[key] : undefined;
        }, token);

        return tokenValue;
    };

    session.getToken = function () {
        return rxLocalStorage.getObject(TOKEN_ID);
    };

    session.getTokenId = function () {
        return session.getByKey('access.token.id');
    };

    session.getUserId = function () {
        return session.getByKey('access.user.id');
    };

    session.getUserName = function () {
        return session.getByKey('access.user.name');
    };

    session.storeToken = function (token) {
        rxLocalStorage.setObject(TOKEN_ID, token);
    };

    session.logout = function () {
        rxLocalStorage.removeItem(TOKEN_ID);
    };

    session.isCurrent = function () {
        var expireDate = session.getByKey('access.token.expires');

        if (expireDate) {
            return new Date(expireDate) > _.now();
        }

        return false;
    };

    session.isAuthenticated = function () {
        var token = session.getToken();
        return _.isEmpty(token) ? false : session.isCurrent();
    };

    return session;
}]);

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
.directive('rxTooltip', ["$timeout", function ($timeout) {
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
}])
.directive('rxTooltipAnchor', ["$timeout", function ($timeout) {
    return {
        restrict: 'A',
        require: 'rxTooltipAnchor',
        controller: ["$scope", function ($scope) {
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
        }],
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
}])
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

angular.module('encore.ui.elements')
/**
 * @ngdoc directive
 * @name rxTags.directive:rxTags
 * @description
 *
 * Like native form components, this directive uses `ng-model` to store
 * its value. The only other required attribute is `options` which accepts an
 * array of available tags that can be applied.  The tags are objects, each
 * with required `text` and `category` properties.  Any additional properties
 * will be ignored.
 * <pre>
 * $scope.colorOptions = [
 *   {
 *     "text": "blue",
 *     "category": "color"
 *   }
 *   // ...
 *  ]
 * </pre>
 *
 * By default, the model value is a subset of the options, meaning an new array
 * containing some of the same objects.  However, the `key` attribute can be
 * used to customize the model binding by selecting a single value to represent
 * the object, e.g.
 * <pre>
 * <rx-tags options="colorOptions" ng-model="colors" key="id"></rx-tags>
 * </pre>
 *
 * <pre>
 * $scope.colorOptions = [
 *  {
 *   "id": "tag0",
 *   "text": "blue",
 *   "category": "color"
 *  }
 * ]
 *
 * // $scope.colors === ["tag0"] when selected
 * </pre>
 *
 * This component can be disabled via the `disabled` attribute or `ng-disabled`
 * directive.
 * @param {Array} options - The list of available tags.
 * @param {String=} [key=undefined] - Determines a value of the tag object to
 * use when binding an option to the model.
 * If not provided, the tag object is used.
 */
.directive('rxTags', ["rxDOMHelper", function (rxDOMHelper) {
    return {
        templateUrl: 'templates/rxTags.html',
        restrict: 'E',
        require: 'ngModel',
        scope: {
            options: '=',
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            var container = rxDOMHelper.find(element, '.rx-tags')[0];
            var input = element.find('input')[0];

            function changeFocus (event) {
                (event.target.previousElementSibling || input).focus();
            }

            attrs.$observe('disabled', function (disabled) {
                scope.disabled = (disabled === '') || disabled;
            });

            scope.focusInput = function (event) {
                if (event.target === container) {
                    input.focus();
                }
            };

            scope.removeIfBackspace = function (event, tag) {
                if (event.keyCode === 8) {
                    event.preventDefault();
                    scope.remove(tag);
                    changeFocus(event);
                }
            };

            scope.focusTag = function (event, value) {
                if (event.keyCode === 8 && _.isEmpty(value)) {
                    changeFocus(event);
                }
            };

            scope.add = function (tag) {
                /*
                 * See https://code.angularjs.org/1.3.20/docs/api/ng/type/ngModel.NgModelController#$setViewValue
                 * We have to use `concat` to create a new array to trigger $parsers
                 */
                var updatedTags = scope.tags.concat([tag]);
                // sets ngModelCtrl.$viewValue then $$debounceViewValueCommit()
                ngModelCtrl.$setViewValue(updatedTags);
                scope.tags = updatedTags;
                scope.newTag = ''; // reset new tag input
            };

            scope.remove = function (tag) {
                var updatedTags = _.without(scope.tags, tag);
                ngModelCtrl.$setViewValue(updatedTags);
                scope.tags = updatedTags;
                input.focus();
            };

            if (!_.isEmpty(attrs.key)) {
                ngModelCtrl.$parsers.push(function ($viewValue) {
                    return _.pluck($viewValue, attrs.key);
                });

                ngModelCtrl.$formatters.push(function ($modelValue) {
                    return scope.options.filter(function (option) {
                        return _.contains($modelValue, option[attrs.key]);
                    });
                });
            }

            ngModelCtrl.$render = function () {
                scope.tags = ngModelCtrl.$viewValue || [];
            };
        }
    };
}]);

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
.directive('rxTimePicker', ["rxTimePickerUtil", "UtcOffsets", function (rxTimePickerUtil, UtcOffsets) {
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
}]);

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
 * @name elements.directive:rxButton
 * @restrict E
 * @scope
 * @description
 * Renders a button which will disable when clicked and show a loading message,
 * and re-enable when the operation is complete. If you set `classes` attributes
 * `<rx-button>`, those will get passed to the `<button>` instance as `class`.
 *
 * `rxButton` is used to create buttons with a dynamically-displayed loading
 * indicator. This is meant to be used as a replacement for `<button>` elements
 * in scenarios where the button has multiple states.
 *
 * ## Button State
 *
 * The state of the button is controlled via the `toggle` attribute, which
 * disables the button and replaces the `default-msg` with the `toggle-msg` as
 * the button's text.  There are no defaults for these messages, so they must
 * be defined if the toggle behavior is desired.  While the button is in the
 * toggled state, it is also disabled (no matter what the value of `disable` is).
 *
 * The button does not modify the variable passed to `toggle`; it should be
 * modified in the handler provided to `ng-click`.  Usually, the handler will
 * set the variable to `true` immediately, and then to `false` once the the
 * process (e.g. an API call) is complete.
 *
 * To disable the button, use the `disable` attribute instead of the normal
 * `ng-disabled` - the behavior is the same.
 *
 * ## Styling
 *
 * There are several styles of buttons available, and they are documented in the
 * [Buttons Styleguide](/encore-ui/#/elements/Buttons). Any classes that need to be
 * added to the button should be passed to the `classes` attribute.
 *
 * @param {String} loadingMsg Text to be displayed when an operation is in progress.
 * @param {String} defaultMsg Text to be displayed by default when no operation is in progress.
 * @param {Boolean=} [toggle=false] When true, the button will display the loading text.
 * @param {Boolean=} [disable=false] When true, the button will be disabled.
 * @param {String=} [classes=""] The class names to be applied to the button.
 *
 */
.directive('rxButton', function () {
    return {
        templateUrl: 'templates/rxButton.html',
        restrict: 'E',
        scope: {
            toggleMsg: '@',
            defaultMsg: '@',
            toggle: '=',
            disable: '=?',
            classes: '@?'
        },
    };
});

angular.module('encore.ui.elements')
.config(["$provide", function ($provide) {
  $provide.decorator('rxActionMenuDirective', ["$delegate", function ($delegate) {
    // https://github.com/angular/angular.js/issues/10149
    _.each(['type', 'text'], function (key) {
      $delegate[0].$$isolateBindings[key] = {
        attrName: key,
        mode: '@',
        optional: true
      };
    });
    return $delegate;
  }]);
}]);

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
.directive('rxActionMenu', ["$rootScope", "$document", function ($rootScope, $document) {
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
}]);

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
.directive('rxStatusColumn', ["rxStatusMappings", "rxStatusColumnIcons", function (rxStatusMappings, rxStatusColumnIcons) {
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
}]);

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

angular.module('encore.ui.rxPopover', ['encore.ui.elements'])

angular.module('encore.ui.rxPopover')
.directive('rxPopover', ["rxActionMenuDirective", function (rxActionMenuDirective) {
  var ddo = _.cloneDeep(rxActionMenuDirective[0]);
  return _.assign(ddo, {
    templateUrl: 'templates/rxPopover.html'
  });
}]);

angular.module('encore.ui.rxForm', ['encore.ui.utilities']);

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
.directive('rxSuffix', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxInput'
    });
}]);

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
.directive('rxPrefix', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxInput'
    });
}]);

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
.directive('rxInput', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxFieldContent'
    });
}]);

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
.directive('rxInfix', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxInput'
    });
}]);

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
.directive('rxFormSection', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxForm'
    });
}]);

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
.directive('rxForm', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        restrict: 'A'
    });
}]);

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
.directive('rxFieldName', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxField',
        transclude: true,
        scope: {
            ngRequired: '=?'
        },
        templateUrl: 'templates/rxFieldName.html'
    });
}]);

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
.directive('rxFieldContent', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxField'
    });
}]);

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
.directive('rxField', ["rxNestedElement", function (rxNestedElement) {
    return rxNestedElement({
        parent: 'rxFormSection'
    });
}]);

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

angular.module('encore.ui.rxApp', ['ngRoute']);

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxTicketSearch
 * @restrict E
 * @description
 * Used to search tickets for Ticket Queues
 */
.directive('rxTicketSearch', function () {
    return {
        template: '<rx-app-search placeholder="Search for a Ticket..." submit="searchTickets"></rx-app-search>',
        restrict: 'E',
        link: function (scope) {
            // TQTicketSelection.loadTicket.bind(TQTicketSelection)
            scope.searchTickets = function () {
                // TODO do something here
            };
        }
    };
});

angular.module('encore.ui.rxApp')
/**
* @ngdoc directive
* @name rxApp.directive:rxStatusTag
* @restrict E
* @scope
* @description
* This is used to draw the Alpha/Beta/etc tags in page titles and in breadcrumbs. It's not
* intended as a public directive.
*/
.directive('rxStatusTag', ["rxStatusTags", function (rxStatusTags) {
    return {
        template: '<span ng-if="status && validKey" class="status-tag {{ class }}">{{ text }}</span>',
        restrict: 'E',
        scope: {
            status: '@'
        },
        link: function (scope) {
            scope.validKey = rxStatusTags.hasTag(scope.status);
            if (scope.validKey) {
                var config = rxStatusTags.getTag(scope.status);
                scope.class = config.class;
                scope.text = config.text;
            }
        }
    };
}]);

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxPage
 * @restrict E
 * @scope
 * @description
 *
 * Responsible for creating the HTML necessary for a page (including breadcrumbs and page title)
 * You can pass in a `title` attribute or an `unsafeHtmlTitle` attribute, but not both. Use the former
 * if your title is a plain string, use the latter if your title contains embedded HTML tags AND you
 * trust the source of this title. Arbitrary javascript can be executed, so ensure you trust your source.
 *
 * The document title will be set to either `title` or a stripped version of `unsafeHtmlTitle`, depending
 * on which you provide.
 *
 * You'll likely want to use the {@link rxApp.directive:rxPage rxPage} directive
 * inside your template view. For example, inside a 'myView.html' file:
 *
 * <pre>
 * <rx-page title="'Example Page'">
 *    Here is my content
 * </rx-page>
 * </pre>
 *
 * `rx-page` is used to create a common wrapper for specific page views. It
 * automatically adds the breadcrumbs and page title/subtitle (if specified),
 * along with the correct styling.
 *
 * Both the `title` and `subtitle` attributes accept an Angular expression,
 * which can be a string (shown in the previous example) or a scope property.
 * This string/property can accept other expressions, enabling you to build custom
 * titles. The demo has an example of this usage.
 *
 * If you wish to use arbitrary HTML in your title, you can use the
 * `unsafe-html-title` attribute instead of `title`. This is considered "unsafe"
 * because it is capable of executing arbitrary Javascript, so you must ensure
 * that you trust the source of the title. The "Customized Page Title" in the
 * demo shows the use of HTML tags.
 *
 * In either case (`title` or `unsafe-html-title`), the document title
 * (i.e. visible in the browser tab) will be set to your chosen title. If you use
 * `unsafe-html-title`, all HTML tags will be stripped before setting the document
 * title.
 *
 * ### Account Info below Breadcrumbs
 *
 * `rxPage` integrates with the {@link elements.directive:rxAccountInfo rxAccountInfo} component,
 * to draw the Account Info box directly underneath the `rxBreadcrumbs`.
 * This is opt-in. By default, it will not appear. To enable it, pass the
 * `account-number="..."` attribute to `<rx-page>` in your template, i.e
 *
 * <pre>
 * <rx-page account-number="{{ accountNumber }}">
 * </pre>
 *
 * As noted in {@link elements.directive:rxAccountInfo rxAccountInfo}, this
 * directive requires that `SupportAccount`, `Encore` and `Teams` services are
 * available to the Angular Dependency Injection system. These are *not* provided
 * by EncoreUI, but are available in an internal Rackspace repository.
 *
 *
 * ### Status tags
 *
 * A final attribute that `rx-page` accepts is `status`. This takes a string,
 * and has the effect of drawing a status "tag" beside the page title.
 * The "Customized rxApp" demo shows the use of this with the `"alpha"` tag.
 *
 * The framework currently provides `"alpha"` and `"beta"` tags, but any product
 * can specify their own custom tags using the `rxStatusTagsProvider`. It currently
 * has one method, `addStatus`, which takes an unique `key` for the new tag, the
 * `class` it should use in the HTML, and the `text` that will be drawn. All custom
 * tags are drawn inside of a `<span>`, essentially as:
 *
 * <pre>
 * <span class="status-tag {{ class }}">{{ text }}</span>
 * </pre>
 *
 * To use this, do the following in your application's `.config()` method:
 *
 * <pre>
 * rxStatusTagsProvider.addStatus({
 *     key: 'gamma',
 *     class: 'alpha-status',
 *     text: 'Hello World!'
 * });
 * </pre>
 *
 * This will create a new status tag called `"gamma"`, which you can pass to `rx-page` as:
 *
 * <pre>
 * <rx-page title="'Some Title'" status="gamma">
 * </pre>
 *
 * And the title will appear with a `Hello World!` tag beside it, styled the
 * same way as our `"alpha"` status tag is styled. You can also define your own
 * CSS style in your application and use those instead, passing it as the `class`
 * value to `addStatus()`.
 *
 * All the tags are accessible inside of {@link elements.directive:rxBreadcrumbs rxBreadcrumbs}
 * as well. Any breadcrumb that was created with `useStatusTag: true` will automatically
 * receive the same status tag as you passed to `<rx-page>`.
 *
 * ### .page-actions
 *
 * A `page-actions` class is provided by rx-app to easily add custom page actions
 * to the top right of a page. For example:
 *
 * <pre>
 * <rx-page title="'Servers Overview'">
 *    <div class="page-actions">
 *        <a href="/create" class="link-action msg-action">Create New Server</a>
 *    </div>
 *    <img src="http://cdn.memegenerator.net/instances/500x/48669250.jpg"
 *         alt="Look at all these servers there are so many" />
 * </rx-page>
 * </pre>
 *
 * @param {expression} [title] Title of page
 * @param {expression} [unsafeHtmlTitle] Title for the page, with embedded HTML tags
 * @param {expression} [subtitle] Subtitle of page
 *
 * @example
 * <pre>
 * <rx-page title="'Page Title'"></rx-page>
 * </pre>
 */
.directive('rxPage', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/rxPage.html',
        scope: {
            title: '=',
            unsafeHtmlTitle: '=',
            subtitle: '=',
            status: '@',
            accountNumber: '@',
            teamId: '@'
        },
        link: function (scope, element) {
            // Remove the title attribute, as it will cause a popup to appear when hovering over page content
            // @see https://github.com/rackerlabs/encore-ui/issues/251
            element.removeAttr('title');

            var pageDiv = element[0];
            var pageBodyDiv = pageDiv.querySelector('.page-content');

            // Move the specified attribute from rxPage div to page-body div
            function moveLayoutAttrib (attr) {

                // Only apply to attributes that start with 'layout'
                if (!_.isString(attr.name) || !attr.name.match(/^layout/)) {
                    return;
                }

                pageBodyDiv.setAttribute(attr.name, pageDiv.getAttribute(attr.name));
                pageDiv.removeAttribute(attr.name);
            }

            // Relocate all layout attributes
            var i = pageDiv.attributes.length;
            while (i--) {
                moveLayoutAttrib(pageDiv.attributes[i]);
            }
        },
        controller: ["$scope", "rxPageTitle", function ($scope, rxPageTitle) {
            $scope.$watch('title', function () {
                rxPageTitle.setTitle($scope.title);
            });

            $scope.$watch('unsafeHtmlTitle', function () {
                if (!_.isEmpty($scope.unsafeHtmlTitle)) {
                    rxPageTitle.setTitleUnsafeStripHTML($scope.unsafeHtmlTitle);
                }
            });
        }]
    };
});

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxBillingSearch
 * @restrict E
 * @description [TBD]
 */
.directive('rxBillingSearch', ["$location", "$window", "encoreRoutes", function ($location, $window, encoreRoutes) {
    return {
        templateUrl: 'templates/rxBillingSearch.html',
        restrict: 'E',
        link: function (scope) {
            scope.searchType = 'bsl';
            scope.$watch('searchType', function () {
                scope.placeholder = scope.searchType === 'bsl' ? 'Transaction or Auth ID' : 'Account or Contact Info';
            });
            scope.fetchAccounts = function (searchValue) {
                if (!_.isEmpty(searchValue)) {
                    // Assuming we are already in /billing, we should use $location to prevent a page refresh
                    encoreRoutes.isActiveByKey('billing').then(function (isBilling) {
                        if (isBilling) {
                            $location.url('/search?q=' + searchValue + '&type=' + scope.searchType);
                        } else {
                            $window.location = '/billing/search?q=' + searchValue + '&type=' + scope.searchType;
                        }
                    });
                }
            };
        }
    };
}]);

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxAtlasSearch
 * @restrict E
 * @description
 * Used to search accounts for Cloud Atlas
 */
.directive('rxAtlasSearch', ["$window", function ($window) {
    return {
        template: '<rx-app-search placeholder="Search by username..." submit="searchAccounts"></rx-app-search>',
        restrict: 'E',
        link: function (scope) {
            scope.searchAccounts = function (searchValue) {
                if (!_.isEmpty(searchValue)) {
                    $window.location = '/cloud/' + searchValue + '/servers/';
                }
            };
        }
    };
}]);

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxAppSearch
 * @restrict E
 * @scope
 * @description
 * Creates a search input form for navigation
 *
 * @param {string} [placeholder] Title of page
 * @param {*} [model] Model to tie input form to (via ng-model)
 * @param {function} [submit] Function to run on submit (model is passed as only argument to function)
 */
.directive('rxAppSearch', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/rxAppSearch.html',
        scope: {
            placeholder: '@?',
            model: '=?',
            submit: '=?',
            pattern: '@?'
        }
    };
});

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxAppNavItem
 * @restrict E
 * @scope
 * @description
 * Creates a menu item. Recursively creates rx-app-nav if 'children' present.
 * 'Item' must be avialable via scope
 *
 * @example
 * <pre>
 * <rx-app-nav-item ng-repeat="item in items"></rx-app-nav-item>
 * </pre>
 */
.directive('rxAppNavItem', ["$compile", "$location", "$route", function ($compile, $location, $route) {
    var linker = function (scope, element) {
        var injectContent = function (selector, content) {
            var el = element[0].querySelector(selector);
            el = angular.element(el);

            $compile(content)(scope, function (compiledHtml) {
                el.append(compiledHtml);
            });
        };

        var directiveHtml = '<directive></directive>';
        // add navDirective if defined
        if (angular.isString(scope.item.directive)) {
            // convert directive string to HTML
            // e.g. my-directive -> <my-directive></my-directive>
            directiveHtml = directiveHtml.replace('directive', scope.item.directive);

            injectContent('.item-directive', directiveHtml);
        }

        // increment nesting level for child items
        var childLevel = scope.$parent.level + 1;
        // safety check that child level is a number
        if (isNaN(childLevel)) {
            childLevel = 2;
        }
        // add children if present
        // Note: this can't be added in the HTML due to angular recursion issues
        var rxNavTemplate = '<rx-app-nav items="item.children" level="' + childLevel + '">' +
            '</rx-app-nav>';
        if (angular.isArray(scope.item.children)) {
            injectContent('.item-children', rxNavTemplate);
        }
    };

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/rxAppNavItem.html',
        link: linker,
        scope: {
            item: '='
        },
        controller: ["$scope", "$location", "$injector", "rxVisibility", "Permission", "urlUtils", function ($scope, $location, $injector, rxVisibility, Permission, urlUtils) {
            /*
             * @description Determines whether or not a nav item should have its href prefixed
             * based on whether the `$injector` has a `NAV_ITEM_PREFIX` injectable
             *
             * _This is *NOT* meant for general consumption, this is strictly for the Origin Project_
             * _This will eventually be deprecated and removed_
             *
             * @param {string} [url] - URL for the nav item's href
             */
            $scope.getUrl = function (url) {
                // For URLs that have no URL definition, let's go ahead and return right away
                // this avoids issues when we do have a prefix but really the nav item should not have
                // any defined href, i.e. items that have subitems
                if (_.isEmpty(url)) {
                    return url;
                }

                // Check if we have a definition of NAV_ITEM_PREFIX, if so let's retrieve it and return the given URL
                // appended to the prefix.  This allows applications like origin to prefix nav items, while not
                // messing with nav items in the demo/documentation.
                //
                // _This is *NOT* meant for general consumption, this is strictly for the Origin Project_
                // _This will eventually be deprecated and removed_
                //

                if ($injector.has('NAV_ITEM_PREFIX')) {
                    var prefix = urlUtils.parseUrl($injector.get('NAV_ITEM_PREFIX'));
                    return prefix.protocol.concat('//').concat(prefix.host).concat(url);
                } else {
                    // Return as normal if no prefix
                    return url;
                }

            };
            /*
             * @description Determines whether or not the links need to point to a target, this allows
             * for origin and applications that show the nav to implement a target in which to have the links
             * open in.
             *
             * If ever there was a need to point links to a different target than an application specific
             * target, we could implement logic here to inspect the item and determine the target.
             * (i.e. opening an external application in a new window)
             */
            $scope.getTarget = function () {
                // Check if we have a definition of NAV_ITEM_TARGET, if so let's retrieve it and enable the target attr
                // on the nav item.  This allows applications like origin to give a target to it's nav items, while not
                // messing with nav items in the demo/documentation.
                // The default of `_self` is based on the default value of `target` when there's no value present:
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
                return $injector.has('NAV_ITEM_TARGET') ? $injector.get('NAV_ITEM_TARGET') : '_self';
            };
            // provide `route` as a scope property so that links can tie into them
            $scope.route = $route;

            var roleCheck = function (roles) {
                if (_.isUndefined(roles)) {
                    return true;
                }

                if (!_.isUndefined(roles.any)) {
                    return Permission.hasRole(roles.any);
                }

                if (!_.isUndefined(roles.all)) {
                    return Permission.hasAllRoles(roles.all);
                }

                return false;
            };

            /*
             * @description Determines whether or not a nav item should be displayed, based on `visibility`
             * criteria and `roles` criteria
             * @param [visibility] - Can be an expression, a function, an array (using format below) to
             *                     determine visibility
             * @param {object} [roles] - An object with a format { 'any': ['role1', 'role2'] } or
             *                           { 'all': ['role1', 'role2'] }
             */
            $scope.isVisible = function (visibility, roles) {
                var locals = {
                    location: $location
                };
                if (_.isUndefined(visibility) && _.isUndefined(roles)) {
                    // no visibility or role criteria specified, so default to true
                    return true;
                }

                if (_.isArray(visibility)) {
                    // Expected format is
                    // ["someMethodName", { param1: "abc", param2: "def" }]
                    // The second element of the array is optional, used to pass extra
                    // info to "someMethodName"
                    var methodName = visibility[0];
                    var configObj = visibility[1]; //optional

                    _.merge(locals, configObj);

                    // The string 'false' will evaluate to the "real" false
                    // in $scope.$eval
                    visibility = rxVisibility.getMethod(methodName) || 'false';
                }

                // If `visibility` isn't defined, then default it to `true` (i.e. visible)
                var visible = _.isUndefined(visibility) ? true : $scope.$eval(visibility, locals),
                    hasRole = true;

                // Only do a roleCheck() if `visible` is true. If we failed the visibility test,
                // then we must ensure the nav item is not displayed, regardless of the roles
                if (visible && _.isObject(roles)) {
                    hasRole = roleCheck(roles);
                }

                return visible && hasRole;
            };

            $scope.toggleNav = function (ev, href) {
                // if no href present, simply toggle active state
                if (_.isEmpty(href)) {
                    ev.preventDefault();
                    $scope.item.active = !$scope.item.active;
                }
                // otherwise, let the default nav do it's thing
            };
        }]
    };
}]);

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxAppNav
 * @restrict E
 * @scope
 * @description
 * Creates a menu based on items passed in.
 *
 * # Navigation Menu JSON Structure
 * EncoreUI applications, by default, load the navigation menu from JSON defined
 * in the [encore-ui-nav project](https://github.com/rackerlabs/encore-ui-nav).
 * You can specify that a different JSON file be used (see the demo below), but
 * a certain structure is expected for the JSON.
 *
 * ## Outer structure/Sections
 * The JSON consists of an array of objects, with each object representing a
 * "section" in the nav. The two demos at the bottom of this page each only have
 * one section, `"All Tools"` and `"Example Menu"`, respectively. As such, the
 * JSON for each of them is an array with one object in it. The default EncoreUI
 * nav menu only has one section `"All Tools"`, and individual products should
 * not be expecting to add their own sections.
 *
 * The application that this documentation lives in has three sections, which you
 * can see if you look at the current left nav menu.
 * They are `EncoreUI`, `Design Styleguide` and `All Components`.
 *
 * ### `title` (required)
 *
 * Each section specified in this array is required to have a `title`
 * attribute, i.e.
 *
 * <pre>
 * navJSON = [
 *     {
 *         "title": "Section 1"
 *     }, {
 *         "title": "Section 2"
 *     }
 * ]
 * </pre>
 *
 * ### `type` (optional)
 * Each section can optionally have a `type` attribute. If present, a class with
 * the value `nav-section-TYPE` will be applied in the nav, otherwise
 * `nav-section-all` will be applied.
 *
 * <pre>
 * navJSON = [
 *     {
 *         "title": "Section 1",
 *         "type": "highlight"
 *     }, {
 *         "title": "Section 2"
 *     }
 * ]
 * </pre>
 *
 * In this example, `Section 1` will have a `nav-section-highlight` class applied
 * to it, while `Section 2` will receive the default `nav-section-all` class.
 *
 * The default Encore nav menu does not currently use the `type` property, and
 * products being added to Encore should avoid it. This attribute is reserved
 * for future use by the EncoreUI designers.
 *
 * ### `children` (optional)
 *
 * A section's `children` attribute details the first level of navigation items
 * that live within the section. This is defined as an array of objects, where
 * each object represents an "item" to be displayed in the nav (and the structure
 * of the objects/items themselves will be defined in the Navigation Items
 * section below). As an example, this could look like:
 *
 *<pre>
 * navJSON = [
 *     {
 *         "title": "Section 1",
 *         "type": "highlight",
 *         "children": [
 *             {
 *                 "href": "/overview",
 *                 "key": "overview",
 *                 "linkText": "Overview"
 *             }, {
 *                 "href": "/about",
 *                 "key": "about",
 *                 "linkText": "About"
 *             },
 *         ]
 *     }, {
 *         "title": "Section 2",
 *         "children": [
 *             {
 *                 "href": "/overview2",
 *                 "linkText": "Section 2 Overview"
 *             }
 *         ]
 *     }
 * ]
 * </pre>
 *
 * These `children` will be able to have further `children` nested inside them,
 * accessible via an expand/collapse chevron, but it is important to note that
 * the top level `children` in each section will _always_ be displayed.
 *
 * ## Navigation Items
 * A Navigation Item is an object that exists in a `children` array, and
 * represents a clickable item. These items have many optional attributes,
 * and can themselves contain `children` attributes.
 *
 * Their only required attribute is `linkText`. The object will also need _one_
 * of the `href` or `children` attributes, but these two should be mutually exclusive.
 *
 * ### `linkText` (required)
 *
 * The `linkText` attribute defines what text will be shown for the item in the
 * nav menu. This was shown in the example above,
 *
 * <pre>
 * {
 *        "title": "Section 1",
 *        "type": "highlight",
 *        "children": [
 *            {
 *                 "href": "/overview",
 *                 "key": "overview",
 *                 "linkText": "Overview"
 *           }, {
 *                 "href": "/about",
 *                 "key": "about",
 *                 "linkText": "About"
 *           },
 *       ]
 * }
 * </pre>
 *
 * These items will be displayed in the nav with `Overview` and `About` text.
 *
 * ### `key` (required for top-level items)
 * The `key` attribute is used to provide an unique identifier for individual
 * navigation items. If you are introducing a new top-level item into the nav
 * menu, then the `key` is required. It is optional for any nested items. There
 * are two possible reasons you would want to provide this for nested items:
 *
 * 1. A nav item with a `key` will have the class `rx-app-key-{{ item.key }}`
 * applied to it
 * 2. `rxAppRoutes` exposes a few methods for working with the key, including
 * `isActiveByKey()` and `setRouteByKey()`
 *
 * In general, you should not need to provide a `key` attribute for any nested
 * children. We try to avoid custom styling inside the nav, so the automatic
 * class application shouldn't be necessary. And the `rxAppRoutes` methods are
 * _generally_ only used internally by EncoreUI.
 *
 *
 * ### `href` (optional)
 *
 * The `href` attribute is used to assign a URL to the item, which will be
 * navigated to when clicked. If the item has a `children` attribute, you
 * normally would not include `href`, because you want the children to
 * expand/collapse when this item is clicked, rather than navigating away to
 * somewhere else.
 *
 * For Encore products within Rackspace, we keep the products on the same domain
 * (encore.rackspace.com), but give each product its own top-level path, i.e.
 * `encore.rackspace.com/foo`, `encore.rackspace.com/bar`. By doing this, the
 * `href` values can simply be entered as `/foo` and `/bar`. And more importantly,
 * `/foo` and `/bar` can be _completely separate Angular applications_. Both
 * applications are available in the nav, but clicking on `/foo` will load a new
 * Angular application, while clicking on `/bar` loads a brand new Angular
 * application.
 *
 * This allows applications to be developed and deployed independently from each
 * other. The nav is aware of all the applications, but they do not have to be
 * aware of each other.
 *
 * An extra feature of `href` is that you can put variables into it, that will be
 * interpolated with the current `$route.current.pathParams`. Thus, you can do
 * something like:
 *
 * <pre>
 * {
 *      "title": "Section 1",
 *     "type": "highlight",
 *     "children": [
 *         {
 *             "href": "/overview",
 *             "key": "overview",
 *             "linkText": "Overview"
 *         }, {
 *             "href": "/about/{{foobar}}",
 *             "key": "about",
 *             "linkText": "About"
 *         },
 *         ]
 * }
 * </pre>
 *
 * If `foobar` is currently in `$route.current.pathParams`, then its value will
 * automatically be inserted into the final URL.
 *
 *
 * ### `children` (optional)
 * If an item doesn't have an `href` attribute, it's probably because it has
 * child items via the `children` attribute.
 *
 * <pre>
 * {
 *      "title": "Section 1",
 *     "type": "highlight",
 *     "children": [
 *         {
 *             "href": "/overview",
 *             "key": "overview",
 *             "linkText": "Overview"
 *         }, {
 *             "href": "/about",
 *             "key": "about",
 *             "linkText": "About"
 *         }, {
 *             "linkText": "People",
 *             "children": [
 *                 {
 *                     "href": "/people/bob",
 *                     "linkText": "Bob",
 *                 }, {
 *                     "href": "/people/sue",
 *                     "linkText": "Sue"
 *                 }
 *
 *             ]
 *         }
 *     ]
 * }
 * </pre>
 *
 * This example shows a new item `People`, which has no `href` of its own, but
 * does have `children`, which contains two new items, each with their own unique `href`.
 *
 * By default, the `Bob` and `Sue` items will not be visible, and in the nav,
 * `People` will automatically have a chevron attached. When clicked, it will
 * expand to show the `children` items.
 *
 * As an aside, in this example, there will likely be one Angular application at
 * `/people`, which is resonsible for routing `/people/bob` and `/people/sue`,
 * while `/overview` and `/about` would probably be two different Angular
 * applications.
 *
 *
 * ### `visibility` and `childVisibility` (optional)
 * The `visibility` attribute is used to control whether or not an individual nav
 * item is visible to the user. If `visibility` is not specified, then by default
 * the item is always visible. The `childVisibility` attribute takes all the same
 * possible values as `visibility`, but is used to determine whether the items in
 * `children` should be visible.
 *
 * `visibility` can take a few types of values. The original form used in EncoreUI
 * was to pass an expression, filtering values with `rxEnvironmentMatch`, i.e.
 *
 * <pre>
 * "visibility": "('unified-preprod' | rxEnvironmentMatch) || ('local' | rxEnvironmentMatch)",
 * </pre>
 *
 * This expression would be evaluated, checking if the user is currently viewing
 * the app in the `unified-preprod` environment or the `local` environment, and
 * only display the item if one of those was true. (See {@link rxEnvironment}
 * for more details on environemnts). This was used to prevent items from being
 * displayed in a production environment if they were only currently available in
 * staging.
 *
 * *Note*: Using an expression for environment checking use has somewhat tailed off.
 * We now have different JSON files for each environment, so checking the current
 * environment is not necessary.
 *
 * Another technique for visibility is to use a predefined set of visibility
 * functions that exist in the framework—`rxPathParams`, for example.
 *
 * To use these, you pass an array to `visibility`, with the first argument being
 * the name of the function to use (as a string), and the second argument as an
 * optional object describing the parameters to pass to the function.
 *
 * For instance, `rxPathParams` is used to check if a particular parameter is
 * present in the current route. The syntax is as follows:
 *
 * <pre>
 * "visibility": ["rxPathParams", { "param": "accountNumber" }],
 * </pre>
 *
 * This means "only show this item if `accountNumber` is present in the current route.
 *
 * `rxPathParams` is typically used with `childVisibility`, not `visibility`. For
 * instance, the `Account` section in Encore will by default show a search directive
 * (discussed later), and none of its children are visible. After entering a search
 * term, an account number is found, and inserted into the route. At that point,
 * all of the children under `Account` will be visible, as they all require an
 * `accountNumber` to correctly operate.
 *
 * ### `childHeader` (optional)
 *
 * The `childHeader` attribute is used to specify an HTML header to be placed
 * above the `children` in an expanded area (and thus having a `childHeader`
 * attribute requires having a `children` attribute).
 *
 * `childHeader` receives HTML content as a string, and uses
 * {@link rxCompile} to compile and insert the content above
 * the `children` items. The compiled content will be linked against the current
 * scope, allowing you to do things like:
 *
 * <pre>
 * {
 *     "title": "Section 1",
 *     "type": "highlight",
 *     "childHeader": "<strong>Current Account:</strong>#{{route.current.pathParams.accountNumber}}",
 *     "children": [
 *         {
 *             "href": "/overview",
 *             "key": "overview",
 *             "linkText": "Overview"
 *         }, {
 *             "href": "/about",
 *             "key": "about",
 *             "linkText": "About"
 *         }, {
 *            "linkText": "People",
 *            "children": [
 *                 {
 *                     "href": "/people/bob",
 *                     "linkText": "Bob"
 *                 }, {
 *                     "href": "/people/sue",
 *                     "linkText": "Sue"
 *                 }
 *             ]
 *         }
 *     ]
 * }
 * </pre>
 *
 * This example will pull the `accountNumber` from the `pathParams`, and insert
 * `Current Account: 1234` above the children.
 *
 *
 *
 * ### `roles` (optional)
 *
 * *Note*: Support for `roles` requires at least version 1.19.0 of EncoreUI.
 *
 * In addition to the `visibility` criteria described above, you can also restrict
 * which items are shown to a user based on the LDAP roles of that user. This is
 * done via the `roles` attribute, which takes a single object as its value. This
 * object can be used to specify that a user requires _all_ roles from a certain
 * set, or _any_ role from a certain set, to see an item. For example:
 *
 * <pre>
 * {
 *     "title": "Section 1",
 *     "type": "highlight",
 *     "childHeader": "<strong>Current Account:</strong>#{{route.current.pathParams.accountNumber}}",
 *     "children": [
 *         {
 *             "href": "/overview",
 *             "key": "overview",
 *             "linkText": "Overview"
 *         }, {
 *             "href": "/about",
 *             "key": "about",
 *             "linkText": "About"
 *         }, {
 *             "linkText": "People",
 *             "children": [
 *                 {
 *                     "href": "/people/bob",
 *                     "linkText": "Bob",
 *                     "roles": { "all": ["role1", "role2"] }
 *                 }, {
 *                     "href": "/people/sue",
 *                     "linkText": "Sue",
 *                     "roles": { "any": ["role1", "role2", "role3"] }
 *                 }
 *
 *             ]
 *         }
 *     ]
 * }
 * </pre>
 *
 * In this example, the `Bob` item can only be seen by users who have _both_ `role1`
 * and `role2` in their LDAP roles, while the `Sue` item can only be seen by users
 * who have _at least one_ of `role1`, `role2`, or `role3`. Please keep in mind that you
 * [can't do real security in front-end JavaScript](https://goo.gl/wzuhxO).
 * Do not rely on `roles` as a security feature. `roles` is purely to enhance user
 * experience, to prevent them from seeing items that they won't have permissions
 * to access anyway. All the data is still sent to the browser. A user who knows
 * how to use the dev tools will be able to see the full list. LDAP role-based
 * security must still happen on the server-side.
 *
 *
 * ### `directive` (optional)
 * The optional `directive` attribute receives the name of a directive in its
 * dash-delimited format (i.e. uses `"rx-account-search"` instead of `"rxAccountSearch"`).
 * If this directive is available, then the navigation menu will have that directive
 * inserted and rendered directly under the `linkText` for the nav item.
 *
 * The most important line in the previous paragraph is `If this directive is
 * available...`. Let's say we add a new `Support` item to the nav, where each
 * of its children are supposed to render its own custom search directive:
 *
 * <pre>
 * {
 *     "linkText": "Support",
 *     "children": [
 *         {
 *             "linkText": "People Support",
 *             "directive": "people-search"
 *         }, {
 *             "linkText": "Machine Support",
 *             "directive": "machine-search"
 *         }
 *     ]
 * }
 * </pre>
 *
 * The _intent_ is that when the user clicks on "Support", the menu will expand
 * to show "People Support" and "Machine Support" child items, and each will
 * contain a search box, defined by the `people-search` and `machine-search`
 * directives, respectively.
 *
 * But where do those directives come from? `rxApp` provides some legacy
 * directives that are available to the nav, including `rxAppSearch`,
 * `rxAccountUsers`, etc. But `people-search` does not come from `rxApp`. And
 * recall from the `href` section that the nav might be defining multiple
 * different Angular applications. What if "Support" is defined in your
 * application, ad that's where `people-search` comes from, but the user is
 * currently in a different application? That different application won't have
 * `people-search` defined anywhere, so when the user clicks on "Support", the
 * directives won't be available.
 *
 * The solution to this is to ensure that these elements with directives _also_
 * have an `href`, and those URLs belong to Angular applications that define those
 * directives. i.e.
 *
 * <pre>
 * {
 *     "linkText": "Support",
 *     "key": "support",
 *     "children": [
 *         {
 *             "linkText": "People Support",
 *             "directive": "people-search",
 *             "href": "/support/people-support",
 *         }, {
 *             "linkText": "Machine Support",
 *             "directive": "machine-search",
 *             "href": "/support/machine-support",
 *         }
 *     ]
 * }
 * </pre>
 *
 * In fact, recall that we said all items _must_ have one of `href` or `children`,
 * so the `href` is necessary anyway. But they key here is that by having an `href`,
 * the browser will navigate to `/support/people-support` / `/support/machine-support`,
 * which should be defined in Angular apps that have `people-search` and `machine-search`
 * available as directives.
 *
 * With this configuration, clicking on `Support` will expand the `children`,
 * and the user will see `People Support` and `Machine Support`, but they will
 * not see the directives. But if they then click on one of `People Support` or
 * `Machine Support`, then the `/support` Angular application will be loaded,
 * the and the directives will become available.
 *
 * @param {object} items Menu items to display. See encoreNav for object definition
 * @param {string} level Level in heirarchy in page. Higher number is deeper nested
 *
 * @example
 * <pre>
 * <rx-app-nav level="1" items="menuItems"></rx-app-nav>
 * </pre>
 */
.directive('rxAppNav', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/rxAppNav.html',
        scope: {
            items: '=',
            level: '='
        }
    };
});

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxAccountUsers
 * @restrict E
 * @description
 * Provides the ability to switch between account users. This directive is specific to Rackspace
 */
.directive('rxAccountUsers', ["$location", "$route", "Encore", "$rootScope", "encoreRoutes", function ($location, $route, Encore, $rootScope, encoreRoutes) {
    return {
        restrict: 'E',
        templateUrl: 'templates/rxAccountUsers.html',
        link: function (scope, element) {
            scope.isCloudProduct = false;

            var checkCloud = function () {
                encoreRoutes.isActiveByKey('accountLvlTools').then(function (isAccounts) {
                    if (isAccounts) {
                        loadUsers();
                        encoreRoutes.isActiveByKey('cloud').then(function (isCloud) {
                            scope.isCloudProduct = isCloud;
                        });
                    } else {
                        scope.isCloudProduct = false;
                    }
                });
            };

            // We use $route.current.params instead of $routeParams because
            // the former is always available, while $routeParams only gets populated
            // after the route has successfully resolved. See the Angular docs on $routeParams
            // for more details.
            function loadUsers () {
                var success = function (account) {

                    // Sort the list so admins are at the top of the array
                    account.users = _.sortBy(account.users, 'admin');

                    scope.users = account.users;

                    scope.currentUser = $route.current.params.user;

                    if (!scope.currentUser) {
                        // We're not in Cloud, but instead in Billing, or Events, or
                        // one of the other Accounts menu items that doesn't use a username as
                        // part of the route params.
                        // But we need the URLs for the Cloud items to be valid, so grab a
                        // default username for this account, and rebuild the Cloud URLs with
                        // it

                        encoreRoutes.rebuildUrls({ user: account.users[0].username });
                    }
                };

                var accountNumber = parseInt($route.current.params.accountNumber, 10);
                if (accountNumber) {
                    Encore.getAccountUsers({ id: accountNumber }, success);
                }
            }

            checkCloud();

            scope.switchUser = function (user) {
                // TODO: Replace with updateParams in Angular 1.3
                //$route.updateParams({ user: user });

                // Update the :user route param
                var params = $route.current.originalPath.split('/');
                var userIndex = _.indexOf(params, ':user');

                if (userIndex !== -1) {
                    var path = $location.url().split('/');
                    path[userIndex] = user;
                    $location.url(path.join('/'));
                }
            };

            var unregisterCheckCloud = $rootScope.$on('$routeChangeSuccess', checkCloud);

            // We need to register a function to cleanup the watcher, this avoids multiple calls
            //Ecore.getAccountUsers every time we load a page in cloud.
            element.on('$destroy', function () {
                unregisterCheckCloud();
            });
        }
    };
}]);

angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxAccountSearch
 * @restrict E
 * @description [TBD]
 */
.directive('rxAccountSearch', ["$window", function ($window) {
    return {
        templateUrl: 'templates/rxAccountSearch.html',
        restrict: 'E',
        link: function (scope) {
            scope.fetchAccount = function (searchValue) {
                if (!_.isEmpty(searchValue)) {
                    $window.location = '/search?term=' + searchValue;
                }
            };
        }
    };
}]);

angular.module('encore.ui.rxApp')
.provider('appRoutes', function () {
  this.routes = [];
  this.$get = function () {
    return this.routes;
  };
});

angular.module('encore.ui.rxApp')
.directive('rxApp', ["$window", "appRoutes", function ($window, appRoutes) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/rxApp.html',
    link: function (scope) {
      scope.routes = appRoutes;
      scope.isEmbedded = $window.self !== $window.top;
    }
  };
}]);

/**
 * @ngdoc overview
 * @name layout
 * @description
 * # layout Component
 *
 * Encore UI includes a grid system forked from
 * [Angular Material's layout module](https://material.angularjs.org/#/layout/container)
 * with minor usability enhancements to provide an assortment of attribute-based
 * layout options based on the flexbox layout model. Included are intuitive attribute
 * based styles that ease the creation of responsive row and/or column based page layouts.
 *
 * ## Note About Responsive Features
 *
 * Two versions of the Encore UI CSS file are included in this project. One includes
 * responsive design style attributes (encore-ui-resp-x.x.x.css). The other omits
 * these attributes to save space if desired (encore-ui-x.x.x.css). Be sure to only
 * include the appropriate css file for your project. Any attributes which include
 * the following suffixes require the responsive css file to work:
 * '-sm', '-gt-sm', '-md', '-gt-md', '-lg', '-gt-lg'.
 */
angular.module('encore.ui.layout', []);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxApp.html',
    '<div class="rx-app" ng-class="{embedded: isEmbedded}"><div class="rx-eyebrow" ng-show="!isEmbedded"><ul class="rx-nav pull-left"><li class="rx-nav-item rx-nav-logo"><a href="#"><span class="rackspace-logo-bw"></span></a></li><li class="rx-nav-item"><a href="https://my.rackspace.com/">Back to MyRackspace</a></li></ul><ul class="rx-nav pull-right"><li class="rx-nav-item"><a href="https://my.rackspace.com/portal/feedback/index">Feedback</a></li><li class="rx-nav-item"><a href="https://my.rackspace.com/portal/ticket/create">Create Ticket</a></li><li class="rx-nav-item"><a href="https://my.rackspace.com/portal/support/team">Contact Support</a></li><li class="rx-nav-item"><rx-action-menu class="account-menu" text="Barbra Streisand"><ul class="actions-area"><li><div>Account: 123456</div><div>Company ABC</div></li><li class="divider"></li><li><a href="#">Notifications<div class="caption">Incidents, maintenances, etc.</div></a></li><li><a href="#">Support Tickets<div class="caption">Your support questions</div></a></li><li class="divider"></li><li><a href="#">Profile Settings</a></li><li><a href="#">Logout</a></li></ul></rx-action-menu></li></ul></div><div class="rx-nav-primary" ng-if="routes.length > 0 && !isEmbedded"><ul class="rx-nav"><li class="rx-nav-item" ng-repeat="route in routes" ng-class="{\'active\': activePrimaryNavItem === \'components\'}"><rx-action-menu text="{{route.title}}" type="utility" ng-if="route.children && route.children.length > 0"><ul class="actions-area"><li ng-repeat="navItem in route.children"><a class="rs-dropdown-link" ng-href="{{navItem.href}}">{{navItem.linkText}}</a></li></ul></rx-action-menu><a ng-if="!route.children" ng-href="{{route.href}}">{{route.title}}</a></li></ul></div><div ng-transclude></div><div class="rx-push" ng-show="!isEmbedded"></div></div><div class="rx-footer" ng-show="!isEmbedded"><ul class="rx-nav"><li class="rx-nav-item">&copy; Rackspace, US</li><li class="rx-nav-item"><a href="http://www.rackspace.com/information/legal/websiteterms" target="blank">Website Terms</a></li><li class="rx-nav-item"><a href="http://www.rackspace.com/information/legal/privacystatement" target="blank">Privacy Policy</a></li></ul></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxAccountSearch.html',
    '<div class="rx-app-search"><form name="search" role="search" ng-submit="fetchAccount(model)"><input type="text" placeholder="Search by Account Number or Username..." ng-model="model" class="form-item search-input" ng-required ng-pattern="/^([0-9a-zA-Z._ -]{2,})$/"> <button type="submit" class="search-action" ng-disabled="!search.$valid"><span class="visually-hidden">Search</span></button></form></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxAccountUsers.html',
    '<span ng-if="isCloudProduct" class="account-users"><select rx-select ng-model="currentUser" ng-options="user.username as user.username for user in users" ng-change="switchUser(currentUser)"></select></span>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxAppNav.html',
    '<div class="rx-app-nav rx-app-nav-level-{{level}}"><ul class="rx-app-nav-group"><rx-app-nav-item ng-repeat="item in items" item="item"></rx-app-nav-item></ul></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxAppNavItem.html',
    '<li class="rx-app-nav-item" ng-show="isVisible(item.visibility, item.roles)" ng-class="{\'has-children\': item.children.length > 0, active: item.active, \'rx-app-key-{{ item.key }}\': item.key }"><a ng-href="{{ getUrl(item.url) }}" ng-attr-target="{{ getTarget() }}" class="item-link" ng-click="toggleNav($event, item.href)">{{item.linkText}}</a><div class="item-content" ng-show="item.active && (item.directive || item.children)"><div class="item-directive" ng-show="item.directive"><!-- item.directive injected here --></div><div class="item-children" ng-show="item.children && isVisible(item.childVisibility)"><div class="child-header" ng-if="item.childHeader" rx-compile="item.childHeader"></div><!-- rx-app-nav injected here if \'children\' is array --></div></div></li>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxAppSearch.html',
    '<div class="rx-app-search"><form role="search" ng-submit="submit(model)"><input type="text" placeholder="{{ placeholder }}" ng-model="model" class="form-item search-input" ng-required rx-attributes="{\'ng-pattern\': pattern}"> <button type="submit" class="search-action"><span class="visually-hidden">Search</span></button></form></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxBillingSearch.html',
    '<div class="rx-app-search"><form name="search" role="search" ng-submit="fetchAccounts(model)"><fieldset><input type="text" ng-attr-placeholder="Search by {{ placeholder }}" ng-model="model" class="form-item search-input" ng-required> <button type="submit" class="search-action" ng-disabled="!search.$valid"><span class="visually-hidden">Search</span></button></fieldset><fieldset><ul><li class="search-option"><label for="transaction"><input id="transaction" type="radio" value="bsl" ng-model="searchType"> Transaction/Auth ID</label></li><li class="search-option"><label for="account"><input id="account" type="radio" value="cloud" ng-model="searchType"> Account/Contact Info</label></li></ul></fieldset></form></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxPage.html',
    '<div class="rx-page"><header class="page-header clearfix"><rx-breadcrumbs status="{{ status }}"></rx-breadcrumbs><rx-account-info ng-if="accountNumber" account-info-banner="true" account-number="{{ accountNumber }}" team-id="{{ teamId }}"></rx-account-info></header><div class="page-body"><rx-notifications></rx-notifications><div class="page-titles" ng-if="title.length > 0 || unsafeHtmlTitle.length > 0 || subtitle.length > 0"><h2 class="page-title" ng-if="title.length > 0"><span ng-bind="title"></span><rx-status-tag status="{{ status }}"></rx-status-tag></h2><h2 class="page-title" ng-if="unsafeHtmlTitle.length > 0"><span ng-bind-html="unsafeHtmlTitle"></span><rx-status-tag status="{{ status }}"></rx-status-tag></h2><h3 class="page-subtitle subdued" ng-bind-html="subtitle" ng-if="subtitle.length > 0"></h3></div><div class="page-content" ng-transclude></div></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxCollapse.html',
    '<div class="collapse-container" ng-class="{\'hide-border\': !title}"><div ng-if="title" class="collapse-title-wrap"><div class="rx-collapse-title">{{title}}</div><i class="fa {{isExpanded ? \'fa-chevron-up\' : \'fa-chevron-down\'}}" ng-click="toggleExpanded()"></i></div><div ng-show="isExpanded" ng-class="{\'collapse-body\':title}" ng-transclude></div><div ng-if="!title" ng-class="{ expanded: isExpanded }" class="collapse-title-wrap collapse-title-wrap-default" ng-click="toggleExpanded()"><span ng-if="!isExpanded" class="sml-title"><span class="toggle-title">See More</span> <i class="fa fa-angle-double-down"></i> </span><span ng-if="isExpanded" class="sml-title"><span class="toggle-title">See Less</span> <i class="fa fa-angle-double-up"></i></span></div></div>');
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
  $templateCache.put('templates/rxPopover.html',
    '<div><button ng-if="!text" class="rs-cog" ng-click="toggle()"></button><div class="rs-popover" ng-if="displayed"><div class="rs-popover-arrow rs-popover-arrow-top-left"></div><div class="rs-popover-content" ng-transclude></div></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxSortableColumn.html',
    '<div class="rx-sortable-column"><div class="sort-action btn-link" ng-click="sortMethod({property:sortProperty})"><span class="visually-hidden">Sort by&nbsp;</span> <span class="display-value" ng-transclude></span> <span class="visually-hidden">Sorted {{reverse ? \'ascending\' : \'descending\'}}</span> <span class="sort-icon fa-stack"><i class="bg fa fa-stack-1x fa-sort"></i> <span ng-if="predicate === sortProperty" class="sort-direction-icon" ng-class="{ \'ascending\': !reverse, \'descending\': reverse }"><i ng-if="reverse" class="fa fa-stack-1x fa-sort-desc"></i> <i ng-if="!reverse" class="fa fa-stack-1x fa-sort-asc"></i></span></span></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxStatusColumn.html',
    '<span></span>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxActionMenu.html',
    '<div class="action-menu-container"><a ng-if="text" class="rx-action-menu-toggle" ng-click="toggle()">{{text}} <i class="fa fa-chevron-down"></i> </a><i ng-if="!text" class="fa fa-cog fa-lg" ng-click="toggle()"></i><div class="action-list" ng-show="displayed" ng-click="modalToggle()" ng-transclude></div></div>');
}]);

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxButton.html',
    '<button type="submit" class="button rx-button {{classes}}" ng-disabled="toggle || disable">{{ toggle ? toggleMsg : defaultMsg }}<div class="spinner" ng-show="toggle"><i class="pos1"></i> <i class="pos2"></i> <i class="pos3"></i></div></button>');
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

angular.module('encore.bridge').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/rxTags.html',
    '<div class="rx-tags" ng-click="focusInput($event)"><div class="tag" ng-repeat="tag in tags track by tag.text" ng-keydown="removeIfBackspace($event, tag)" tabindex="{{ disabled ? \'\' : 0 }}"><i class="fa fa-tag"></i> <span class="text">{{tag.text}}</span> <span class="category">({{tag.category}})</span> <i class="fa fa-times" ng-click="remove(tag)"></i></div><input type="text" placeholder="{{ disabled ? \'\' : \'Enter a tag\' }}" ng-model="newTag" ng-keydown="focusTag($event, newTag)" ng-disabled="disabled" typeahead="tag as tag.text for tag in options | xor:tags | filter:{text: $viewValue}" typeahead-on-select="add(newTag)"></div>');
}]);
