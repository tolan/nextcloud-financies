<?php
/**
 * Create your routes in here. The name is the lowercase name of the controller
 * without the controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\Financies\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */
return [
    'resources' => [
        'groups'        => ['url' => '/groups'],
        'budgets'       => ['url' => '/budgets'],
        'budgetLists'   => ['url' => '/lists'],
        'budgetShare'   => ['url' => '/shares'],
        'budgetTickets' => ['url' => '/tickets'],
        'budgetNotes'   => ['url' => '/notes']
    ],
    'routes' => [
        ['name' => 'home#index', 'url' => '/', 'verb' => 'GET'],

        ['name' => 'budgets#order', 'url' => '/budgets/order', 'verb' => 'POST'],

        ['name' => 'budgetLists#index', 'url' => '/budgets/{budgetId}/lists', 'verb' => 'GET'],
        ['name' => 'budgetLists#order', 'url' => '/lists/order', 'verb' => 'POST'],

        ['name' => 'budgetShare#index', 'url' => '/budgets/{budgetId}/share', 'verb' => 'GET'],
        ['name' => 'budgetShare#findUser', 'url' => '/shares/query', 'verb' => 'POST'],

        ['name' => 'budgetTickets#index', 'url' => '/lists/{listId}/tickets', 'verb' => 'GET'],

        ['name' => 'budgetNotes#index', 'url' => '/lists/{listId}/notes', 'verb' => 'GET']
    ]
];
