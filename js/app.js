'use strict';
/* global _ */
/* global OC */

/* App Module */
var appModule   = angular.module('Financies', ['ngRoute', 'dndLists', 'ngDialog', 'moment-picker']);
var baseUrl     = '/apps/financies';
var templateUrl = OC.appswebroots.financies + '/js/templates/';

appModule
.service('AbstractService', function($rootScope) {
    this._getUrl = function(path) {
        return OC.generateUrl(baseUrl + '/' + path).replace(/([^:])(\/\/+)/g, '$1/');
    };

    this.synchronize = function(requests, event) {
        var completed = 0,
            result = {},
            iterator;

        event    = event || 'synced';
        iterator = function(response, key) {
            completed++;
            result[key] = response;

            if (completed === _.values(requests).length) {
                if (_.isArray(requests)) {
                    result = _.values(result);
                }

                $rootScope.$broadcast(event, requests, result);
            }
        };

        _.each(requests, function(request, key) {
            var tmp = function(response) {
                iterator(response, key);
            };

            request.success(tmp);
            request.error(tmp);
        });

        return this;
    };

    this.on = function(event, callback) {
        $rootScope.$on(event, callback);

        return this;
    };
})
.filter('customFilter', function() {
    return function(input, filter) {
        return filter(input);
    };
})
.run([
    '$rootScope', '$window',
    function (rootScope, $window) {
        rootScope.__templateUrl = templateUrl;
        rootScope.__currentUser = OC.getCurrentUser;
        rootScope.container     = {
            _instances: {},
            _listeners: {},
            _process: function(name) {
                if (this._instances[name] !== undefined && this._listeners[name] !== undefined) {
                    var instance = this._instances[name];
                    this._listeners[name].map(function (listener) {
                        listener(instance);
                    });
                }
            },
            get: function(name, success) {
                if (this._listeners[name] === undefined) {
                    this._listeners[name] = [];
                }

                this._listeners[name].push(success);
                this._process(name);
            },
            set: function(name, instance) {
                this._instances[name] = instance;
                this._process(name);
            }
        };

        $window.onbeforeunload = function() {
            rootScope.container.set('exit', true);
        };

    }]
);
