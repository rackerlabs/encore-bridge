angular.module('encore.ui.rxApp')
.provider('rxUserData', function () {
    var pollInterval = 5;

    this.getter = function () {
        return {
            isProd: false,
            user: 'My Account',
            accountNumber: '',
            accountType: '',
            accountName: '',
            logoutUrl: ''
        };
    };

    this.setPollInterval = function (seconds) {
        pollInterval = seconds;
    };

    this.$get = function ($injector, $q, $window) {
        var data, proto;
        var timeoutId = null;
        var watchers = [];
        // Lazily invoke the injector on the getter to make it's definition easier.
        // Practically, this means the getter can return the object itself rather than another function.
        var getter = _.partial($injector.invoke, this.getter);

        function scheduleDirtyCheck () {
            timeoutId = $window.setTimeout(function () {
                var newData = getter();
                if (_.isEqual(newData, data)) {
                    scheduleDirtyCheck();
                } else {
                    var oldData = _.clone(data);
                    _.assign(data, newData);

                    var promise = $q.all(_.map(watchers, function (fn) {
                        return fn(data, oldData);
                    }));
                    promise.catch(function () {
                        timeoutId = null;
                    });
                    promise.then(scheduleDirtyCheck);
                }
            }, pollInterval * 1000);
        }

        proto = {
            load: function () {
                _.assign(this, getter());
            },

            watch: function (fn) {
                watchers.push(fn);
                if (timeoutId === null) {
                    scheduleDirtyCheck();
                }
                return function stopWatching () {
                    _.remove(watchers, function (watcher) {
                        return watcher === fn;
                    });
                    if (watchers.length === 0) {
                        $window.clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                };
            }
        };

        data = Object.create(proto);
        data.load();
        return data;
    };
});
