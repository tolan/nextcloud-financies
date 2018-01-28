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
                clone = function (item) {
                    var clone = _.clone(item);
                    if (clone.$$hashKey) {
                        delete(clone.$$hashKey);
                    }

                    return clone;
                },
                processSearch = function () {
                    scope.api(scope.string, function(response) {
                        scope.searched = response;
                        scope.enterSearched();
                    });
                };

            scope.string   = '';
            scope.selected = scope.ngModel;
            scope.searched = [];
            scope.isOpenSearch = false;

            scope.isSelected = function (item) {
                return _.find(scope.selected, clone(item));
            }

            scope.selectAllItems = function(searched) {
                searched.forEach(function(item) {
                    if (!scope.isSelected(item)) {
                        scope.selected.push(clone(item));
                    }
                });

                scope.searched = [];
                scope.leaveSearched();
            };

            scope.select = function (item, showSeach) {
                var index = scope.isSelected(item);
                if (!index) {
                    scope.selected.push(clone(item));
                } else {
                    scope.selected.splice(index, 1);
                }

                if (showSeach) {
                    scope.enterSearched();
                }
            };

            scope.leaveSearched = function() {
                scope.searched = [];
                scope.isOpenSearch = false;
            };

            scope.enterSearched = function() {
                scope.isOpenSearch = true;
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
