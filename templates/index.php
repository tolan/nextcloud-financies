<?php
style('financies', 'ngDialog.min');
style('financies', 'angular-moment-picker.min');
style('financies', 'components');
style('financies', 'style');
style('financies', 'mobile');

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
    <div class="financies-content" ng-view>
        Application error.
    </div>
</div>

