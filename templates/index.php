<?php
style('financies', 'ngDialog.min');
style('financies', 'angular-moment-picker.min');
style('financies', 'style');

script('financies', 'angular.min');
script('financies', 'angular-loader.min');
script('financies', 'angular-resource.min');
script('financies', 'angular-route.min');
script('financies', 'angular-drag-and-drop-lists.min');
script('financies', 'angular-moment-picker.min');
script('financies', 'ngDialog.min');
script('financies', 'app');
script('financies', 'directives');
script('financies', 'services');
script('financies', 'controllers');
script('financies', 'router');

?>

<div id="app" ng-app="Financies" ng-controller="MainCtrl">
    <div class="financies-panel" ng-controller="BudgetListCtrl">
        <div class="side-panel">
            <div class="side-panel-wrapper">
                <div class="budget-list" ng-include="__templateUrl + 'budget/list.html'"></div>
                <div class="financies-settings" ng-controller="BudgetSettingsCtrl">
                    <div class="financies-settings-content">
                        <div>
                            <button class="settings-button" ng-click="isOpen = !isOpen"></button>
                        </div>
                        <div ng-show="isOpen" class="settings-content">
                            <div class="financies-settings-list" ng-include="__templateUrl + 'settings/list.html'"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="financies-content" ng-view>
        Application error.
    </div>
</div>

