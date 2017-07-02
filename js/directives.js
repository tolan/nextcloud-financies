/* global _ */
angular.module('Financies')
.directive('picker', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: 'EA',
        require: '?^ngModel',
        replace: true,
        scope: {
            ngModel   : "=",
            api       : "=",
            template  : "=",
            parent    : "=",
            selectAll : "@"
        },
        templateUrl: templateUrl + 'directives/picker.html',
        link: function(scope, element) {
            var searchDelay,
                searchShowTimer,
                clone = function (item) {
                    var clone = _.clone(item);
                    if (clone.$$hashKey) {
                        delete(clone.$$hashKey);
                    }

                    return clone;
                },
                initShowSearch = function () {
                    scope.enterSearched();
                    searchShowTimer = $timeout(
                        function() {
                            scope.leaveSearched();
                        },
                        5000
                    );
                },
                processSearch = function () {
                    scope.api(scope.string, function(response) {
                        var cloned = response.map(function(item) {
                            return clone(item);
                        });
                        scope.searched = _.difference(cloned, scope.selected);
                        initShowSearch();
                    });
                };

            scope.string   = '';
            scope.selected = scope.ngModel;
            scope.searched = [];
            scope.isOpenSearch = false;

            scope.selectAllItems = function(searched) {
                searched.forEach(function(item) {
                    scope.selected.push(item);
                });

                scope.searched = [];
                scope.leaveSearched();
            };

            scope.select = function(item) {
                if (!_.find(scope.selected, clone(item))) {
                    scope.selected.push(item);
                }

                scope.searched = _.without(scope.searched, item);
                initShowSearch();
            };

            scope.unselect = function(item) {
                var index = _.indexOf(scope.selected, item);
                if (index !== -1) {
                    scope.selected.splice(index, 1);
                }
            };

            scope.leaveSearched = function() {
                scope.searched = [];
                scope.isOpenSearch = false;
            };

            scope.enterSearched = function() {
                scope.isOpenSearch = true;
                if (searchShowTimer) {
                    $timeout.cancel(searchShowTimer);
                }
            };

            scope.searchAll = function () {
                if (scope.isOpenSearch) {
                    scope.leaveSearched();
                } else {
                    processSearch();
                }
            };

            scope.search = function() {
                if (searchDelay) {
                    $timeout.cancel(searchDelay);
                }

                searchDelay = $timeout(
                    function() {
                        if (scope.string) {
                            processSearch();
                        }
                    },
                    600
                );
            };

            scope.transformSearchedItem = function(item, index, selector) {
                var el          = angular.element(element.find(selector).get(index)),
                    clonedScope = scope.$new(true, scope);

                clonedScope.parent = scope.parent;
                clonedScope.item   = item;
                el.html(scope.template);
                $compile(el)(clonedScope);
            };
        }
    };
}])
.directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(scope, element) {
            $timeout(function(){
                angular.element(element).trigger('focus');
            }, 0);
        }
    };
});;
