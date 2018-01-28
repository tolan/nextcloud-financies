/* global templateUrl */
/* global oc_requesttoken */

angular.module('Financies')
.config([
    '$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
	$httpProvider.defaults.headers.common.requesttoken = oc_requesttoken;

        $routeProvider
            .when('/', {templateUrl: templateUrl + 'budget/detail.html', controller: 'BudgetController'})
            .when('/budget/:budgetId', {templateUrl: templateUrl + 'budget/detail.html', controller: 'BudgetController'})
            .when('/budget/:budgetId/list/:listId', {templateUrl: templateUrl + 'budget/detail.html', controller: 'BudgetController'})

            // DEFAULT PAGE
            .otherwise({redirectTo: '/'});

        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(false);
    }
]);
