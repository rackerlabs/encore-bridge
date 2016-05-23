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
.controller('rxMetadataCtrl', function ($scope) {
    $scope.someDate = new Date('January 6 1989');
    $scope.someAmount = 192.68;
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

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxActionMenu.html',
    '<div><p>The cog in the first row is dismissable by clicking anywhere, but the second cog can only be dismissed by clicking on the cog itself.</p><h3 id="typical-usage">Typical Usage</h3><table class="table-striped"><thead><tr><th>Name</th><th class="actions"></th></tr></thead><tbody><tr><td>Globally dismissible</td><td><rx-action-menu id="globalDismissal"><ul class="rs-dropdown-menu"><li><span class="rs-dropdown-category">Manage:</span></li><li><a href="#">Add</a></li><li><a href="#">Delete</a></li></ul></rx-action-menu></td></tr><tr><td>Only dismissible by clicking on cog</td><td><rx-action-menu global-dismiss="false"><ul class="rs-dropdown-menu"><li><span class="rs-dropdown-category">Manage:</span></li><li><a href="#">Add</a></li><li><a href="#">Delete</a></li></ul></rx-action-menu></td></tr><tr><td>Unorthodox Behaviors (no modals, hidden item)</td><td><rx-action-menu id="custom"><ul class="rs-dropdown-menu"><li><span class="rs-dropdown-category">Manage:</span></li><li><a href="#">Add</a></li><li><a href="#">Delete</a></li></ul></rx-action-menu></td></tr></tbody></table></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxMetadata.html',
    '<div><h3>Example</h3><rx-metadata><section><rx-meta label="Field Name">Field Value Example</rx-meta><rx-meta label="Another Field Name">Another Field Value Example</rx-meta><rx-meta label="Third Field Name">The Third Field Value Example</rx-meta><rx-meta label="Super Long Value" class="force-word-break">A super long data value with aseeminglyunbreakablewordthatcouldoverflowtonextcolumn</rx-meta><rx-meta label="Short Field Name">A long field value given here to show line break style.</rx-meta></section><section><rx-meta label="Status" id="metaStatus">Active</rx-meta><rx-meta label="RCN">RCN-555-555-555</rx-meta><rx-meta label="Type">Cloud</rx-meta><rx-meta label="Service Level">Managed &rarr; Managed</rx-meta><rx-meta label="Service Type">DevOps &rarr; SysOps</rx-meta></section><section><rx-meta label="Amount">{{ someAmount | currency }}</rx-meta><rx-meta label="Phone Number Field">888 - 888 - 8888</rx-meta><rx-meta label="Date Field">{{ someDate | date:\'MMMM d, yyyy @ HH:mm (UTCZ)\' }}</rx-meta><rx-meta label="Link Field"><a href="#">Link</a></rx-meta><rx-meta label="Data and Link Field">Some data <a href="#">(Link)</a></rx-meta></section></rx-metadata></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxSortableColumn.html',
    '<div><table class="rs-list-table"><thead><tr><th scope="col"><rx-sortable-column sort-method="sortCol(property)" sort-property="name" predicate="sort.predicate" reverse="sort.reverse">Name</rx-sortable-column></th><th scope="col"><rx-sortable-column sort-method="sortCol(property)" sort-property="jobTitle" predicate="sort.predicate" reverse="sort.reverse">Occupation</rx-sortable-column></th><th scope="col"><rx-sortable-column sort-method="sortCol" sort-property="none" predicate="sort.predicate" reverse="sort.reverse">Testing Sort Errors (see Protractor Tab)</rx-sortable-column></th></tr></thead><tbody id="talentPoolData"><tr ng-repeat="resource in talentPool | orderBy:sort.predicate:sort.reverse"><td scope="row" class="talent-name">{{resource.name}}</td><td class="talent-job">{{resource.jobTitle}}</td><td></td></tr></tbody></table></div>');
}]);

angular.module('demoApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('rxStatusColumn.html',
    '<div><table class="table-striped demo-status-column-table"><thead><tr><th rx-status-header></th><th class="column-title">Title</th></tr></thead><tbody><tr ng-repeat="server in servers | orderBy: sort.predicate:sort.reverse "><!-- Both `api` and `tooltip-content` are optional --><td rx-status-column status="{{ server.status }}"></td><td>{{ server.title }}</td></tr></tbody></table></div>');
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
