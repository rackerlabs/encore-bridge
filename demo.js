angular.module('demoApp')
.controller('layoutController', function ($scope) {
    $scope.layout = 'row';
    $scope.align = { first: 'center', second: 'middle' };
    $scope.options1 = ['left', 'center', 'right', 'spread', 'justify'];
    $scope.options2 = ['top', 'middle', 'bottom', 'stretch'];

    // Swap the first 3 items in each array and set new value
    $scope.swap = function (option) {

        if ($scope.layout === option) {
            return;
        }

        var swap = $scope.options2.slice(0, 3).concat($scope.options1.slice(3));
        $scope.options2 = $scope.options1.slice(0, 3).concat($scope.options2.slice(3));
        $scope.options1 = swap;
        swap = $scope.options1[$scope.options1.indexOf($scope.align.second)] || 'spread';
        $scope.align.second = $scope.options2[$scope.options2.indexOf($scope.align.first)] || 'stretch';
        $scope.align.first = swap;
    };
});

angular.module('demoApp')
.controller('rxAppCtrl', function ($scope, $location, $rootScope, $window, encoreRoutes, rxVisibility, Session) {
    Session.getUserId = function () {
        return 'bert3000';
    };

    $scope.subtitle = 'With a subtitle';

    $scope.changeSubtitle = function () {
        $scope.subtitle = 'With a new subtitle at ' + Date.now();
    };

    rxVisibility.addMethod(
        'isUserDefined',
        function () {
            return !_.isEmpty($rootScope.user);
        }
    );

    $scope.changeRoutes = function () {
        var newRoute = {
            linkText: 'Updated Route',
            childVisibility: 'true',
            children: [
                {
                    linkText: 'New child route'
                }
            ]
        };

        encoreRoutes.setRouteByKey('accountLvlTools', newRoute);
    };

    // Fake navigation
    var customApp = document.getElementById('custom-rxApp');
    customApp.addEventListener('click', function (ev) {
        var target = ev.target;

        if (target.className.indexOf('item-link') > -1) {
            // prevent the default jump to top
            ev.preventDefault();

            var href = target.getAttribute('href');

            // update angular location (if href has a value)
            if (!_.isEmpty(href)) {
                // we need to prevent the window from scrolling (the demo does this)
                // so we get the current scrollTop position
                // and set it after the demo page has run '$routeChangeSuccess'
                var currentScollTop = document.body.scrollTop;

                $location.hash(href);

                $rootScope.$apply();

                $window.scrollTo(0, currentScollTop);
            }
        }
    });

    var searchDirective = [
        'rx-app-search placeholder="Enter User"',
        'model="$root.user"',
        'pattern="/^([0-9a-zA-Z._ -]{2,})$/"'
    ].join(' ');

    $scope.customMenu = [{
        title: 'Example Menu',
        children: [
            {
                href: 'Lvl1-1',
                linkText: '1st Order Item'
            },
            {
                linkText: '1st Order Item (w/o href) w/ Children',
                childVisibility: [ 'isUserDefined' ],
                childHeader: '<strong class="current-search">Current User:</strong>' +
                             '<span class="current-result">{{$root.user}}</span>',
                directive: searchDirective,
                children: [
                    {
                        href: 'Lvl1-2-Lvl2-1',
                        linkText: '2nd Order Item w/ Children',
                        children: [{
                            href: 'Lvl1-2-Lvl2-1-Lvl3-1',
                            linkText: '3rd Order Item'
                        }]
                    },
                    {
                        href: 'Lvl1-2-Lvl2-2',
                        linkText: '2nd Order Item w/ Children',
                        children: [
                            {
                                href: 'Lvl1-2-Lvl2-2-Lvl3-1',
                                linkText: '3rd Order Item'
                            },
                            {
                                href: 'Lvl1-2-Lvl2-2-Lvl3-2',
                                linkText: '3rd Order Item'
                            },
                            {
                                href: 'Lvl1-2-Lvl2-2-Lvl3-3',
                                linkText: '3rd Order Item'
                            },
                            {
                                href: 'Lvl1-2-Lvl2-2-Lvl3-4',
                                linkText: '3rd Order Item'
                            }
                        ]
                    },
                    {
                        href: 'Lvl1-2-Lvl2-3',
                        linkText: '2nd Order Item'
                    }
                ]
            },
            {
                href: 'Lvl1-3',
                linkText: '1st Order Item w/ Children',
                children: [
                    {
                        href: 'Lvl1-3-Lvl2-1',
                        linkText: '2nd Order Item'
                    }
                ]
            }
        ]
    }];

    // Load docs homepage ('Overview')
    // NOTE: Trailing forward slash is not an accident.
    // This is required to get Firefox to load the iframe.
    //
    // The resulting url should have double forward slashes `//`.
    $scope.embedUrl = $location.absUrl().split('#')[0] + '/';
});

angular.module('demoApp')
.controller('rxFormDemoCtrl', function ($scope) {
    /* ========== DATA ========== */
    $scope.volumeTypes = [
        {
            'value': 'SATA',
            'label': 'SATA'
        },
        {
            'value': 'SSD',
            'label': 'SSD'
        },
        {
            'value': 'CD',
            'label': 'CD'
        },
        {
            'value': 'DVD',
            'label': 'DVD'
        },
        {
            'value': 'BLURAY',
            'label': 'BLURAY'
        },
        {
            'value': 'TAPE',
            'label': 'TAPE'
        },
        {
            'value': 'FLOPPY',
            'label': 'FLOPPY'
        },
        {
            'value': 'LASERDISC',
            'label': 'LASERDISC'
        },
        {
            'value': 'JAZDRIVE',
            'label': 'JAZDRIVE'
        },
        {
            'value': 'PUNCHCARDS',
            'label': 'PUNCHCARDS'
        },
        {
            'value': 'RNA',
            'label': 'RNA'
        }
    ];

    $scope.services = [
        {
            'value': 'good',
            'label': 'Good Service'
        },
        {
            'value': 'cheap',
            'label': 'Cheap Service'
        },
        {
            'value': 'fast',
            'label': 'Fast Service'
        },
        {
            'value': 'custom',
            'label': 'Custom Service'
        }
    ];

    $scope.beatles = [
        'Paul McCartney',
        'John Lennon',
        'Ringo Starr',
        'George Harrison'
    ];

    $scope.nevers = [
        'Give you up',
        'Let you down',
        'Run around',
        'Desert you',
        'Make you cry',
        'Say goodbye',
        'Tell a lie',
        'Hurt you'
    ];

    $scope.optionTableData = [
        {
            'id': 'option1_id',
            'name': 'Option #1',
            'value': 0,
            'obj': {
                'name': 'Nested Name 1'
            }
        }, {
            'id': 'option2_id',
            'name': 'Option #2',
            'value': 1,
            'obj': {
                'name': 'Nested Name 2'
            }
        }, {
            'id': 'option3_id',
            'name': 'Option #3',
            'value': 2,
            'obj': {
                'name': 'Nested Name 3'
            }
        }, {
            'id': 'option4_id',
            'name': 'Option #4',
            'value': 3,
            'obj': {
                'name': 'Nested Name 4'
            }
        }
    ];

    $scope.optionTableColumns = [
        {
            'label': 'Name',
            'key': 'name',
            'selectedLabel': '(Already saved data)'
        }, {
            'label': 'Static Content',
            'key': 'Some <strong>Text &</strong> HTML'
        }, {
            'label': 'Expression 2',
            'key': '{{ value * 100 | number:2 }}'
        }, {
            'label': 'Expression 3',
            'key': '{{ obj.name | uppercase }}'
        }, {
            'label': 'Expression 4',
            'key': '{{ value | currency }}'
        }
    ];

    $scope.optionTableCheckboxData = [
        {
            'name': 'Item 1'
        }, {
            'name': 'Item 2',
            'value': 'checked',
            'falseValue': 'unchecked'
        }
    ];

    $scope.optionTableEmptyData = [];

    /* ========== FUNCTIONS ========== */
    $scope.disableOption = function (tableId, fieldId, rowId) {
        return rowId === 'option4_id';
    };

    /* ========== FORM MODELS ========== */
    $scope.simple = {
        userEmail: '',
        // TODO: use isNameRequired for rxFieldName "required" midway tests
        // TODO: remove this comment after completed
        isNameRequired: true,
        volumeName: ''
    };

    $scope.intermediate = {
        volumeType: _.first($scope.volumeTypes).value, // select the first type by default
        services: [],
        favoriteBeatle: 'all',
        settings: {
            first: true,
            second: false,
            third: true,
            fourth: false
        },
        table: {
            radio: 0,
            checkbox: [true, 'unchecked'], // example with first checkbox automatically checked
            empty: [true, 'unchecked']
        }
    };

    $scope.advanced = {
        radChoice: 'default',
        inputEnabled: false
    };
});

// A dummy directive only used within the rxForm demo page.
// It's used to check that some string contains 'foo', and works
// with ngForm to set the appropriate `.$error` value
// Note: This code is easier to write in Angular 1.3, because
// you can use `.$validators` instead of `.$parsers`
angular.module('encore.ui.rxForm')
.directive('foocheck', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // Put a new validator on the beginning
            ctrl.$parsers.unshift(function (viewValue) {
                if (_.contains(viewValue, 'foo')) {
                    ctrl.$setValidity('foocheck', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('foocheck', false);
                    return undefined;
                }
            });
        }
    };
});

angular.module('demoApp')
.controller('rxRadioCtrl', function ($scope) {
    $scope.validEnabled = 1;
    $scope.validDisabled = 1;
    $scope.validNgDisabled = 1;

    $scope.invalidEnabled = 1;
    $scope.invalidDisabled = 1;
    $scope.invalidNgDisabled = 1;

    $scope.radCreateDestroy = 'destroyed';
    $scope.plainHtmlRadio = 'isChecked';
});

angular.module('demoApp')
.controller('rxSortableColumnCtrl', function ($scope, rxSortUtil) {
    $scope.sort = rxSortUtil.getDefault('name', false);

    $scope.sortCol = function (predicate) {
        return rxSortUtil.sortCol($scope, predicate);
    };

    $scope.talentPool = [
        {
            name: 'Andrew Yurisich',
            jobTitle: 'Mailroom Associate IV'
        },
        {
            name: 'Patrick Deuley',
            jobTitle: 'Design Chaplain'
        },
        {
            name: null,
            jobTitle: 'Chief Mastermind'
        },
        {
            jobTitle: 'Assistant Chief Mastermind'
        },
        {
            name: 'Hussam Dawood',
            jobTitle: 'Evangelist of Roger Enriquez'
        },
        {
            name: 'Kerry Bowley',
            jobTitle: 'Dev Mom'
        },
    ];
});

angular.module('demoApp')
.controller('rxStatusColumnCtrl', function ($scope, rxStatusMappings, rxSortUtil) {
    $scope.servers = [
        { status: 'ACTIVE', title: 'ACTIVE status' },
        { status: 'ERROR', title: 'ERROR status' },
        { status: 'DISABLED', title: 'DISABLED status' },
        { status: 'DELETED', title: 'DELETED status mapped to ERROR' },
        { status: 'UNKNOWN', title: 'UNKNOWN status mapped to ERROR' },
        { status: 'RESCUE', title: 'RESCUE status mapped to INFO' },
        { status: 'SUSPENDED', title: 'SUSPENDED status mapped to WARNING' },
        { status: 'REBUILD', title: 'REBUILD status mapped to PENDING' },
        { status: 'RESIZE', title: 'RESIZE status mapped to PENDING' },
        { status: 'MIGRATING', title: 'MIGRATING status mapped to PENDING' },
        { status: 'DELETING', title: 'DELETING status mapped to PENDING, using `fooApi` mapping', api: 'fooApi' }
    ];

    // We have a few different ways of adding mappings. We've tried to show them all here
    rxStatusMappings.addGlobal({
        'DELETING': 'PENDING'
    });
    rxStatusMappings.mapToInfo('RESCUE');
    rxStatusMappings.mapToWarning('SUSPENDED');
    rxStatusMappings.mapToPending(['REBUILD','RESIZE','MIGRATING']);
    rxStatusMappings.mapToError(['DELETED', 'UNKNOWN']);
    rxStatusMappings.addAPI('fooApi', { 'DELETING': 'PENDING' });
    rxStatusMappings.mapToPending('SomeApiSpecificStatus', 'fooApi');
    $scope.sortCol = function (predicate) {
        return rxSortUtil.sortCol($scope, predicate);
    };
    $scope.sort = rxSortUtil.getDefault('status');
});

angular.module('demoApp')
.controller('rxActionMenuCtrl', function ($scope, rxNotify) {
    $scope.add = function () {
        rxNotify.add('Added!', {
            type: 'success',
            repeat: false,
            timeout: 3
        });
    };

    $scope.remove = function () {
        rxNotify.add('Deleted!', {
            type: 'error',
            repeat: false,
            timeout: 3
        });
    };
});

angular.module('demoApp')
.controller('buttonAnimatedExampleCtrl', function ($scope, $timeout) {
    $scope.status = {
        loading: false,
        disable: false
    };

    $scope.clickMe = function () {
        $scope.status.loading = true;
        $timeout(function () {
            $scope.status.loading = false;
        }, 4000);
    };
});

angular.module('demoApp')
.controller('buttonGroupExampleCtrl', function ($scope) {
    $scope.status = 'off';
});

angular.module('demoApp')
.controller('rxButtonDisableCtrl', function ($scope, $timeout) {
    $scope.status = {
        loading: false,
        disable: true
    };

    $scope.login = function () {
        $scope.status.loading = true;

        $timeout(function () {
            $scope.status.loading = false;
        }, 4000);
    };//login()
});

angular.module('demoApp')
.controller('rxButtonSimpleCtrl', function ($scope, $timeout) {
    $scope.isLoading = false;

    $scope.login = function () {
        $scope.isLoading = true;

        $timeout(function () {
            $scope.isLoading = false;
        }, 4000);
    };//login()
});

angular.module('demoApp')
.controller('rxCheckboxCtrl', function ($scope) {
    $scope.chkValidEnabledOne = true;
    $scope.chkValidEnabledTwo = false;
    $scope.chkValidDisabledOne = true;
    $scope.chkValidDisabledTwo = false;
    $scope.chkValidNgDisabledOne = true;
    $scope.chkValidNgDisabledTwo = false;

    $scope.chkInvalidEnabledOne = true;
    $scope.chkInvalidEnabledTwo = false;
    $scope.chkInvalidDisabledOne = true;
    $scope.chkInvalidDisabledTwo = false;
    $scope.chkInvalidNgDisabledOne = true;
    $scope.chkInvalidNgDisabledTwo = false;
});

angular.module('demoApp')
.controller('rxDatePickerCtrl', function ($scope) {
    $scope.enabledValid = '2015-12-15';
    $scope.disabledValid = '2015-12-15';

    $scope.enabledInvalid = '2015-12-15';
    $scope.disabledInvalid = '2015-12-15';
});

angular.module('demoApp')
.controller('rxTimePickerCtrl', function ($scope) {
    $scope.enabledValid = '06:00-06:00';
    $scope.disabledValid = '20:00+08:00';

    $scope.enabledInvalid = '17:45+05:00';
    $scope.disabledInvalid = '05:15+00:00';
});

angular.module('demoApp')
.controller('formsAutoSaveExampleController', function ($scope, rxAutoSave) {
    $scope.forms = { autosave: '' };
    rxAutoSave($scope, 'forms');
});

angular.module('demoApp')
.controller('formsDisabledExamplesCtrl', function ($scope) {
    $scope.txtDisabled = 'Disabled Text Input';
    $scope.selDisabled = 'disabled';
    $scope.radDisabled = 1;
    $scope.chkDisabledOne = true;
    $scope.chkDisabledTwo = false;
    $scope.togDisabledOn = true;
    $scope.togDisabledOff = false;
    $scope.txtAreaDisabled = 'Disabled Textarea';
});

angular.module('demoApp')
.controller('formsManualSaveExampleController', function ($scope, $timeout, rxNotify) {
    $scope.saving = false;
    $scope.save = function () {
        $scope.saving = true;
        rxNotify.clear('page');
        $timeout(function () {
            $scope.saving = false;
            $scope.lastSaved = Date.now();
            rxNotify.add('Data successfully saved!', {
                type: 'success'
            });
        }, 1000);
    };
});

angular.module('demoApp')
.controller('formsInvalidExamplesCtrl', function ($scope) {
    $scope.txtInvalid = 'Invalid text input';
    $scope.selInvalid = 'invalid';
    $scope.radInvalid = 1;
    $scope.chkInvalidOne = true;
    $scope.chkInvalidTwo = false;
    $scope.togInvalidOn = true;
    $scope.togInvalidOff = false;
    $scope.txtAreaInvalid = 'Invalid Value';
});

angular.module('demoApp')
.controller('rxCheckboxShowHideCtrl', function ($scope) {
    $scope.amSure = false;
    $scope.amReallySure = false;

    $scope.$watch('amSure', function (newVal) {
        if (newVal === false) {
            $scope.amReallySure = false;
        }
    });
});

angular.module('demoApp')
.controller('rxDatePickerEmptyCtrl', function ($scope) {
    $scope.emptyDate = '';

    $scope.undefinedDate = undefined;
});

angular.module('demoApp')
.controller('rxDatePickerSimpleCtrl', function ($scope) {
    $scope.dateModel = moment(new Date()).format('YYYY-MM-DD');
});

angular.module('demoApp')
.controller('rxTimePickerSimpleCtrl', function ($scope) {
    $scope.emptyValue = '';
    $scope.predefinedValue = '22:10-10:00';
});

angular.module('demoApp')
.controller('metadataSimpleExampleCtrl', function ($scope) {
    $scope.someDate = new Date('January 6 1989');
    $scope.someAmount = 192.68;
});

angular.module('demoApp')
.controller('tagsSimpleExampleCtrl', function ($scope) {
    $scope.tagOptions = [
        { text: 'apple', category: 'fruit' },
        { text: 'orange', category: 'fruit' },
        { text: 'banana', category: 'fruit' },
        { text: 'squash', category: 'vegetable' }
    ];
    $scope.tags = ['apple'];
});

angular.module('demoApp')
.controller('SessionSimpleCtrl', function ($scope, $window, Session) {
    $scope.isAuthenticated = function () {
        $window.alert(Session.isAuthenticated());
    };
});

angular.module('demoApp')
.controller('rxAgeCtrl', function ($scope) {
    var day = 1000 * 60 * 60 * 24;
    $scope.ageHours = new Date((Date.now() - (day / 2.3))).toString();
    $scope.ageDays = new Date((Date.now() - (day * 1.5))).toString();
    $scope.ageMonths = new Date((Date.now() - (day * 40.2))).toString();
    $scope.ageYears = new Date((Date.now() - (day * 380.1))).toString();
});

angular.module('demoApp')
.controller('rxLocalStorageSimpleCtrl', function ($scope, $window, rxLocalStorage) {
    $scope.setSideKick = function () {
        rxLocalStorage.setObject('joker', { name: 'Harley Quinn' });
    };

    $scope.getSideKick = function () {
        var sidekick = rxLocalStorage.getObject('joker');
        $window.alert(sidekick.name);
    };
});

angular.module('demoApp')
.controller('rxSortEmptyTopSimpleCtrl', function ($scope, PageTracking, rxSortUtil) {
    $scope.sort = rxSortUtil.getDefault('name');
    $scope.sort = rxSortUtil.getDefault('name', false);
    $scope.pager = PageTracking.createInstance();

    $scope.sortCol = function (predicate) {
        return rxSortUtil.sortCol($scope, predicate);
    };

    $scope.serverVolumes = [
        {
            name: 'Monitor Agent 4',
            volumeId: 'a44079a5-040b-495f-be22-35994ea03cc5'
        },
        {
            name: 'Stress Volume 33',
            volumeId: '65d89e82-9363-482e-92d1-f3f7d4f135a7'
        },
        {
            name: null,
            volumeId: '0a87a764-45f0-4a1e-8dbf-20d76291022d'
        },
        {
            name: 'Stress Volume 24',
            volumeId: ''
        },
        {
            name: null,
            volumeId: 'be827f83-8d4c-4d4c-afc3-4c9bf0fdfe00'
        },
    ];
});

angular.module('demoApp')
.controller('rxStatusMappingsSimpleCtrl', function ($scope, rxStatusMappings) {
    $scope.servers = [
        { status: 'ACTIVE', title: 'ACTIVE status' },
        { status: 'ERROR', title: 'ERROR status' },
        { status: 'DISABLED', title: 'DISABLED status' },
        { status: 'DELETED', title: 'DELETED status mapped to ERROR' },
        { status: 'UNKNOWN', title: 'UNKNOWN status mapped to ERROR' },
        { status: 'RESCUE', title: 'RESCUE status mapped to INFO' },
        { status: 'SUSPENDED', title: 'SUSPENDED status mapped to WARNING' },
        { status: 'REBUILD', title: 'REBUILD status mapped to PENDING' },
        { status: 'RESIZE', title: 'RESIZE status mapped to PENDING' },
        { status: 'MIGRATING', title: 'MIGRATING status mapped to PENDING' },
        { status: 'DELETING', title: 'DELETING status mapped to PENDING, using `fooApi` mapping', api: 'fooApi' }
    ];

    // We have a few different ways of adding mappings. We've tried to show them all here
    rxStatusMappings.addGlobal({
        'DELETING': 'PENDING'
    });
    rxStatusMappings.mapToInfo('RESCUE');
    rxStatusMappings.mapToWarning('SUSPENDED');
    rxStatusMappings.mapToPending(['REBUILD','RESIZE','MIGRATING']);
    rxStatusMappings.mapToError(['DELETED', 'UNKNOWN']);
    rxStatusMappings.addAPI('fooApi', { 'DELETING': 'PENDING' });
    rxStatusMappings.mapToPending('SomeApiSpecificStatus', 'fooApi');
});

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('layout.docs.html',
    '<h3 class="clear">Two u-1-2 modules</h3><div class="pure-g clear"><div class="pure-u-1-2"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div><div class="pure-u-1-2"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div></div><h3>Three u-1-3 modules</h3><div class="pure-g clear"><div class="pure-u-1-3"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div><div class="pure-u-1-3"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div><div class="pure-u-1-3"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div></div><h3>Two u-1-2 modules with a columns class</h3><div class="pure-g columns clear"><div class="pure-u-1-2"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div><div class="pure-u-1-2"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div></div><h3>Three u-1-3 modules with a columns class</h3><div class="pure-g columns clear"><div class="pure-u-1-3"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div><div class="pure-u-1-3"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div><div class="pure-u-1-3"><table class="table"><thead><th>Header 1</th></thead><tbody><tr><td>Cell 1</td></tr></tbody></table></div></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('responsiveLayout.html',
    '<div class="layout-demo"><!-- Overview --> <a id="Overview"></a><h2>Overview</h2><p>Angular Material\'s responsive CSS layout is built on <a href="http://www.w3.org/TR/css3-flexbox/" target="_blank">flexbox.</a></p><p>The layout system is based upon element attributes rather than CSS classes. Attributes provide an easy way to set a value (eg <code>layout="row"</code>) and help separate concerns: attributes define layout, and classes define styling.</p><!-- Layout Attribute --> <a id="Attribute"></a><h2>Layout Attribute</h2><p>Use the <code>layout</code> attribute on an element to arrange its children horizontally in a row (<code>layout="row"</code>), or vertically in a column (<code>layout="column"</code>).</p><h3>Row Layout</h3><div layout="row"><div class="box dark-blue">I\'m left.</div><div class="box light-blue">I\'m right.</div></div><h3>Column Layout</h3><div layout="column"><div class="box dark-blue">I\'m above.</div><div class="box light-blue">I\'m below.</div></div><p>See <a href="#/components/layout#Options">Options</a> for information on responsive layouts and other options.</p><!-- Grid System--> <a id="Grid"></a><h2>Grid System</h2><p>To customize the size and position of elements in a layout, use the <code>flex</code>, <code>flex-offset</code>, and <code>flex-order</code> attributes.</p><h3>Flex Attribute</h3><div layout="row"><div flex class="flex-box dark-blue">[flex]</div><div flex class="flex-box light-blue">[flex]</div><div flex class="flex-box dark-green">[flex]</div></div><p>Add the <code>flex</code> attribute to a layout\'s child element, and it will flex (stretch) to fill the available area.</p><h3>Flex Percent Values</h3><div layout="row" layout-wrap><div flex="33" class="flex-box dark-blue">[flex="33"]</div><div flex="55" class="flex-box light-blue">[flex="55"]</div><div flex class="flex-box orange">[flex]</div><div flex="66" class="flex-box light-green">[flex="66"]</div><div flex="33" class="flex-box dark-green">[flex="33"]</div></div><p>A layout child\'s <code>flex</code> attribute can be given an integer value from 0-100. The element will stretch to the percentage of available space matching the value.</p><p>The <code>flex</code> attribute value is restricted to 33, 66, and multiples of five. For example: <code>flex="5"</code>, <code>flex="20"</code>, "<code>flex="33"</code>, <code>flex="50"</code>, <code>flex="66"</code>, <code>flex="75"</code>, ....</p><p>See the <a href="#/components/layout#Options">layout options</a> for more information on responsive flex attributes.</p><h3>Static Flex Options</h3><div layout="row"><div flex class="flex-fix flex-box dark-blue">flex: 0 0 200px;</div><div flex="55" class="flex-box light-blue">[flex="55"]</div><div flex class="flex-box orange">[flex]</div></div><p>CSS <code>flexbox</code> implementation provides the ability to define static flex items that will cooperate alongside dynamic flex items.</p><p>A static flex item has the following property definition:</p><pre>\n' +
    '    flex-grow: 0; // do not grow\n' +
    '    flex-shrink: 0; // do not shrink\n' +
    '    flex-basis: N; // set height/width to this value (depending on the value of flex-direction)\n' +
    '\n' +
    '    /* or using the shorthand */\n' +
    '    flex: 0 0 N; // [ grow | shrink | basis ]\n' +
    '    </pre><p><code>flex-basis</code> value may be a valid CSS <a href="http://www.w3.org/TR/css3-values/#lengths">length</a> or keyword.</p><h3>Flex Order Attribute</h3><div layout="row" layout-margin><div flex flex-order="3" class="flex-box dark-blue margin-left">[flex-order="3"]</div><div flex flex-order="2" class="flex-box light-blue margin-right margin-left">[flex-order="2"]</div><div flex flex-order="1" class="flex-box dark-green margin-right">[flex-order="1"]</div></div><p>Add the <code>flex-order</code> attribute to a layout child to set its position within the layout. Any value from 0-9 is accepted.</p><p>Note that the <code>flex-order</code> attribute is not compatible with the <code>layout-margin</code> attribute. This is because the CSS selector engine selects based on DOM markup order and the <code>layout-margin</code> attribute makes use of <code>:first-child</code> and <code>:last-child</code> to apply margins to only the inner elements in the container. As a work-around, <code>[flex-order].left-margin</code> and <code>[flex-order].right-margin</code> classes are availabe to manually add margins. The most likely use cases for these classes is for programmatic ordering of children.</p><table><tr><td>flex-order</td><td>Sets element order.</td></tr><tr><td>flex-order-sm</td><td>Sets element order on devices less than 600px wide.</td></tr><tr><td>flex-order-gt-sm</td><td>Sets element order on devices greater than 600px wide.</td></tr><tr><td>flex-order-md</td><td>Sets element order on devices between 600px and 960px wide.</td></tr><tr><td>flex-order-gt-md</td><td>Sets element order on devices greater than 960px wide.</td></tr><tr><td>flex-order-lg</td><td>Sets element order on devices between 960px and 1200px wide.</td></tr><tr><td>flex-order-gt-lg</td><td>Sets element order on devices greater than 1200px wide.</td></tr></table><h3>Flex Offset Attribute</h3><div layout="row"><div flex flex-offset="33" class="flex-box dark-blue">[flex offset="33"]</div><div flex class="flex-box light-blue">[flex]</div></div><p>Add the <code>offset</code> attribute to a layout child to set its offset percentage within the layout. Values must be multiples of <code>5</code>, or <code>33</code>, <code>34</code>, <code>66</code>, <code>67</code>.</p><table><tr><td>offset</td><td>Sets element offset.</td></tr><tr><td>offset-sm</td><td>Sets element offset on devices less than 600px wide.</td></tr><tr><td>offset-gt-sm</td><td>Sets element offset on devices greater than 600px wide.</td></tr><tr><td>offset-md</td><td>Sets element offset on devices between 600px and 960px wide.</td></tr><tr><td>offset-gt-md</td><td>Sets element offset on devices greater than 960px wide.</td></tr><tr><td>offset-lg</td><td>Sets element offset on devices between 960px and 1200px wide.</td></tr><tr><td>offset-gt-lg</td><td>Sets element offset on devices greater than 1200px wide.</td></tr></table><!-- Child Alignment --> <a id="ChildAlignment"></a><h2>Child Alignment</h2><p>The <code>layout-align</code> attribute takes two parameters in any order. Parameters <code>top</code>, <code>middle</code>, <code>bottom</code>, <code>left</code>, <code>right</code>, and <code>center</code> determine the alignment of child elements and may be combined in sensible ways (ie <code>top left</code> works but <code>top bottom</code> would not).</p><p>Parameters <code>stretch</code>, <code>justify</code>, and <code>spread</code> determine the justification of child elements. <code>Stretch</code> grows child elements perpendicular to layout axis (ie <code>layout="row"</code> stretches up and down). <code>Justify</code> and <code>spread</code> space out child elements evenly perpendicular to layout axis either with or without side padding, respectively</p><p>Only one parameter is required for the attribute. For example, <code>layout="row" layout-align="center"</code> would make the elements center horizontally and use the default behavior vertically.</p><p><code>layout="column" layout-align="right middle"</code> would align children along the center vertically and along the right horizontally.</p><table><tr><td>layout-align</td><td>Sets child alignment.</td></tr><tr><td>layout-align-sm</td><td>Sets child alignment on devices less than 600px wide.</td></tr><tr><td>layout-align-gt-sm</td><td>Sets child alignment on devices greater than 600px wide.</td></tr><tr><td>layout-align-md</td><td>Sets child alignment on devices between 600px and 960px wide.</td></tr><tr><td>layout-align-gt-md</td><td>Sets child alignment on devices greater than 960px wide.</td></tr><tr><td>layout-align-lg</td><td>Sets child alignment on devices between 960px and 1200px wide.</td></tr><tr><td>layout-align-gt-lg</td><td>Sets child alignment on devices greater than 1200px wide.</td></tr></table><div ng-controller="layoutController"><p>See below for more examples: <code>layout="{{layout}}" layout-align="{{align.first}} {{align.second}}"</code></p><div layout="{{layout}}" layout-align="{{align.first}} {{align.second}}" class="small-box-container"><div class="small-box light-blue">one</div><div class="small-box dark-blue">two</div><div class="small-box light-green">three</div></div><div class="layout-examples" layout="row" layout-align="top spread"><div layout="column"><span>Layout Direction</span><label><input type="radio" ng-model="layout" value="row" ng-click="swap(\'row\')"> row</label><label><input type="radio" ng-model="layout" value="column" ng-click="swap(\'column\')"> column</label></div><div layout="column"><span>Alignment in Layout Direction</span><label ng-repeat="option in options1" for="{{align1}}"><input type="radio" name="align1" ng-model="align.first" ng-value="option"> {{option}}</label></div><div layout="column"><span>Alignment in Perpendicular Direction</span><label ng-repeat="option in options2" for="{{align2}}"><input type="radio" name="align2" ng-model="align.second" ng-value="option"> {{option}}</label></div></div></div><!-- Options --> <a id="Options"></a><h2>Options</h2><h3>Responsive Layout</h3><div layout="row" layout-sm="column"><div flex class="grow-box dark-blue">I\'m above on mobile, and to the left on larger devices.</div><div flex class="grow-box light-blue">I\'m below on mobile, and to the right on larger devices.</div></div><p>See the <a href="#/components/layout#Attribute">Attribute</a> section for a basic explanation of layout attributes.</p><p>To make your layout change depending upon the device size, there are other <code>layout</code> attributes available:</p><table><tr><td>layout</td><td>Sets the default layout on all devices.</td></tr><tr><td>layout-sm</td><td>Sets the layout on devices less than 600px wide (phones).</td></tr><tr><td>layout-gt-sm</td><td>Sets the layout on devices greater than 600px wide (bigger than phones).</td></tr><tr><td>layout-md</td><td>Sets the layout on devices between 600px and 960px wide (tablets in portrait).</td></tr><tr><td>layout-gt-md</td><td>Sets the layout on devices greater than 960px wide (bigger than tablets in portrait).</td></tr><tr><td>layout-lg</td><td>Sets the layout on devices between 960 and 1200px wide (tablets in landscape).</td></tr><tr><td>layout-gt-lg</td><td>Sets the layout on devices greater than 1200px wide (computers and large screens).</td></tr></table><h3>Layout Margin, Padding, and Fill</h3><div layout="row" layout-margin layout-fill layout-padding><div flex class="grow-box dark-blue">I\'m on the left, and there\'s an empty area around me.</div><div flex class="grow-box light-blue">I\'m on the right, and there\'s an empty area around me.</div></div><p><code>layout-margin</code> adds margin around each <code>flex</code> child. It also adds a margin to the layout container itself.</p><p><code>layout-padding</code> adds padding inside each <code>flex</code> child. It also adds padding to the layout container itself.</p><p><code>layout-fill</code> forces the layout element to fill its parent container.</p><h3>Wrap</h3><div layout="row" layout-wrap><div flex="33" class="grow-box dark-blue">[flex=33]</div><div flex="66" class="grow-box light-blue">[flex=66]</div><div flex="66" class="grow-box light-green">[flex=66]</div><div flex="33" class="grow-box dark-green">[flex=33]</div></div><p><code>layout-wrap</code> allows <code>flex</code> children to wrap within the container if the elements use more than 100%. By default, flex elements do not wrap.</p><h3>Responsive Flex &amp; Offset Attributes</h3><div layout="row"><div flex="66" flex-sm="33" class="grow-box dark-blue">I flex to one-third of the space on mobile, and two-thirds on other devices.</div><div flex="33" flex-sm="66" class="grow-box light-blue">I flex to two-thirds of the space on mobile, and one-third on other devices.</div></div><p>See the <a href="#/components/layout#Grid">Grid</a> section for a basic explanation of flex and offset attributes.</p><table><tr><td>flex</td><td>Sets flex.</td></tr><tr><td>flex-sm</td><td>Sets flex on devices less than 600px wide.</td></tr><tr><td>flex-gt-sm</td><td>Sets flex on devices greater than 600px wide.</td></tr><tr><td>flex-md</td><td>Sets flex on devices between 600px and 960px wide..</td></tr><tr><td>flex-gt-md</td><td>Sets flex on devices greater than 960px wide.</td></tr><tr><td>flex-lg</td><td>Sets flex on devices between 960px and 1200px.</td></tr><tr><td>flex-gt-lg</td><td>Sets flex on devices greater than 1200px wide.</td></tr></table><h3>Hide and Show Attributes</h3><div layout layout-align="center center" class="small-box-container"><div hide-sm class="grow-box dark-blue">I\'m hidden on mobile and shown on larger devices.</div><div hide-gt-sm class="grow-box dark-green">I\'m shown on mobile and hidden on larger devices.</div></div><table><tr><td>hide</td><td><code>display: none</code></td></tr><tr><td>hide-sm</td><td><code>display: none</code> on devices less than 600px wide.</td></tr><tr><td>hide-gt-sm</td><td><code>display: none</code> on devices greater than 600px wide.</td></tr><tr><td>hide-md</td><td><code>display: none</code> on devices between 600px and 960px wide.</td></tr><tr><td>hide-gt-md</td><td><code>display: none</code> on devices greater than 960px wide.</td></tr><tr><td>hide-lg</td><td><code>display: none</code> on devices between 960px and 1200px.</td></tr><tr><td>hide-gt-lg</td><td><code>display: none</code> on devices greater than 1200px wide.</td></tr><tr><td>show</td><td>Negates hide.</td></tr><tr><td>show-sm</td><td>Negates hide on devices less than 600px wide.</td></tr><tr><td>show-gt-sm</td><td>Negates hide on devices greater than 600px wide.</td></tr><tr><td>show-md</td><td>Negates hide on devices between 600px and 960px wide..</td></tr><tr><td>show-gt-md</td><td>Negates hide on devices greater than 960px wide.</td></tr><tr><td>show-lg</td><td>Negates hide on devices between 960px and 1200px.</td></tr><tr><td>show-gt-lg</td><td>Negates hide on devices greater than 1200px wide.</td></tr></table></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxApp.html',
    '<div ng-controller="rxAppCtrl"><h3>Standard rxApp</h3><rx-app id="standard-rxApp"><rx-page title="\'Standard Page Title\'"><p class="clear">This is my page content</p><button ng-click="changeRoutes()" class="button">Change Routes</button></rx-page></rx-app><h3>Customized rxApp (collapsible)</h3><rx-app collapsible-nav="true" site-title="My App" id="custom-rxApp" menu="customMenu" new-instance="true" hide-feedback="true"><rx-page unsafe-html-title="\'Customized Page <a href=&quot;http://rackspace.com&quot;>Title</a>\'" subtitle="subtitle" status="alpha" account-number="12345"><p class="clear">Click a link in the menu to see the active state change</p><p>Click the toggle to hide the menu</p><button ng-click="changeSubtitle()" class="changeSubtitle button">Change Subtitle</button></rx-page></rx-app><h3>Embedded rxApp</h3><p>rxApp is smart enough to detect if it is loaded in an iframe and will hide the left nav.</p><iframe id="embedded-app" ng-src="{{embedUrl}}"></iframe></div><!--\n' +
    'You\'ll likely want to implement your HTML in your index.html file as:\n' +
    '<div ng-app="sampleApp">\n' +
    '    <rx-app ng-view></rx-app>\n' +
    '</div>\n' +
    '\n' +
    'And the template for each view/page will be something like:\n' +
    '<rx-page title="\'Example Page\'">\n' +
    '    Example content\n' +
    '</rx-page>\n' +
    '-->');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxCollapse.html',
    '<rx-collapse class="demo-with-title" title="A Custom Title" expanded="true">You can put whatever content you want to inside here</rx-collapse><h3>\'See more/See less\' for use with metadata</h3><rx-metadata><section><rx-meta label="Name">Lorem ipsum dolor sit amet</rx-meta><rx-meta label="ID">1aa2bfa9-de8d-42f7-9f6de6437855b36e</rx-meta><rx-meta label="Region">ORD</rx-meta><rx-meta label="Created">December 2, 2014 @ 14:28</rx-meta><rx-collapse class="demo-no-title" expanded="false"><rx-meta label="Name">Lorem ipsum dolor sit amet</rx-meta><rx-meta label="ID">1aa2bfa9-de8d-42f7-9f6de6437855b36e</rx-meta><rx-meta label="Region">ORD</rx-meta><rx-meta label="Created">December 2, 2014 @ 14:28</rx-meta></rx-collapse></section></rx-metadata>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxForm.html',
    '<div ng-controller="rxFormDemoCtrl"><form rx-form name="demoForm" style="max-width: 1100px"><h2>Simple Controls</h2><h3>Text Inputs</h3><rx-help-text>Three <code>rx-field</code> elements each consume between 250px and 1/3 of the width.</rx-help-text><rx-form-section><rx-field><rx-field-name id="fieldNamePlainTextbox">Plain Textbox:</rx-field-name><rx-field-content><rx-input><input type="text" id="txtPlain"></rx-input></rx-field-content></rx-field><rx-field><rx-field-name>IP Address:</rx-field-name><rx-field-content><rx-input><input name="ipaddress" type="text" disabled="disabled" placeholder="127.0.0.1"></rx-input></rx-field-content></rx-field><rx-field><rx-field-name>Monthly Cost:</rx-field-name><rx-field-content><rx-input><rx-prefix>$</rx-prefix><input type="number"><rx-suffix>million</rx-suffix></rx-input></rx-field-content></rx-field></rx-form-section><h2>Text Area</h2><rx-help-text>One <code>rx-field</code> element consumes the full width.</rx-help-text><rx-form-section><rx-field><rx-field-name>Life Story:</rx-field-name><rx-field-content><rx-input><textarea name="lifeStory" rows="10"></textarea></rx-input><rx-help-text>The <code>cols</code> attribute is moot, CSS will handle the width.</rx-help-text></rx-field-content></rx-field></rx-form-section><h2>Intermediate Controls</h2><h3>Text Inputs With Validation</h3><rx-help-text>Two <code>rx-field</code> elements each consume between 250px and 1/2 of the width.</rx-help-text><rx-form-section><rx-field><rx-field-name ng-required="simple.isNameRequired" id="fieldNameVolumeName">Volume Name:</rx-field-name><rx-field-content><rx-input><input type="text" id="txtVolumeName" name="txtVolumeName" ng-model="simple.volumeName" ng-required="simple.isNameRequired" ng-pattern="/^\\b(\\w)?(\\w)\\w?\\2\\1$/"></rx-input><rx-help-text>Must be 2-5 letter palindrome (e.g. \'dewed\')</rx-help-text><rx-help-text>Bound Value: {{simple.volumeName}}</rx-help-text><rx-input><input rx-checkbox id="chkVolumeNameRequired" ng-model="simple.isNameRequired"><label for="chkVolumeNameRequired">Check and uncheck with empty volume name to see border</label></rx-input></rx-field-content></rx-field><rx-field><rx-field-name>Email Address:</rx-field-name><rx-field-content><rx-input><input name="userEmail" type="email" ng-model="simple.userEmail" foocheck></rx-input><rx-help-text>Must contain foo.</rx-help-text><rx-inline-error ng-show="demoForm.userEmail.$error.email">Invalid Email</rx-inline-error><rx-inline-error ng-show="demoForm.userEmail.$error.foocheck">Your email must contain \'foo\'</rx-inline-error></rx-field-content></rx-field></rx-form-section><h3>Drop-Down Selection</h3><rx-form-section><!-- rxSelect --><rx-field><h4>Single Selection</h4><rx-field-name>Volume Type:</rx-field-name><rx-field-content><rx-input><select rx-select ng-model="intermediate.volumeType" id="selVolumeType"><option ng-repeat="type in volumeTypes" value="{{type.value}}" ng-selected="{{type.value == model}}">{{type.label}}</option></select></rx-input><rx-help-text>Bound Value: {{intermediate.volumeType}}</rx-help-text></rx-field-content></rx-field><!-- rxMultiSelect --><rx-field><h4>Multiple Selection</h4><rx-field-name>Service Options:</rx-field-name><rx-field-content><rx-input><rx-multi-select ng-model="intermediate.services" id="mselServices"><rx-select-option ng-repeat="service in services" value="{{service.value}}">{{service.label}}</rx-select-option></rx-multi-select></rx-input><rx-help-text>Bound Value: {{intermediate.services}}</rx-help-text></rx-field-content></rx-field></rx-form-section><h3>Input Groups</h3><rx-form-section><!-- rxRadio --><rx-field><h4>Radio Group</h4><rx-field-name>Favorite Beatles Member:</rx-field-name><rx-field-content><rx-input ng-repeat="beatle in beatles"><input rx-radio name="favBeatle" id="favBeatle_{{$index}}" value="{{beatle}}" ng-model="intermediate.favoriteBeatle"><label for="favBeatle_{{$index}}">{{beatle}}</label></rx-input><rx-input><input rx-radio name="favBeatle" id="favBeatle_all" value="all" ng-model="intermediate.favoriteBeatle"><label for="favBeatle_all">All of the above</label></rx-input><rx-input><input rx-radio name="favBeatle" id="favBeatle_none" value="none" disabled="disabled" ng-model="intermediate.favoriteBeatle"><label for="favBeatle_none">None of the above</label></rx-input></rx-field-content></rx-field><!-- rxCheckbox --><rx-field><h4>Checkbox Group</h4><rx-field-name>Rick Astley Will Never:</rx-field-name><rx-field-content><rx-input ng-repeat="never in nevers"><input rx-checkbox id="chkNever_{{$index}}" checked="checked" value="{{never}}"><label for="chkNever_{{$index}}">{{never}}</label></rx-input><rx-input><input rx-checkbox id="chkNever_all" value="all" checked="checked" disabled="disabled"><label for="chkNever_all">All of the above</label></rx-input></rx-field-content></rx-field><!-- rxToggleSwitch --><rx-field><h4>Toggle Switches</h4><rx-field-name>Settings:</rx-field-name><rx-field-content><rx-input><rx-prefix><rx-toggle-switch id="setting1" ng-model="intermediate.settings.first"></rx-toggle-switch><label for="setting1">Setting 1</label></rx-prefix></rx-input><rx-input><rx-prefix><rx-toggle-switch id="setting2" ng-model="intermediate.settings.second"></rx-toggle-switch><label for="setting2">Setting 2</label></rx-prefix></rx-input><rx-input><rx-prefix><rx-toggle-switch id="setting3" ng-model="intermediate.settings.third" disabled="true"></rx-toggle-switch><label for="setting3">Setting 3</label></rx-prefix></rx-input><rx-input><rx-prefix><rx-toggle-switch id="setting4" ng-model="settings.fourth" disabled="true"></rx-toggle-switch><label for="setting4">Setting 4</label></rx-prefix></rx-input></rx-field-content></rx-field></rx-form-section><h3>rxOptionTable</h3><rx-form-section><rx-field><rx-field-name>Radio Option Table</rx-field-name><rx-field-content><rx-input><rx-option-table id="radioOptionTable" data="optionTableData" columns="optionTableColumns" type="radio" model="intermediate.table.radio" field-id="optionTable" selected="0" class="full-width" disable-fn="disableOption(tableId, fieldId, rowId)"></rx-option-table></rx-input><rx-help-text>Bound Value: {{intermediate.table.radio}}</rx-help-text></rx-field-content></rx-field></rx-form-section><rx-form-section><rx-field><rx-field-name>Checkbox Option Table</rx-field-name><rx-field-content><rx-input><rx-option-table columns="optionTableColumns" type="checkbox" id="checkboxOptionTable" model="intermediate.table.checkbox" field-id="optionCheckboxTable" data="optionTableCheckboxData" required="true"></rx-option-table></rx-input><rx-help-text ng-repeat="val in intermediate.table.checkbox">Item {{$index + 1}} Value: {{val}}</rx-help-text></rx-field-content></rx-field></rx-form-section><rx-form-section><rx-field><rx-field-name>Empty Option Table</rx-field-name><rx-field-content><rx-input><rx-option-table columns="optionTableColumns" type="checkbox" id="emptyOptionTable" model="intermediate.table.empty" field-id="optionCheckboxTable" data="optionTableEmptyData" empty-message="You don\'t have any data!"></rx-option-table></rx-input></rx-field-content></rx-field></rx-form-section><h2>Advanced Controls</h2><h3>With <code>stacked</code> section attribute</h3><rx-help-text>To obtain a stacked layout, place the <code>stacked</code> attribute on <code>rx-form-section</code>.</rx-help-text><rx-form-section stacked><!-- Radio Option + Select --><rx-field><rx-field-name>Radio + Select</rx-field-name><rx-field-content><rx-input><rx-prefix><input rx-radio id="radDefault" name="radAdvanced" ng-model="advanced.radChoice" value="default"><label for="radDefault">Default</label></rx-prefix></rx-input><rx-input><rx-prefix><input rx-radio id="radCustom" name="radAdvanced" ng-model="advanced.radChoice" value="custom"><label for="radCustom">Custom:</label><br></rx-prefix><select rx-select ng-disabled="advanced.radChoice !== \'custom\'"><option>Option 1</option><option>Option 2</option><option>Option 3</option></select></rx-input><rx-help-text>Useful for condensing large radio groups.</rx-help-text></rx-field-content></rx-field><!-- Checkbox + Text --><rx-field><rx-field-name>Checkbox + Text Input</rx-field-name><rx-field-content><rx-input><rx-prefix><input rx-checkbox ng-model="advanced.inputEnabled"><label>Label:</label></rx-prefix><input type="text" ng-disabled="!advanced.inputEnabled" placeholder="Enter Text"></rx-input><rx-help-text>Useful for if you want the user to add an optional value, but displaying the field as disabled by default.</rx-help-text></rx-field-content></rx-field></rx-form-section><h3>With <code>controlled-width</code> section attribute</h3><rx-help-text>To prevent fields from taking up too much horizontal space, use the <code>controlled-width</code> attribute on <code>rx-form-section</code>. The fields will still stack if horizontal space is constrained, but they will not exceed a reasonable field width.</rx-help-text><rx-form-section controlled-width><!-- Dropdown + Text + Dropdown --><rx-field><rx-field-name>Name:</rx-field-name><rx-field-content><rx-input><rx-prefix><select rx-select><option></option><option>Mr.</option><option>Mrs.</option><option>Ms.</option></select></rx-prefix><input type="text"><rx-suffix><select rx-select><option></option><option>Jr.</option><option>Sr.</option></select></rx-suffix></rx-input><rx-help-text>Dropdown + Text Input + Dropdown</rx-help-text></rx-field-content></rx-field><rx-field><rx-field-name>Search Box:</rx-field-name><rx-field-content><rx-input><rx-search-box ng-model="demoSearch" rx-placeholder="\'Filter by...\'"></rx-search-box></rx-input><rx-help-text>Using <code>rx-search-box</code>.</rx-help-text></rx-field-content></rx-field></rx-form-section><h2>Advanced Text Area</h2><h3 class="subdued">With additional info side-by-side.</h3><rx-form-section><rx-field><rx-field-name id="fieldNameRequiredTextarea" ng-required="true">Required Textarea:</rx-field-name><rx-field-content><rx-input><textarea name="lifeStory" rows="10" ng-required="true" ng-model="lifeStory" rx-character-count></textarea></rx-input></rx-field-content></rx-field><div><rx-help-text><p>Oh look! It\'s using <code>rx-character-count</code></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus id ligula sit amet rhoncus. Quisque semper mi vel tortor sodales, eget dapibus turpis consectetur. Ut tristique nibh porttitor diam porta finibus. Vivamus porttitor ligula sed ipsum rhoncus, id lobortis ex volutpat. Ut ut metus erat. Nam et convallis enim. Proin efficitur quam tortor, vitae hendrerit libero auctor ac. Sed vitae lobortis quam, quis commodo metus. Vestibulum felis arcu, consectetur ut vulputate nec, commodo ut odio.</p></rx-help-text><span ng-if="demoForm.lifeStory.$dirty"><rx-inline-error ng-show="demoForm.lifeStory.$error.required">Cannot Be Blank</rx-inline-error></span></div></rx-form-section><!-- form actions, no special class required --><h2>Form Actions</h2><rx-help-text>No CSS class required</rx-help-text><rx-form-section><div><button class="button submit" type="submit">Submit Form</button> <button class="button cancel" type="submit">Cancel</button></div></rx-form-section></form></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxPopover.html',
    '<div><rx-popover><div class="rs-popover-body"><form class="rs-form-horizontal rs-form-small"><div class="rs-control-group"><label class="rs-control-label">Label One</label><div class="rs-controls"><input type="text" class="rs-input-medium"></div></div><div class="rs-control-group"><label class="rs-control-label">Label Two</label><div class="rs-controls"><input type="text" class="rs-input-medium"> GB</div></div><div class="rs-control-group"><label class="rs-control-label">Label Three</label><div class="rs-controls"><input type="text" class="rs-input-medium"><select><option>One</option><option>Two</option></select></div></div></form></div><div class="rs-popover-footer rs-btn-group"><div class="rs-btn rs-btn-primary">Save</div><div class="rs-btn rs-btn-link">Cancel</div></div></rx-popover></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxRadio.html',
    '<!-- Sample HTML goes here as a live example of how the component can be used --><div ng-controller="rxRadioCtrl"><h3>Examples</h3><h3>Show/Hide Input</h3><p><strong>Do you like bacon?</strong> <small ng-show="likesbacon">({{likesbacon}})</small></p><p><input rx-radio id="radHateBacon" value="hate it" ng-model="likesbacon" ng-required="true"><label for="radHateBacon">I hate bacon</label></p><p><input rx-radio id="radLikeBacon" value="like it" ng-model="likesbacon" ng-required="true"><label for="radLikeBacon">I like bacon</label></p><p ng-show="likesbacon && likesbacon !== \'hate it\'"><input rx-radio id="radLoveBacon" value="love it" ng-model="likesbacon" ng-required="true"><label for="radLoveBacon">Actually, I LOVE bacon</label></p><br><h3>Destroy Input</h3><p>Support for <code>$destroy</code> events.</p><p><span><input rx-radio id="radDestroyed" value="destroyed" ng-model="radCreateDestroy"><label for="radDestroy">Destroyed</label></span>&nbsp; <span><input rx-radio id="radCreated" value="created" ng-model="radCreateDestroy"><label for="radCreate">Created</label></span></p><p>The following radio is <code>{{radCreateDestroy}}</code>: <input rx-radio checked="checked" id="radTargetCreated" ng-if="radCreateDestroy === \'created\'"></p><!-- END DEMO CODE --><!-- END DEMO CODE --><!-- END DEMO CODE --><h3>Radio States</h3><table><thead><tr><th></th><th>Enabled</th><th>Disabled (ng-disable)</th><th>Disabled (disabled)</th></tr></thead><tbody><tr><th>Valid</th><!-- Valid Enabled --><td><p><input rx-radio id="radValidEnabledOne" value="1" ng-model="validEnabled"><label for="radValidEnabledOne">Selected</label></p><p><input rx-radio id="radValidEnabledTwo" value="2" ng-model="validEnabled"><label for="radValidEnabledTwo">Unselected</label></p></td><!-- Valid NG-Disabled --><td><p><input rx-radio id="radValidNgDisabledOne" value="1" ng-disabled="true" ng-model="validNgDisabled"><label for="radValidNgDisabledOne">Selected</label></p><p><input rx-radio id="radValidNgDisabledTwo" value="2" ng-disabled="true" ng-model="validNgDisabled"><label for="radValidNgDisabledTwo">Unselected</label></p></td><!-- Valid Disabled --><td><p><input rx-radio id="radValidDisabledOne" value="1" disabled="disabled" ng-model="validDisabled"><label for="radValidDisabledOne">Selected</label></p><p><input rx-radio id="radValidDisabledTwo" value="2" disabled="disabled" ng-model="validDisabled"><label for="radValidDisabledTwo">Unselected</label></p></td></tr><tr><th>Invalid</th><!-- Invalid Enabled --><td><p><input rx-radio id="radInvalidEnabledOne" value="1" ng-model="invalidEnabled" always-invalid><label for="radInvalidEnabledOne">Selected</label></p><p><input rx-radio id="radInvalidEnabledTwo" value="2" ng-model="invalidEnabled" always-invalid><label for="radInvalidEnabledTwo">Unselected</label></p></td><!-- Invalid NG-Disabled --><td><p><input rx-radio id="radInvalidNgDisabledOne" value="1" ng-disabled="true" ng-model="invalidNgDisabled" always-invalid><label for="radInvalidNgDisabledOne">Selected</label></p><p><input rx-radio id="radInvalidNgDisabledTwo" value="2" ng-disabled="true" ng-model="invalidNgDisabled" always-invalid><label for="radInvalidNgDisabledTwo">Unselected</label></p></td><!-- Invalid Disabled --><td><p><input rx-radio id="radInvalidDisabledOne" value="1" disabled="disabled" ng-model="invalidDisabled" always-invalid><label for="radInvalidDisabledOne">Selected</label></p><p><input rx-radio id="radInvalidDisabledTwo" value="2" disabled="disabled" ng-model="invalidDisabled" always-invalid><label for="radInvalidDisabledTwo">Unselected</label></p></td></tr></tbody></table><h3>Plain HTML Radios (for comparison)</h3><p><input type="radio" id="plainHtmlNormal" ng-model="plainHtmlRadio" value="plain" ng-required="true"><label for="plainHtmlNormal">A plain radio</label></p><p><input type="radio" id="plainHtmlDisabled" value="disabled" ng-model="plainHtmlRadio" disabled="disabled"><label for="plainHtmlDisabled">A plain radio (disabled)</label></p><p><input type="radio" id="plainHtmlChecked" value="isChecked" ng-model="plainHtmlRadio"><label for="plainHtmlChecked">A plain radio (checked)</label></p><p><input type="radio" id="plainRadRemoveRadio" value="shows" ng-model="plainHtmlRadio"><label for="plainRadRemoveRadio">Add Following Radio:</label><input type="radio" id="plainRadRemoveable" value="hidden" ng-if="plainHtmlRadio === \'shows\'"></p></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxSortableColumn.html',
    '<div ng-controller="rxSortableColumnCtrl"><p>Note: The demo table is also using <code>rx-floating-header</code>, which is not required. We\'ve only done this to illustrate that <code>rxSortableColumn</code> works properly with <code>rxFloatingHeader</code>. The table is also using <code>rxSortEmptyTop</code>.</p><table rx-floating-header><thead><tr><th scope="col"><rx-sortable-column sort-method="sortCol(property)" sort-property="name" predicate="sort.predicate" reverse="sort.reverse">Name</rx-sortable-column></th><th scope="col"><rx-sortable-column sort-method="sortCol(property)" sort-property="jobTitle" predicate="sort.predicate" reverse="sort.reverse">Occupation</rx-sortable-column></th><th scope="col"><rx-sortable-column sort-method="sortCol" sort-property="none" predicate="sort.predicate" reverse="sort.reverse">Testing Sort Errors (see Protractor Tab)</rx-sortable-column></th></tr></thead><tbody id="talentPoolData"><tr ng-repeat="resource in talentPool | rxSortEmptyTop:sort.predicate:sort.reverse"><th scope="row" class="talent-name">{{resource.name}}</th><td class="talent-job">{{resource.jobTitle}}</td></tr></tbody></table></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxStatusColumn.html',
    '<div><table class="table-striped demo-status-column-table"><thead><tr><th rx-status-header></th><th class="column-title">Title</th></tr></thead><tbody><tr ng-repeat="server in servers | orderBy: sort.predicate:sort.reverse "><!-- Both `api` and `tooltip-content` are optional --><td rx-status-column status="{{ server.status }}"></td><td>{{ server.title }}</td></tr></tbody></table></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxActionMenu.html',
    '<div><p>The cog in the first row is dismissable by clicking anywhere, but the second cog can only be dismissed by clicking on the cog itself.</p><h3 id="typical-usage">Typical Usage</h3><table class="table-striped"><thead><tr><th>Name</th><th class="actions"></th></tr></thead><tbody><tr><td>Globally dismissible</td><td><rx-action-menu id="globalDismissal"><ul class="actions-area"><li><span class="action-menu-category">Manage:</span></li><li><a href="#">Add</a></li><li><a href="#">Delete</a></li></ul></rx-action-menu></td></tr><tr><td>Only dismissible by clicking on cog</td><td><rx-action-menu global-dismiss="false"><ul class="actions-area"><li><span class="action-menu-category">Manage:</span></li><li><a href="#">Add</a></li><li><a href="#">Delete</a></li></ul></rx-action-menu></td></tr><tr><td>Unorthodox Behaviors (no modals, hidden item)</td><td><rx-action-menu id="custom"><ul class="actions-area"><li><span class="action-menu-category">Manage:</span></li><li><a href="#">Add</a></li><li><a href="#">Delete</a></li></ul></rx-action-menu></td></tr></tbody></table></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('ActionMenu.docs.html',
    '<p>A component to create a configurable action menu.</p><h3 id="typical-usage">Typical Usage</h3><p>The cog in the first row is dismissable by clicking anywhere, but the second cog can only be dismissed by clicking on the cog itself.</p><rx-example name="ActionMenu.simple"></rx-example>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('ActionMenu.simple.html',
    '<table class="table-striped" ng-controller="rxActionMenuCtrl"><thead><tr><th>Name</th><th class="actions"></th></tr></thead><tbody><tr><td>Globally dismissible</td><td><rx-action-menu id="globalDismissal"><ul class="actions-area"><li><rx-modal-action template-url="addActionTemplate.html" classes="msg-action"><i class="fa fa-plus fa-lg"></i> Add</rx-modal-action></li><li><rx-modal-action template-url="deleteActionTemplate.html" classes="msg-warn"><i class="fa fa-times fa-lg"></i> Delete</rx-modal-action></li></ul></rx-action-menu></td></tr><tr><td>Only dismissible by clicking on cog</td><td><rx-action-menu global-dismiss="false"><ul class="actions-area"><li><rx-modal-action template-url="addActionTemplate.html" classes="msg-action"><i class="fa fa-plus fa-lg"></i> Add</rx-modal-action></li><li><rx-modal-action template-url="deleteActionTemplate.html" classes="msg-warn"><i class="fa fa-times fa-lg"></i> Delete</rx-modal-action></li></ul></rx-action-menu></td></tr><td>Unorthodox Behaviors (no modals, hidden item)</td><td><rx-action-menu id="custom"><ul class="actions-area"><li><button class="btn-link trigger" ng-click="add()"><span class="msg-action"><i class="fa fa-plus fa-lg"></i> Add</span></button></li><li><button class="btn-link trigger" ng-click="remove()"><span class="msg-warn"><i class="fa fa-times fa-lg"></i> Delete</span></button></li><li ng-show="false"><button class="btn-link trigger"><span class="msg-warn"><i class="fa fa-times fa-lg"></i> Visually Hidden</span></button></li></ul></rx-action-menu></td></tbody></table><script type="text/ng-template" id="deleteActionTemplate.html"><rx-modal-form title="Delete Action" submit-text="Delete">\n' +
    '        <span>Do you want to delete something?</span>\n' +
    '    </rx-modal-form></script><script type="text/ng-template" id="addActionTemplate.html"><rx-modal-form title="Add Action" submit-text="Add">\n' +
    '        <span>Do you want to add something?</span>\n' +
    '    </rx-modal-form></script>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('Buttons.docs.html',
    '<h1>Primary Buttons</h1><div id="primary-large"><button class="button lg">Default Large</button> <button class="button lg" disabled="disabled">Disabled Large</button></div><div><button class="button">Default Medium</button> <button class="button" disabled="disabled">Disabled Medium</button></div><div><button class="button sm">Default Small</button> <button class="button sm" disabled="disabled">Disabled Small</button></div><h1 style="padding-top:40px">Secondary Buttons</h1><div id="secondary-large"><button class="button lg secondary">Default Large</button> <button class="button lg" disabled="disabled">Disabled Large</button></div><div><button class="button secondary">Default Medium</button> <button class="button" disabled="disabled">Disabled Medium</button></div><div><button class="button sm secondary">Default Small</button> <button class="button sm" disabled="disabled">Disabled Small</button></div><h1 style="padding-top:40px">Button Groups</h1><h3>Simple Buttons</h3><div class="button-group"><button class="button">One</button> <button class="button">Two</button> <button class="button">Three</button></div><h3>Radio Buttons</h3><div class="button-group"><input id="status-off" type="radio" ng-model="status" value="off"><label for="status-off">Off</label><input id="status-manual" type="radio" ng-model="status" value="manual"><label for="status-manual">Manual</label><input id="status-auto" type="radio" ng-model="status" value="status"><label for="status-auto">Auto</label></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.animated.html',
    '<div ng-controller="buttonAnimatedExampleCtrl"><rx-button default-msg="Click here to see ellipses" toggle="status.loading" toggle-msg="Loading Ellipses" ng-click="clickMe()" disable="status.disable"></rx-button></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.colors.cancel.html',
    '<button class="button cancel">Cancel Button</button>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.colors.disabled.html',
    '<button class="button" disabled="disabled">Disabled Button</button>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.colors.finish.html',
    '<button class="button finish">Finish &amp; Close Button</button>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.colors.negative.html',
    '<button class="button negative">Negative Button</button>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.colors.progression.html',
    '<button class="button">Progression Button</button>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.colors.submit.html',
    '<button class="button submit">Submit Button</button>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.group.html',
    '<div ng-controller="buttonGroupExampleCtrl"><div class="button-group demo-button-width"><input id="status-off" type="radio" ng-model="status" value="off"><label for="status-off">Off</label><input id="status-manual" type="radio" ng-model="status" value="manual"><label for="status-manual">Manual</label><input id="status-auto" type="radio" ng-model="status" value="status"><label for="status-auto">Auto</label></div></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('button.sizing.html',
    '<button class="button xl">Extra-large Button</button> <button class="button lg">Large Button</button> <button class="button">Default Button</button> <button class="button sm">Small Button</button>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxButton.disable.html',
    '<div ng-controller="rxButtonDisableCtrl"><!-- Plain Button --> <button class="button" rx-toggle="status.disable">Toggle enabled/disabled of \'Login\'</button><!-- rxButton --><rx-button classes="positive" toggle-msg="Authenticating" default-msg="Login" toggle="status.loading" disable="status.disable" ng-click="login()"></rx-button></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxButton.simple.html',
    '<div ng-controller="rxButtonSimpleCtrl"><rx-button id="demo-ui-rx-button" toggle-msg="Authenticating" default-msg="Login" toggle="isLoading" ng-click="login()"></rx-button></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('forms.docs.html',
    '<h2 class="clear"><rx-permalink>Directives</rx-permalink></h2><ul class="list"><li>Many of the rxForm directives are designed for layout and positioning. However, there are some that are for stylistic purposes.</li><li>See <a href="ngdocs/index.html#/api/rxForm">rxForm API Documentation</a> for a more comprehensive list of available directives.</li></ul><h3><rx-permalink>Labels and Inputs</rx-permalink></h3><ul class="list"><li>You should remember that the rxFieldName isn\'t an HTML label element.<ul><li>rxFieldName is a descriptive design element for a particular form field.</li><li>An HTML label is used for accessibility.</li></ul></li><li>You should use the <code>&lt;label for="formControlId"&gt;</code> format when defining your HTML labels.<ul><li>The <code>for</code> attribute connects the label to an appropriate form control. When the label is clicked, wherever it is placed in the DOM, it will focus or activate its corresponding form control.</li><li><strong class="msg-warn">DO NOT wrap the control within a label element.</strong><ul><li>CSS does not have proper selectors to style label text based on control state</li></ul></li><li>You should place an HTML label around text in an appropriate rxFieldName element.</li><li>Inline HTML label elements should only be used with radios, checkboxes, and toggle switches.<ul><li>Place the label <strong>immediately after the form control</strong>.<ul><li>This enables you to style the label based on the state of the control.</li><li>See <a href="#/elements/Forms#checkboxes">checkboxes</a>, <a href="#/components/rxRadio">rxRadio</a>, and <a href="#/components/rxForm">rxForm</a> for markup examples.</li></ul></li></ul></li></ul></li><li>In contrast to its predecessor (rxFormItem), rxField and children provides you the flexibility to create form field inputs that make use of one or more controls.<ul><li>See "Advanced Controls" in <a href="#/components/rxForm">rxForm</a> demo for examples.</li></ul></li></ul><h3><rx-permalink>Error Messages</rx-permalink></h3><ul class="list"><li>Inline Error messages should make use of the <a href="ngdocs/index.html#/api/rxForm.directive:rxInlineError">rxInlineError </a>directive.</li><li>This directive is styled with bold and red text. It is not constrained by DOM hierarchy, so you may place it wherever it is necessary.</li></ul><h3><rx-permalink>Help Text</rx-permalink></h3><ul class="list"><li>Help text should make use of the <a href="ngdocs/index.html#/api/rxForm.directive:rxHelpText">rxHelpText </a>directive.</li><li>This directive is styled in a slightly smaller, italicized font and is not constrained by DOM hierarchy, so you can place it wherever it is necessary.</li></ul><h3><rx-permalink>Buttons</rx-permalink></h3><ul class="list"><li>Reference the <a href="#/elements/Links">links</a> and <a href="#/elements/Buttons">buttons</a> elements and the <a href="#/layout/page/form">Form Page</a> layout for details about how to style and color buttons.<ul><li>Submit buttons should use the green <code>.submit</code> class unless you are performing a destructive action, in which case, you should use the <code>.negative</code> class.</li></ul></li><li>If you need to use a button in your form field for auxiliary purposes, use the default blue.</li></ul><h3><rx-permalink>Selects</rx-permalink></h3><ul class="list"><li>For single item selection, use the <a href="#/components/rxSelect">rxSelect</a> component.</li><li>For multi-item selection, use the rxMultiSelect element defined in the <a href="#/components/rxMultiSelect">rxMultiSelect</a> component.</li></ul><!-- BEGIN: checkboxes --><h3><rx-permalink>Checkboxes</rx-permalink><a class="button xs inline" href="ngdocs/index.html#/api/elements.directive:rxCheckbox/">View API</a><!-- (NOTE) stability: \'READY\' --></h3><ul class="list"><li>Use the rxCheckbox directive for checkbox controls.</li><li>If you intend to use a label element, place it <strong>immediately after the rxCheckbox</strong> to style the label when the control is disabled.</li><li><strong class="msg-warn">DO NOT wrap rxCheckbox in a label element.</strong></li></ul><h4>Show/Hide Input</h4><rx-example name="rxCheckbox.showHide"></rx-example><h4>Destroy Input</h4><p>Support for <code>$destroy</code> events.</p><rx-example name="rxCheckbox.destroy"></rx-example><h4>Checkbox States<table ng-controller="rxCheckboxCtrl"><thead><tr><th></th><th>Enabled</th><th>Disabled (ng-disabled)</th><th>Disabled (disabled)</th></tr></thead><tbody><tr><th>Valid</th><!-- Valid Enabled--><td><p><input rx-checkbox id="chkValidEnabledOne" ng-model="chkValidEnabledOne"><label for="chkValidEnabled">Checked</label></p><p><input rx-checkbox id="chkValidEnabledTwo" ng-model="chkValidEnabledTwo"><label for="chkValidEnabledTwo">Unchecked</label></p></td><!-- Valid NG-Disabled --><td><p><input rx-checkbox id="chkValidNgDisabledOne" ng-disabled="true" ng-model="chkValidNgDisabledOne"><label for="chkValidNgDisabledOne">Checked</label></p><p><input rx-checkbox id="chkValidNgDisabledTwo" ng-disabled="true" ng-model="chkValidNgDisabledTwo"><label for="chkValidNgDisabledTwo">Unchecked</label></p></td><!-- Valid Disabled --><td><p><input rx-checkbox id="chkValidDisabledOne" disabled="disabled" ng-model="chkValidDisabledOne"><label for="chkValidDisabledOne">Checked</label></p><p><input rx-checkbox id="chkValidDisabledTwo" disabled="disabled" ng-model="chkValidDisabledTwo"><label for="chkValidDisabledTwo">Unchecked</label></p></td></tr><tr><th>Invalid</th><!-- Invalid Enabled --><td><p><input rx-checkbox id="chkInvalidEnabledOne" ng-model="chkInvalidEnabledOne" always-invalid><label for="chkInvalidEnabledOne">Checked</label></p><p><input rx-checkbox id="chkInvalidEnabledTwo" ng-model="chkInvalidEnabledTwo" always-invalid><label for="chkInvalidEnabledTwo">Unchecked</label></p></td><!-- Invalid NG-Disabled --><td><p><input rx-checkbox id="chkInvalidNgDisabledOne" ng-model="chkInvalidNgDisabledOne" ng-disabled="true" always-invalid><label for="chkInvalidNgDisabledOne">Checked</label></p><p><input rx-checkbox id="chkInvalidNgDisabledTwo" ng-model="chkInvalidNgDisabledTwo" ng-disabled="true" always-invalid><label for="chkInvalidNgDisabledTwo">Unchecked</label></p></td><!-- Invalid Disabled --><td><p><input rx-checkbox id="chkInvalidDisabledOne" ng-model="chkInvalidDisabledOne" disabled="disabled" always-invalid><label for="chkInvalidDisabledOne">Checked</label></p><p><input rx-checkbox id="chkInvalidDisabledTwo" ng-model="chkInvalidDisabledTwo" disabled="disabled" always-invalid><label for="chkInvalidDisabledTwo">Unchecked</label></p></td></tr></tbody></table><rx-debug><h3>Plain HTML Checkboxes (for comparison)</h3><p><input type="checkbox" id="plainHtmlNormal" ng-required="true"><label for="plainHtmlNormal">A plain checkbox</label></p><p><input type="checkbox" id="plainHtmlDisabled" disabled="disabled"><label for="plainHtmlDisabled">A plain checkbox (disabled)</label></p><p><input type="checkbox" id="plainHtmlChecked" checked="checked"><label for="plainHtmlChecked">A plain checkbox (checked)</label></p><p><input type="checkbox" id="plainChkRemoveCheckbox" ng-model="plainChkIsRemoved"><label for="plainChkRemoveCheckbox">Remove Following Checkbox:</label><input type="checkbox" checked="checked" id="plainChkRemoveable" ng-if="!plainChkIsRemoved"></p></rx-debug><!-- END: checkboxes --><h3><rx-permalink>Toggle Switches</rx-permalink></h3><ul class="list"><li>You can use the <a href="#/components/rxToggleSwitch">rxToggleSwitch</a> component for toggle switch controls.</li><li>If you intend to use a label element, place it <strong>immediately after the rxToggleSwitch</strong> to style the label when the control is disabled.</li><li><strong class="msg-warn">DO NOT wrap rxToggleSwitch in a label element.</strong></li><li><strong class="msg-info">NOTE:</strong> An rxToggleSwitch does not toggle when clicking its label. However, CSS styles are still applied if the control is disabled within an rxForm.</li><li>For consistency, and future compatibility, assume that rxToggleSwitch and label works as expected.</li></ul><h3><rx-permalink>Radios</rx-permalink></h3><ul class="list"><li>Use the <a href="#/components/rxRadio">rxRadio</a> component for radio controls.</li><li>If you intend to use a label element, place it <strong>immediately after the rxRadio</strong> so that CSS rules may style the label when the control is disabled.</li><li><strong class="msg-warn">DO NOT wrap rxRadio in a label element.</strong></li></ul><rx-example name="forms.radios"></rx-example><h3><rx-permalink>Using a Character Counter</rx-permalink></h3><ul class="list"><li>Character counters provide color feedback to the user in addition to numeric feedback. As a user approaches the character limit, the numeric value turns from gray to yellow, then yellow to red.</li><li>The character counter is already styled and has the correct width needed to be positioned next to a textarea. If you need to change the textarea width, a custom wrapper class and textarea width can be set.</li><li>If you intend to use a counter on text inputs, instead of the more commonly used text area, be aware the framework does not support these fields. You may experience unexpected results. Make sure to test your code.</li><li>See <a href="#/components/rxCharacterCount/">rxCharacterCount</a> for more specific documentation about implementing a counter on a textarea or text input field.</li></ul><h3><rx-permalink>Disabled State</rx-permalink></h3><ul class="list"><li>When an input is disabled, styles are automatically applied to gray out the field with a "not-allowed" pointer style.</li><li>When label rules (seen above) are applied correctly to a radio, checkbox, or toggle switch, the label will also be styled.</li></ul><rx-example name="forms.disabled"></rx-example><!-- BEGIN: rxDatePicker --><h3><rx-permalink>Date Picker</rx-permalink><a class="button xs inline" href="ngdocs/index.html#/api/elements.directive:rxDatePicker/">View API</a><!-- (NOTE) stability: \'PROTOTYPE\' --></h3><rx-notification type="info"><p>This element is designed to be used in conjunction with other picker elements to compose a valid ISO 8601 DateTime string in the format of <code>YYYY-MM-DDTHH:mmZ</code>.</p></rx-notification><ul class="list"><li>This element will generate a <strong>String</strong> in the format of <code>YYYY-MM-DD</code> to be used as the date portion of the ISO 8601 standard DateTime string mentioned above.</li><li>This element will never generate anything other than a String.</li></ul><h4>Simple Example</h4><p>Sometimes, a form may need to prepopulate a value for Date Picker. The example below shows how the element behaves when its model is defaulted to today\'s date. When a different date is selected, a gray circle around the current date provides additional context to users as they find their selection in the date picker.</p><rx-example name="rxDatePicker.simple"></rx-example><h4>Behavior with Empty Model</h4><p>A typical use case is to use rxDatePicker without a default value set. The example below shows how it will behave if you have a blank (empty string) or undefined value for your model.</p><rx-example name="rxDatePicker.empty"></rx-example><h4>Date Picker States</h4><p>Below you\'ll find examples of how <code>Date Picker</code> will appear in different states.</p><table ng-controller="rxDatePickerCtrl"><thead><th></th><th>Enabled</th><th>Disabled</th></thead><tbody><tr><th>Valid</th><td><rx-date-picker id="dpEnabledValid" ng-model="enabledValid"></rx-date-picker></td><td><rx-date-picker id="dpDisabledValid" ng-disabled="true" ng-model="disabledValid"></rx-date-picker></td></tr><tr><th>Invalid</th><td><rx-date-picker id="dpEnabledInvalid" always-invalid ng-model="enabledInvalid"></rx-date-picker></td><td><rx-date-picker id="dpDisabledInvalid" ng-disabled="true" always-invalid ng-model="disabledInvalid"></rx-date-picker></td></tr></tbody></table><!-- END: rxDatePicker --><!-- BEGIN: rxTimePicker --><h3><rx-permalink>Time Picker</rx-permalink><a class="button xs inline" href="ngdocs/index.html#/api/elements.directive:rxTimePicker/">View API</a><!-- (NOTE) stability: \'PROTOTYPE\' --></h3><rx-notification type="info"><p>This element is designed to be used in conjunction with other picker elements to compose a valid ISO 8601 DateTime string in the format of <code>YYYY-MM-DDTHH:mmZ</code>.</p></rx-notification><ul class="list"><li>This element will generate a <strong>String</strong> in the format of <code>HH:mmZ</code> to be used as the time portion of the ISO 8601 standard DateTime string mentioned above.<ul><li><code>HH</code> is the 24-hour format from 00 to 23</li><li><code>mm</code> is the minutes from 00 to 59</li><li><code>Z</code> is the UTC offset that matches <code>[-+]\\d{2}:\\d{2}</code></li></ul></li><li>This element will never generate anything other than a String.</li></ul><h4>Simple Example</h4><rx-example name="rxTimePicker.simple"></rx-example><h4>Time Picker States</h4><p>Below you\'ll find examples of how <code>Time Picker</code> will appear in different states.</p><table ng-controller="rxTimePickerCtrl"><thead><th></th><th>Enabled</th><th>Disabled</th></thead><tbody><tr><th>Valid</th><td><rx-time-picker id="tpEnabledValid" ng-disabled="false" ng-model="enabledValid"></rx-time-picker></td><td><rx-time-picker id="tpDisabledValid" ng-disabled="true" ng-model="disabledValid"></rx-time-picker></td></tr><tr><th>Invalid</th><td><rx-time-picker id="tpEnabledInvalid" always-invalid ng-disabled="false" ng-model="enabledInvalid"></rx-time-picker></td><td><rx-time-picker id="tpDisabledInvalid" ng-disabled="true" always-invalid ng-model="disabledInvalid"></rx-time-picker></td></tr></tbody></table><!-- END: rxTimePicker --><h3><rx-permalink>Form Validation</rx-permalink></h3><ul class="list"><li>EncoreUI is built on Angular and uses ngModel directives for validation. As a result, you will see custom CSS styling if an element has the <code>.ng-invalid</code> and/or <code>.ng-dirty</code> classes, which are dynamically added by ngModel validation logic.</li><li>Some components will style based on both classes being present (typical use case), while others will only use <code>.ng-invalid</code>.</li><li>Creating an EncoreUI-specific design pattern for placement of form validation messages is on our roadmap.</li><li>At present, there are no styles for invalid toggle switches.</li></ul><rx-example name="forms.validation"></rx-example><h2><rx-permalink>Saving Form Data</rx-permalink></h2><h3><rx-permalink>Saving In-Progress Form State</rx-permalink></h3><ul class="list"><li>Saving a form state can help with user experience. You can use rxAutoSave to activate this feature.</li><li>rxAutoSave interacts exclusively with your model layer. Your UI/template code will be unaware that its state is being saved.</li><li>See <a href="#/utilities/rxAutoSave">rxAutoSave</a> for further details.</li></ul><rx-example name="forms.autoSave"></rx-example><h3><rx-permalink>Manual Form Saving</rx-permalink></h3><ul class="list"><li>If you require form data to be completed before submitting, or require interactive form experiences, a conditional save button and notification is used.</li><li>The notification should only be shown after a change has been made to the form, not on page load.</li><li>The subtitle of the page should indicate when the form was last saved and contain the save button.</li></ul><rx-example name="forms.manualSave"></rx-example><h2><rx-permalink>Design Patterns within Encore</rx-permalink></h2><ul class="list"><li>Forms can be used on their own page. You can see this in Encore when you create a new object such as a Cloud Server or a Database under Encore Cloud.</li><li>Forms are also used within modals. You can see this when modifying content that requires form fields such as actions performed on a Cloud Server instance.</li><li>You can use <a href="#/layout/wells">Wells</a> to create additional context for the form.</li></ul><h2><rx-permalink>UI Roadmap / Possible Future-work</rx-permalink></h2><ul class="list"><li>Fleshing out a design pattern for edit states.<ul><li>Up until now, the editing of content has been relegated to using modals to edit individual line items. As a result, different products have handled the concept of an edit state differently.</li><li>There should be conformity for this, but we have not designed a user pattern yet.</li></ul></li></ul></h4>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('forms.autoSave.html',
    '<p>The text input below will automatically save its content. If you navigate away from this page, and then return, whatever you previously typed will automatically be populated into the text input</p><span class="field-input" ng-controller="formsAutoSaveExampleController"><input type="text" ng-model="forms.autosave"></span>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('forms.disabled.html',
    '<h4>Disabled Form Controls</h4><form rx-form ng-controller="formsDisabledExamplesCtrl"><rx-form-section><rx-field><rx-field-name>Disabled Text Input</rx-field-name><rx-field-content><rx-input><input type="text" value="{{txtDisabled}}" disabled="disabled"></rx-input></rx-field-content><rx-field-name>Disabled Select</rx-field-name><rx-field-content><rx-input><select rx-select disabled="disabled" ng-model="selDisabled"><option value="disabled">Disabled Dropdown</option></select></rx-input></rx-field-content></rx-field><rx-field><rx-field-name>Disabled Radio</rx-field-name><rx-field-content><rx-input><input rx-radio id="radDisabledOne" value="1" name="radDisabled" ng-model="radDisabled" disabled="disabled"><label for="radDisabledOne">Selected Option</label></rx-input><rx-input><input rx-radio id="radDisabledTwo" value="2" name="radDisabled" ng-model="radDisabled" disabled="disabled"><label for="radDisabledTwo">Unselected Option</label></rx-input></rx-field-content><rx-field-name>Disabled Checkbox</rx-field-name><rx-field-content><rx-input><input rx-checkbox id="chkDisabledOne" ng-model="chkDisabledOne" disabled="disabled"><label for="chkDisabledOne">Checked Option</label></rx-input><rx-input><input rx-checkbox id="chkDisabledTwo" ng-model="chkDisabledTwo" disabled="disabled"><label for="chkDisabledTwo">Unchecked Option</label></rx-input></rx-field-content><rx-field-name>Disabled Toggle Switch</rx-field-name><rx-field-content><rx-input><rx-toggle-switch id="togDisabledOn" ng-model="togDisabledOn" disabled="true"></rx-toggle-switch><label for="togDisabledOn">Toggled ON Option</label></rx-input><rx-input><rx-toggle-switch id="togDisabledOff" ng-model="togDisabledOff" disabled="true"></rx-toggle-switch><label for="togDisabledOff">Toggled OFF Option</label></rx-input></rx-field-content></rx-field><rx-field><rx-field-name>Disabled Textarea</rx-field-name><rx-field-content><rx-input><textarea ng-model="txtAreaDisabled" disabled="disabled" rows="8">{{txtAreaDisabled}}</textarea></rx-input></rx-field-content></rx-field></rx-form-section></form>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('forms.manualSave.html',
    '<rx-page title="\'Page Title\'"><form rx-form name="form" ng-controller="formsManualSaveExampleController" style="clear: both"><rx-notification ng-if="form.$dirty" type="info" stack="page">Changes made are not automatically saved. Click "Save Now" to save changes.</rx-notification><h3 class="subdued"><span ng-show="lastSaved">Last saved {{lastSaved | date:\'medium\'}}</span> <span ng-hide="lastSaved">Unsaved changes.</span><rx-button classes="submit xs inline" ng-click="form.$setPristine(); save()" default-msg="Save Now" toggle-msg="Saving" toggle="saving" disable="form.$invalid || form.$pristine"></rx-button></h3><rx-form-section style="width: 200px"><rx-field><rx-field-name>Field:</rx-field-name><rx-field-content><rx-input><input type="text" name="field" ng-model="text" placeholder="Enter some text" ng-pattern="/^\\w+$/" ng-required></rx-input><rx-help-text>May not contain symbols</rx-help-text><rx-inline-error ng-show="form.field.$error.pattern">There are symbols in the entered text.</rx-inline-error></rx-field-content></rx-field></rx-form-section></form></rx-page>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('forms.radios.html',
    '<form rx-form><rx-form-section><rx-field><rx-field-name>Reboot:</rx-field-name><rx-field-content><rx-input><input rx-radio name="type" id="server_reboot_soft" value="soft" ng-model="fields.reboot_type" required><label for="server_reboot_soft">Soft</label></rx-input><rx-help-text>Performs a graceful shutdown of your system. Services are halted individually and the system is restarted.</rx-help-text><rx-input><input rx-radio name="type" id="server_reboot_hard" value="hard" ng-model="fields.reboot_type" required><label for="server_reboot_hard">Hard</label></rx-input><rx-help-text>Performs an immediate shutdown of your server. This is the equivalent of unplugging your server.</rx-help-text></rx-field-content></rx-field></rx-form-section></form>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('forms.validation.html',
    '<form rx-form ng-controller="formsInvalidExamplesCtrl"><rx-form-section><rx-field><rx-field-name>Invalid Text Input</rx-field-name><rx-field-content><rx-input><input type="text" always-invalid ng-model="txtInvalid"></rx-input></rx-field-content><rx-field-name>Invalid Dropdown</rx-field-name><rx-field-content><rx-input><select rx-select always-invalid ng-model="selInvalid"><option value="invalid">Invalid Option</option></select></rx-input></rx-field-content></rx-field><rx-field><rx-field-name>Invalid Radio</rx-field-name><rx-field-content><rx-input><input rx-radio always-invalid id="radInvalidOne" name="radInvalid" value="1" ng-model="radInvalid"><label for="radInvalidOne">Selected Option</label></rx-input><rx-input><input rx-radio always-invalid id="radInvalidTwo" name="radInvalid" value="2" ng-model="radInvalid"><label for="radInvalidTwo">Unselected Option</label></rx-input></rx-field-content><rx-field-name>Invalid Checkbox</rx-field-name><rx-field-content><rx-input><input rx-checkbox always-invalid id="chkInvalidOne" value="1" ng-model="chkInvalidOne"><label for="chkInvalidOne">Checked Option</label></rx-input><rx-input><input rx-checkbox always-invalid id="chkInvalidTwo" value="2" ng-model="chkInvalidTwo"><label for="chkInvalidTwo">Unchecked Option</label></rx-input></rx-field-content><!-- Uncomment if/when "invalid" styles available --><!--\n' +
    '        <rx-field-name>Invalid Toggle Switch</rx-field-name>\n' +
    '        <rx-field-content>\n' +
    '        <rx-input>\n' +
    '        <rx-toggle-switch always-invalid id="togInvalidOn" ng-model="togInvalidOn"></rx-toggle-switch>\n' +
    '        <label for="togInvalidOn">Toggled ON Option</label>\n' +
    '        </rx-input>\n' +
    '        <rx-input>\n' +
    '        <rx-toggle-switch id="togInvalidOff" ng-model="togInvalidOff"></rx-toggle-switch>\n' +
    '        <label for="togInvalidOff">Toggled OFF Option</label>\n' +
    '        </rx-input>\n' +
    '        </rx-field-content>\n' +
    '      --></rx-field><rx-field><rx-field-name>Invalid Textarea</rx-field-name><rx-field-content><rx-input><textarea rows="8" always-invalid ng-model="txtAreaInvalid">{{txtAreaInvalid}}</textarea></rx-input></rx-field-content></rx-field></rx-form-section></form>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxCheckbox.destroy.html',
    '<p><input rx-checkbox id="chkRemoveCheckbox" ng-model="chkIsRemoved"><label for="chkRemoveCheckbox">Remove Following Checkbox:</label><input rx-checkbox checked="checked" id="chkRemoveable" ng-if="!chkIsRemoved"></p>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxCheckbox.showHide.html',
    '<div class="rxCheckboxShowHideCtrl"><p><input rx-checkbox id="chkAmSure" ng-model="amSure" ng-required="true"><label for="chkAmSure">Are you sure?</label><small>({{amSure ? \'true\' : \'false\'}})</small><br><sub><em>Valid only if checked</em></sub></p><p ng-show="amSure"><input rx-checkbox id="chkAmReallySure" ng-model="amReallySure"><label for="chkAmReallySure">Are you REALLY sure?</label><small>({{amReallySure ? \'true\' : \'false\'}})</small></p></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxDatePicker.empty.html',
    '<form rx-form name="emptyForm" ng-controller="rxDatePickerEmptyCtrl"><rx-form-section controlled-width><rx-field><rx-field-name>Empty String:</rx-field-name><rx-field-content><rx-input><rx-date-picker id="dpEmpty" ng-model="emptyDate"></rx-date-picker></rx-input><rx-help-text>Bound Value: {{emptyDate || \'N/A\'}}</rx-help-text></rx-field-content></rx-field><rx-field><rx-field-name>Undefined Value:</rx-field-name><rx-field-content><rx-input><rx-date-picker id="dpUndefined" ng-model="undefinedDate"></rx-date-picker></rx-input><rx-help-text>Bound Value: {{undefinedDate || \'N/A\'}}</rx-help-text></rx-field-content></rx-field></rx-form-section></form>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxDatePicker.simple.html',
    '<form rx-form name="simpleForm" ng-controller="rxDatePickerSimpleCtrl"><rx-form-section controlled-width><rx-field><rx-field-name>Basic Date Picker:</rx-field-name><rx-field-content><rx-input><rx-date-picker id="dpSimple" ng-model="dateModel"></rx-date-picker></rx-input><rx-help-text>Bound Value: {{dateModel || \'N/A\'}}</rx-help-text></rx-field-content></rx-field></rx-form-section></form>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxTimePicker.simple.html',
    '<div rx-form ng-controller="rxTimePickerSimpleCtrl"><rx-form-section><rx-field><rx-field-name>Empty Value:</rx-field-name><rx-field-content><rx-input><rx-time-picker id="emptyPicker" ng-model="emptyValue"></rx-time-picker></rx-input><rx-help-text>Bound Value: {{emptyValue}}</rx-help-text></rx-field-content></rx-field><rx-field><rx-field-name>Predefined Value:</rx-field-name><rx-field-content><rx-input><rx-time-picker id="predefinedPicker" ng-model="predefinedValue"></rx-time-picker></rx-input><rx-help-text>Bound Value: {{predefinedValue}}</rx-help-text></rx-field-content></rx-field></rx-form-section></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxMetadata.html',
    '<div><h3>Example</h3><rx-metadata><section><rx-meta label="Field Name">Field Value Example</rx-meta><rx-meta label="Another Field Name">Another Field Value Example</rx-meta><rx-meta label="Third Field Name">The Third Field Value Example</rx-meta><rx-meta label="Super Long Value" class="force-word-break">A super long data value with aseeminglyunbreakablewordthatcouldoverflowtonextcolumn</rx-meta><rx-meta label="Short Field Name">A long field value given here to show line break style.</rx-meta></section><section><rx-meta label="Status" id="metaStatus">Active</rx-meta><rx-meta label="RCN">RCN-555-555-555</rx-meta><rx-meta label="Type">Cloud</rx-meta><rx-meta label="Service Level">Managed &rarr; Managed</rx-meta><rx-meta label="Service Type">DevOps &rarr; SysOps</rx-meta></section><section><rx-meta label="Amount">{{ someAmount | currency }}</rx-meta><rx-meta label="Phone Number Field">888 - 888 - 8888</rx-meta><rx-meta label="Date Field">{{ someDate | date:\'MMMM d, yyyy @ HH:mm (UTCZ)\' }}</rx-meta><rx-meta label="Link Field"><a href="#">Link</a></rx-meta><rx-meta label="Data and Link Field">Some data <a href="#">(Link)</a></rx-meta></section></rx-metadata></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('Metadata.docs.html',
    '<p>Metadata contains directives to provide consistent styling for the display of metadata information.</p><rx-example name="metadata.simple"></rx-example>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('metadata.simple.html',
    '<div ng-controller="metadataSimpleExampleCtrl"><h3>Example</h3><rx-metadata><section><rx-meta label="Field Name">Field Value Example</rx-meta><rx-meta label="Another Field Name">Another Field Value Example</rx-meta><rx-meta label="Third Field Name">The Third Field Value Example</rx-meta><rx-meta label="Super Long Value" class="force-word-break">A super long data value with aseeminglyunbreakablewordthatcouldoverflowtonextcolumn</rx-meta><rx-meta label="Short Field Name">A long field value given here to show line break style.</rx-meta></section><section><rx-meta label="Status" id="metaStatus">Active</rx-meta><rx-meta label="RCN">RCN-555-555-555</rx-meta><rx-meta label="Type">Cloud</rx-meta><rx-meta label="Service Level">Managed &rarr; Managed</rx-meta><rx-meta label="Service Type">DevOps &rarr; SysOps</rx-meta></section><section><rx-meta label="Amount">{{ someAmount | currency }}</rx-meta><rx-meta label="Phone Number Field">888 - 888 - 8888</rx-meta><rx-meta label="Date Field">{{ someDate | date:\'MMM d, yyyy @ HH:mm (UTCZ)\' }}</rx-meta><rx-meta label="Link Field"><a href="#">Link</a></rx-meta><rx-meta label="Data and Link Field">Some data <a href="#">(Link)</a></rx-meta></section></rx-metadata></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('Tags.docs.html',
    '<p>A component used to apply predetermined descriptions to an entity.</p><rx-example name="tags.simple"></rx-example>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('tags.simple.html',
    '<div ng-controller="tagsSimpleExampleCtrl"><h4>Standard:</h4><rx-tags id="standard-tags" ng-model="tags" options="tagOptions" key="text"></rx-tags><h4>Disabled:</h4><rx-tags id="disabled-tags" ng-model="tagOptions" disabled="disabled"></rx-tags></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('Session.docs.html',
    '<p>Manages a user session.</p><rx-example name="Session.simple"></rx-example>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('Session.simple.html',
    '<div ng-controller="SessionSimpleCtrl"><button ng-click="isAuthenticated()" class="button">Are You Authenticated?</button></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('TokenInterceptor.docs.html',
    '<p>Adds an authorization token to all HTTP requests. This allows access to system services for authenticated users.</p>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('UnauthorizedInterceptor.docs.html',
    '<p>Redirects users to the login page, when user authentication fails during a system service request.</p>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('UtcOffsets.demo.html',
    '<p>List of known UTC Offset Values as found at <a href="https://en.wikipedia.org/wiki/List_of_UTC_time_offsets" target="_blank">https://en.wikipedia.org/wiki/List_of_UTC_time_offsets </a>.</p>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxAge.docs.html',
    '<p><code>rxAge</code> provides several filters to parse dates.</p><rx-example name="rxAge.demo"></rx-example>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxAge.demo.html',
    '<div ng-controller="rxAgeCtrl" id="rxAge-demo"><ol class="list"><li>{{ageHours}} &rarr; {{ageHours | rxAge}}</li><li>{{ageDays}} &rarr; {{ageDays | rxAge}}</li><li>{{ageMonths}} &rarr; {{ageMonths | rxAge}}</li><li>{{ageYears}} &rarr; {{ageYears | rxAge}}</li><li>{{ageHours}} &rarr; {{ageHours | rxAge:true}}</li><li>{{ageDays}} &rarr; {{ageDays | rxAge:true}}</li><li>{{ageMonths}} &rarr; {{ageMonths | rxAge:true}}</li><li>{{ageYears}} &rarr; {{ageYears | rxAge:true}}</li><li>{{ageHours}} &rarr; {{ageHours | rxAge:1:true}}</li><li>{{ageDays}} &rarr; {{ageDays | rxAge:2:true}}</li><li>{{ageMonths}} &rarr; {{ageMonths | rxAge:3:true}}</li><li>{{ageYears}} &rarr; {{ageYears | rxAge:3:true}}</li></ol></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxDOMHelper.docs.html',
    '<p>A small set of useful DOM-related functions.</p>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxLocalStorage.docs.html',
    '<p>Simple wrapper for interacting with local storage in the browser.</p><h3>Simple Example</h3><p>Select <code>Store Answer</code>, then <code>Answer?</code> to first store the answer in the browser\'s <code>localStorage</code> object and later retrieve the stored content.</p><rx-example name="rxLocalStorage.simple"></rx-example>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxLocalStorage.simple.html',
    '<div ng-controller="rxLocalStorageSimpleCtrl"><label>Who is the Joker\'s side kick?</label><button ng-click="setSideKick()" class="button button-positive">Store Answer</button> <button ng-click="getSideKick()" class="button">Answer?</button></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxNestedElement.docs.html',
    '<p>Helper function to aid in the creation of boilerplate Directive Definition Object definitions required to validate nested custom elements.</p>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxSortEmptyTop.docs.html',
    '<p>Moves rows with an empty predicate to the top of the column in ascending order, and to the bottom in descending order.</p><rx-example name="rxSortEmptyTop.simple"></rx-example>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxSortEmptyTop.simple.html',
    '<div ng-controller="rxSortEmptyTopSimpleCtrl"><p>The table is using <code>rxSortEmptyTop</code> to sort empty columns in ascending and descending order.</p><table rx-floating-header><thead><tr><th scope="col"><rx-sortable-column sort-method="sortCol(property)" sort-property="name" predicate="sort.predicate" reverse="sort.reverse">Name</rx-sortable-column></th><th scope="col"><rx-sortable-column sort-method="sortCol(property)" sort-property="volumeId" predicate="sort.predicate" reverse="sort.reverse">Volume ID</rx-sortable-column></th></tr></thead><tbody id="serverVolumeData"><tr ng-repeat="resource in serverVolumes | rxSortEmptyTop:sort.predicate:sort.reverse"><th scope="row" class="resource-name">{{resource.name}}</th><td class="resource-id">{{resource.volumeId}}</td></tr></tbody></table></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxSortUtil.docs.html',
    '<p>Service which provides utility methods for sorting collections.</p>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxStatusColumnIcons.docs.html',
    '<p>Maps internal statuses to <a href="http://fontawesome.io/">FontAwesome icons</a>. Examples of their usage are available on the <a href="#/components/rxStatusColumn">rxStatusColumn demo page</a>.</p>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxStatusMappings.docs.html',
    '<p>A set of methods for creating mappings to status identifiers used in EncoreUI.</p><rx-example name="rxStatusMappings.simple"></rx-example>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxStatusMappings.simple.html',
    '<div ng-controller="rxStatusMappingsSimpleCtrl"><p><strong>Tip:</strong> Hover over each status to see pop-up status value.</p><table class="table-striped demo-status-column-table"><thead><tr><th rx-status-header>Status</th><th class="column-title">Title</th></tr></thead><tbody><tr ng-repeat="server in servers | orderBy: sort.predicate:sort.reverse "><!-- Both `api` and `tooltip-content` are optional --><td rx-status-column status="{{ server.status }}" api="{{ server.api }}" tooltip-content="{{ server.status }}"></td><td>{{ server.title }}</td></tr></tbody></table></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxTimePickerUtil.demo.html',
    '<p>Utility service used by <a href="#/elements/Forms#time-picker">rxTimePicker</a>.</p>');
}]);
