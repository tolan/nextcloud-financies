/* global _ */
/* global templateUrl */

angular.module('Financies')

.controller('MainCtrl', function ($scope, $route, BudgetShareService, BudgetGroupsService, BudgetListService, BudgetTicketService) {
    $scope.route = $route;
    BudgetGroupsService.getGroups(
        function (response) {
            $scope.container.set('groups', response.data);
        }
    );

    $scope.$on('$routeChangeStart', function (event, route) {
        if (route.params.budgetId) {
            BudgetShareService.getShares(
                route.params.budgetId,
                function (response) {
                    var users = response.data.map(function(user) {
                        return Object.assign({}, user, {displayname: user.displayname || user.uid});
                    });

                    $scope.container.set('shares', users);
                }
            );

            BudgetListService.getLists(
                route.params.budgetId,
                function (response) {
                    $scope.container.set('lists', response.data);
                }
            );

            if (route.params.listId) {
                BudgetTicketService.getTickets(
                    route.params.listId,
                    function (response) {
                        $scope.container.set('tickets', response.data);
                    }
                );
            }
        }
    });
})

.controller('BudgetListCtrl', function ($scope, $routeParams, BudgetService) {
    $scope.budgets      = [];
    $scope.activeBudget = Number($routeParams.budgetId) || null;
    $scope.budget       = {
        name: ''
    };

    BudgetService.getBudgets(
        function (response) {
            $scope.budgets = response.data;
        }
    );

    $scope.openEdit = function (budget) {
        budget._action = 'edit';
    };

    $scope.openDelete = function (budget) {
        budget._action = 'delete';
    };

    $scope.close = function (budget) {
        delete(budget._action);

        if (!budget.id) {
            budget.name = '';
        }
    };

    $scope.save = function (budget) {
        var newBudget = angular.copy(budget);
        if (!newBudget.order) {
            newBudget.order = $scope.budgets.length + 1;
        }

        if (newBudget.name.length > 0) {
            BudgetService.save(
                newBudget,
                function (response) {
                    if (!budget.id) {
                        $scope.budgets.push(response.data);
                    }
                }
            );
        }

        $scope.close(budget);
    };

    $scope.delete = function (budget) {
        BudgetService.delete(
            budget,
            function (response) {
                $scope.budgets = $scope.budgets.filter(
                    function (item) {
                        return item.id !== response.data.id;
                    }
                );
            }
        );
    };

    $scope.movedBudgets = function () {
        $scope.budgets.map(function (item, index) {
            item.order = index + 1;
            return item;
        });
        BudgetService.saveOrder($scope.budgets);
    };
})

.controller('BudgetSettingsCtrl', function ($scope, BudgetGroupsService) {
    $scope.isOpen = false;
    $scope.groups = [];
    $scope.group  = {
        name: ''
    };

    $scope.container.get('groups', function (groups) {
        $scope.groups = groups;
    });

    $scope.openEdit = function (group) {
        group._action = 'edit';
    };

    $scope.openDelete = function (group) {
        group._action = 'delete';
    };

    $scope.close = function (group) {
        delete(group._action);

        if (!group.id) {
            group.name = '';
        }
    };

    $scope.save = function (group) {
        BudgetGroupsService.save(
            angular.copy(group),
            function (response) {
                if (!group.id) {
                    $scope.groups.push(response.data);
                }

                $scope.container.set('groups', $scope.groups);
            }
        );

        $scope.close(group);
    };

    $scope.delete = function (group) {
        BudgetGroupsService.delete(
            group,
            function (response) {
                $scope.groups = $scope.groups.filter(
                    function (item) {
                        return item.id !== response.data.id;
                    }
                );
                $scope.container.set('groups', $scope.groups);
            }
        );
    };
})

.controller('BudgetController', function ($scope, $routeParams) {
    $scope.budgetId = $routeParams.budgetId;
    $scope.listId   = $routeParams.listId;
})

.controller('BudgetShareController', function ($scope, $routeParams, $timeout, BudgetShareService) {
    $scope.budgetId = $routeParams.budgetId;
    $scope.shares   = [];
    $scope.users    = [];
    $scope.timer;

    $scope.container.get('shares', function (shares) {
        $scope.users = $scope.shares = shares;
    });

    $scope.find = function (query) {
        if ($scope.timer) {
            $timeout.cancel($scope.timer);
        }

        if (query.length === 0) {
            $scope.users = $scope.shares;
            return;
        }

        $scope.timer = $timeout(
            function () {
                BudgetShareService.findUser(
                    query,
                    function (response) {
                        $scope.users = [];
                        response.data.forEach(function (user) {
                            var share;
                            if (!(share = $scope.shares.find(function (item) {return item.userId === user.uid;}))) {
                                share = {
                                    budgetId: $scope.budgetId,
                                    userId: user.uid,
                                    permissions: 0,
                                    displayname: user.displayname || user.uid
                                };
                            }

                            $scope.users.push(share);
                        });
                    }
                );
            },
            500,
            true,
            [$scope]
        );
    };

    $scope.save = function (share) {
        if (share.permissions === '0') {
            BudgetShareService.delete(
                share,
                function (response) {
                    $scope.shares = $scope.shares.filter(function (item) {return item.userId !== response.data.userId;});
                    $scope.container.set('shares', $scope.shares);
                }
            );
        } else {
            BudgetShareService.save(
                share,
                function (response) {
                    var index;
                    response.data.permissions = response.data.permissions.toString();

                    if ((index = $scope.shares.findIndex(function (item) {return item.userId === response.data.userId;})) !== -1) {
                        $scope.shares[index] = response.data;
                    } else {
                        $scope.shares.push(response.data);
                    }

                    if ((index = $scope.users.findIndex(function (item) {return item.userId === response.data.userId;})) !== -1) {
                        $scope.users[index] = response.data;
                    } else {
                        $scope.users.push(response.data);
                    }

                    $scope.container.set('shares', $scope.shares);
                }
            );
        }
    };
})

.controller('BudgetGridController', function ($scope, $routeParams, BudgetListService) {
    $scope.budgetId = $routeParams.budgetId;
    $scope.activeList = Number($routeParams.listId) || null;
    $scope.lists    = [];
    $scope.list     = {
        'name'     : '',
        'budgetId' : $scope.budgetId
    };

    $scope.container.get('lists', function (lists) {
        $scope.lists = lists;
    });

    $scope.openEdit = function (list) {
        list._action = 'edit';
    };

    $scope.openDelete = function (list) {
        list._action = 'delete';
    };

    $scope.close = function (list) {
        delete(list._action);

        if (!list.id) {
            list.name = '';
        }
    };

    $scope.save = function (list) {
        var newList = angular.copy(list);
        if (!newList.order) {
            newList.order = $scope.lists.length + 1;
        }

        BudgetListService.save(
            newList,
            function (response) {
                if (!list.id) {
                    $scope.lists.push(response.data);
                }

                $scope.container.set('lists', $scope.lists);
            }
        );

        $scope.close(list);
    };

    $scope.delete = function (list) {
        BudgetListService.delete(
            list,
            function (response) {
                $scope.lists = $scope.lists.filter(
                    function (item) {
                        return item.id !== response.data.id;
                    }
                );

                $scope.container.set('lists', $scope.lists);
            }
        );
    };

    $scope.moved = function () {
        $scope.lists.map(function (item, index) {
            item.order = index + 1;
            return item;
        });
        BudgetListService.saveOrder($scope.lists);
        $scope.container.set('lists', $scope.lists);
    };
})

.controller('ListController', function () {
})

.controller('ListOptionsController', function ($scope, $routeParams) {
    const SORT_ASC  = 'asc';
    const SORT_DESC = 'desc';

    $scope.budgetId  = $routeParams.budgetId;
    $scope.groups    = [];
    $scope.payers    = [];
    $scope.consumers = [];
    $scope.sortingOptions = [
        {name : 'Datum', field : 'date', icon : 'icon-triangle-n', type : SORT_ASC},
        {name : 'Datum', field : 'date', icon : 'icon-triangle-s', type : SORT_DESC},
        {name : 'Částka', field : 'price', icon : 'icon-triangle-n', type : SORT_ASC},
        {name : 'Částka', field : 'price', icon : 'icon-triangle-s', type : SORT_DESC}
    ];
    $scope.groupingOptions  = [
        {name : "Plátce", field : 'payers'},
        {name : "Skupina", field : 'groups'},
        {name : "Spotřeitel", field : 'consumers'},
        {name : "Datum", field : 'date'}
    ];
    $scope.isOpen    = {
        groups:    false,
        payers:    false,
        consumers: false
    };
    $scope.selected = {
        groups:    [],
        payers:    [],
        consumers: [],
        grouping:  [],
        sorting:   [$scope.sortingOptions[1]]
    };

    $scope.container.get('groups', function (groups) {
        $scope.groups = groups;

        $scope.selected.groups = groups.map(function (item) { return item; });
    });

    $scope.container.get('shares', function (shares) {
        $scope.payers = $scope.consumers = shares;

        $scope.selected.payers    = shares.map(function (item) { return item; });
        $scope.selected.consumers = shares.map(function (item) { return item; });
    });

    $scope.isSelected = function (name, item) {
        return $scope.selected[name].find(function (value) {
            return value === item;
        });
    };

    $scope.select = function (name, value) {
        if (name === 'sorting') {
            $scope.selected[name] = [];
        } else if (name === 'grouping' && $scope.selected[value.field]) {
            value.values = $scope.selected[value.field];
        }

        var index = $scope.selected[name].findIndex(
            function (item) {
                return item === value;
            }
        );

        if (index !== -1) {
            $scope.selected[name].splice(index, 1);
        } else {
            $scope.selected[name].push(value);
        }

        $scope.container.set('List:Options:update', $scope.selected);
    };

    $scope.container.set('List:Options:update', $scope.selected);
})

.controller('ListTicketsController', function ($scope, $routeParams, BudgetTicketService, ngDialog) {
    $scope.listId   = $routeParams.listId;
    $scope.tickets  = [];
    $scope.options  = [];
    $scope.grouped  = [];
    $scope.priceSelector = {
        active: false,
        ticket: null
    };

    var compare = function (value, option) {
        if (_.isArray(value)) {
            return value.find(function (itemOption) {
                if (_.isObject(option)) {
                    return itemOption.id === option.id;
                } else {
                    return compare(itemOption, option);
                }
            });
        } else {
            return value === option;
        }
    };

    var contains = function (item, rules, strict) {
        var result = true;

        _.mapObject(rules, function(options, index) {
            if (item[index] !== undefined && (item[index].length || strict)) {
                if (!options.some(function (option) {
                    return compare (item[index], option);
                })) {
                    result = false;
                }
            }
        });

        return result;
    };

    var resolveGroup = function (items, group) {
        var filters = group.values || _.unique($scope.tickets.reduce(function (acc, ticket) {
            if (ticket[group.field]) {
                acc.push(ticket[group.field]);
            }

            return acc;
        }, []));

        return filters.reduce(function (acc, filter) {
            var rule = {};
            rule[group.field] = [filter];

            acc.push({
                name: group.name + ': ' + (filter.name || filter.userId || filter),
                tickets: items.filter(function (item) {
                    return contains(item, rule, true);
                })
            });

            return acc;
        }, []);
    };

    var groupReducer = function (current, group) {
        return current.reduce(function (acc, grouped) {
            var isListOfTree = grouped.tickets.some(function(item) { return item.id; });

            if (isListOfTree && !grouped.name) {
                acc = resolveGroup(grouped.tickets, group);
            } else if (isListOfTree && grouped.name) {
                acc.push({
                    name: grouped.name,
                    tickets: resolveGroup(grouped.tickets, group)
                });
            } else {
                acc.push({
                    name: grouped.name,
                    tickets: groupReducer(grouped.tickets, group)
                });
            }

            return acc;
        }, []);
    };

    var groupTickets = function () {
        $scope.grouped = [{tickets: $scope.tickets}];
        if ($scope.options.grouping.length) {
            $scope.grouped = $scope.options.grouping.reduce(groupReducer, $scope.grouped);
        }
    };

    $scope.container.get('List:Options:update', function (options) {
        $scope.options = options;
        groupTickets();
    });

    $scope.container.get('tickets', function (tickets) {
        $scope.tickets = tickets;
        groupTickets();
    });

    $scope.filter = function (items) {
        if ($scope.options) {
            items = items.reduce(function (acc, item) {
                if (contains(item, $scope.options)) {
                    acc.push(item);
                }

                return acc;
            }, []);
        }

        return items;
    };

    $scope.getNames = function (items, field) {
        var fields = [].concat(field);
        items = items || [];
        items = items.map(function (item) {
            return fields.reduce(function(acc, field) {
                return acc === '' && item[field] ? item[field] : acc;
            }, '');
        });

        return items.join(', ');
    };

    var transformPrice = function (price) {
        var match, id, ticket;
        if ((match = price.match(/\{id:\d+\}/g))) {
            match.forEach(function (hash) {
                id = hash.substring(4);
                id = parseInt(id.substring(-1, id.length - 1));
                ticket = $scope.tickets.find(function (item) {
                    return parseInt(item.id) === id;
                });

                if (ticket) {
                    price = price.replace(hash, '(' + transformPrice(ticket.price) + ')');
                }
            });
        }

        return price;
    };

    var orderValue = function (first, second) {
        var sorting = _.first($scope.options.sorting);
        if (sorting.field === 'date') {
            first  = first.split('.').map(function(value) { return parseInt(value);}).reverse();
            second = second.split('.').map(function(value) { return parseInt(value);}).reverse();
            return first.reduce(function (result, value, index) {
                if (result === 0) {
                    if (value > second[index]) {
                        result = -1;
                    } else if (value < second[index]) {
                        result = 1;
                    }
                }

                return result;
            }, 0);
        } else if (sorting.field === 'price') {
            return $scope.calculate(first.toString()) < $scope.calculate(second.toString()) ? 1 : -1;
        }

        return first < second ? 1 : -1;
    };

    $scope.order = function (first, second) {
        var sorting = _.first($scope.options.sorting);

        if (sorting && first.type === 'string') {
            return orderValue(first.value, second.value);
        }

        return first.value < second.value ? 1 : -1;
    };

    var closePriceSelector = function () {
        $scope.priceSelector = {
            active : false,
            ticket : null
        };
    };

    $scope.calculate = function (price) {
        var result = transformPrice(price.toString());

        if (!/^[\d +-\/\*\(\)]+$/.test(result.toString())) {
            result = 'ERROR!';
        } else {
            try {
                result = eval(result);
            } catch (e) {
                result = 'ERROR!';
            }
        }

        return result;
    };

    $scope.getPrice = function (price) {
        price = $scope.calculate(price);
        if (price !== 'ERROR!') {
            price += ',-';
        }

        return price;
    };

    $scope.openDialog = function (ticket) {
        ticket = $scope.priceSelector.active ? $scope.priceSelector.ticket : ticket;
        closePriceSelector();

        var scope = $scope.$new(),
            dialog = ngDialog.open({
                template         : templateUrl + '/ticket/modal.html',
                controller       : 'TicketController',
                scope            : scope,
                showClose        : false,
                disableAnimation : true,
                data             : {
                    ticket : ticket || {}
                }
            });

        scope.$on('TicketController:close', function () {
            dialog.close();
        });

        scope.$on('TicketController:save', function (event, ticket) {
            $scope.save(ticket);
            dialog.close();
        });

        scope.$on('TicketController:select-ticket', function (event, ticket) {
            if (!$scope.tickets.length) {
                return null;
            }

            $scope.priceSelector = {
                active : true,
                ticket : ticket
            };
            dialog.close();
        });
    };

    $scope.openDelete = function (ticket) {
        closePriceSelector();
        var scope = $scope.$new(),
            dialog = ngDialog.open({
                template         : templateUrl + '/ticket/delete.html',
                controller       : 'TicketController',
                scope            : scope,
                showClose        : false,
                disableAnimation : true,
                data             : {
                    ticket : ticket || {}
                }
            });

        scope.$on('TicketController:close', function () {
            dialog.close();
        });

        scope.$on('TicketController:delete', function (event, ticket) {
            $scope.delete(ticket);
            dialog.close();
        });
    };

    $scope.openCalculateDialog = function () {
        var scope = $scope.$new(),
            sort = function (first, second) {
                var sorting = _.first($scope.options.sorting),
                    result  = orderValue (first[sorting.field], second[sorting.field]);

                if (sorting.type === 'asc') {
                    result = result === -1 ? 1 : -1;
                }

                return result;
            },
            dialog = ngDialog.open({
                template         : templateUrl + '/ticket/sum.html',
                controller       : 'CalculateController',
                scope            : scope,
                showClose        : false,
                disableAnimation : true,
                data             : {
                    tickets : $scope.filter($scope.tickets).sort(sort)
                }
            });

        scope.$on('CalculateController:close', function () {
            dialog.close();
        });
    };

    $scope.selectTicketForPrice = function (ticket) {
        if (!$scope.priceSelector.active) {
            return ;
        }

        var targetTicket = $scope.priceSelector.ticket;
        if (ticket) {
            targetTicket.price += '{id:' + ticket.id + '}';
        }

        closePriceSelector();
        $scope.openDialog(targetTicket);
    };

    $scope.save = function (ticket) {
        BudgetTicketService.save(
            ticket,
            function (response) {
                if (!ticket.id) {
                    $scope.tickets.push(response.data);
                } else {
                    var index = $scope.tickets.findIndex(function (item) { return item.id === ticket.id; });
                    $scope.tickets[index] = response.data;
                }

                if (ticket.listId !== $scope.listId) {
                    $scope.tickets = $scope.tickets.filter(function (item) {
                        return item.id !== response.data.id;
                    });
                }

                $scope.container.set('tickets', $scope.tickets);
                groupTickets();
            }
        );
    };

    $scope.delete = function (ticket) {
        BudgetTicketService.delete(
            ticket,
            function (response) {
                $scope.tickets = $scope.tickets.filter(function (item) {
                    return item.id !== response.data.id;
                });
                $scope.container.set('tickets', $scope.tickets);
                groupTickets();
            }
        );
    };
})

.controller('ListNotesController', function ($scope, $routeParams, $timeout, BudgetNotesService) {
    $scope.listId   = $routeParams.listId;
    $scope.timer;
    $scope.loaded = false;
    $scope.notes = {
        listId: $scope.listId,
        text: ''
    };

    var save = function () {
        if ($scope.loaded) {
            BudgetNotesService.save($scope.notes, function(response) {
                $scope.notes = response.data;
            });
        }
    };

    BudgetNotesService.getNotes(
        $scope.listId,
        function (response) {
            $scope.loaded = true;
            var notes = _.first(response.data);
            if (notes) {
                $scope.notes = notes;
            }
        }
    );

    $scope.change = function () {
        if ($scope.timer) {
            $timeout.cancel($scope.timer);
        }

        $scope.timer = $timeout(save, 800);
    };

    $scope.container.get('exit', function () {
        if ($scope.timer) {
            $timeout.cancel($scope.timer);
        }

        save();
    });
})

.controller('TicketController', function ($scope, $routeParams) {
    var date = new Date();
    $scope.groups = [];
    $scope.lists = [];
    $scope.shares = [];
    $scope.selectedList = null;
    $scope.ticket = Object.assign({
        listId: Number($routeParams.listId),
        date: date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear(),
        price: '',
        groups: [],
        payers: [],
        consumers: [],
        notes: ''
    }, $scope.ngDialogData.ticket);

    $scope.container.get('groups', function (groups) {
        $scope.groups = groups;
    });

    $scope.container.get('shares', function (shares) {
        $scope.shares = shares;
    });

    $scope.container.get('lists', function (lists) {
        $scope.selectedList = _.find(lists, {id: $scope.ticket.listId});
        $scope.lists = lists;
    });

    $scope.close = function () {
        $scope.$emit('TicketController:close');
    };

    $scope.delete = function () {
        $scope.$emit('TicketController:delete', $scope.ticket);
    };

    $scope.save = function () {
        if ($scope.selectedList) {
            $scope.ticket.listId = $scope.selectedList.id;
        }

        $scope.$emit('TicketController:save', $scope.ticket);
    };

    $scope.selectTicket = function () {
        $scope.$emit('TicketController:select-ticket', $scope.ticket);
    };

    $scope.groupsPickerApi = function (query, response) {
        response($scope.groups.filter(function (item) {
            return item.name.toLowerCase().search(query.toLowerCase()) !== -1;
        }));
    };

    $scope.groupsPickerItemTemplate = function () {
        return '<div>{{item.name}}</div>';
    };

    $scope.sharesPickerApi = function (query, response) {
        response($scope.shares.filter(function (item) {
            return item.userId.toLowerCase().search(query.toLowerCase()) !== -1;
        }));
    };

    $scope.sharesPickerItemTemplate = function () {
        return '<div>{{item.displayname}}</div>';
    };
})

.controller('CalculateController', function ($scope) {
    $scope.tickets = $scope.ngDialogData.tickets;
    $scope.groups  = [];
    $scope.shares  = [];

    $scope.container.get('groups', function (groups) {
        $scope.groups = groups;
    });

    $scope.container.get('shares', function (shares) {
        $scope.shares = shares;
    });

    $scope.calculateFor = function (ticket, user) {
        var result = {}, price = $scope.calculate(ticket.price);

        if (ticket.payers.find(function (payer) { return payer.id === user.id; })) {
            result.plus = $scope.getPrice((Math.floor(price / ticket.payers.length)));
        }

        if (ticket.consumers.find(function (consumer) { return consumer.id === user.id; })) {
            result.minus = '-' + $scope.getPrice((Math.floor(price / ticket.consumers.length)));
        }

        return result;
    };

    $scope.calculateSum = function (user) {
        return $scope.getPrice(Math.floor($scope.tickets.reduce(function (result, ticket) {
            var price = $scope.calculate(ticket.price);

            if (ticket.payers.find(function (payer) { return payer.id === user.id; })) {
                result += price / ticket.payers.length;
            }

            if (ticket.consumers.find(function (consumer) { return consumer.id === user.id; })) {
                result -= price / ticket.consumers.length;
            }

            return result;
        }, 0)));
    };
})
