/* global _ */

angular.module('Financies')

.service('BudgetService', function ($http, AbstractService) {
    _.extend(this, AbstractService);

    this.getBudgets = function(success, error) {
        return $http.get(this._getUrl('budgets')).then(success, error);
    };

    this.save = function(budget, success, error) {
        if (budget.id) {
            return $http.put(this._getUrl('budgets/' + budget.id), budget).then(success, error);
        } else {
            return $http.post(this._getUrl('budgets'), budget).then(success, error);
        }
    };

    this.delete = function(budget, success, error) {
        return $http.delete(this._getUrl('budgets/' + budget.id)).then(success, error);
    };

    this.saveOrder = function(budgets, success, error) {
        return $http.post(this._getUrl('budgets/order'), {budgets: budgets}).then(success, error);
    };
})

.service('BudgetShareService', function ($http, AbstractService) {
    _.extend(this, AbstractService);

    this.findUser = function(query, success, error) {
        return $http.post(this._getUrl('shares/query'), {query: query}).then(success, error);
    };

    this.getShares = function(budgetId, success, error) {
        return $http.get(this._getUrl('budgets/' + budgetId + '/share')).then(success, error);
    };

    this.save = function(share, success, error) {
        if (share.id) {
            return $http.put(this._getUrl('shares/' + share.id), share).then(success, error);
        } else {
            return $http.post(this._getUrl('shares'), share).then(success, error);
        }
    };

    this.delete = function(share, success, error) {
        return $http.delete(this._getUrl('share/' + share.id)).then(success, error);
    };
})

.service('BudgetListService', function ($http, AbstractService) {
    _.extend(this, AbstractService);

    this.getLists = function(budgetId, success, error) {
        return $http.get(this._getUrl('budgets/' + budgetId + '/lists')).then(success, error);
    };

    this.save = function(list, success, error) {
        if (list.id) {
            return $http.put(this._getUrl('lists/' + list.id), list).then(success, error);
        } else {
            return $http.post(this._getUrl('lists'), list).then(success, error);
        }
    };

    this.delete = function(list, success, error) {
        return $http.delete(this._getUrl('lists/' + list.id)).then(success, error);
    };

    this.saveOrder = function(lists, success, error) {
        return $http.post(this._getUrl('lists/order'), {lists: lists}).then(success, error);
    };
})

.service('BudgetGroupsService', function ($http, AbstractService) {
    _.extend(this, AbstractService);

    this.getGroups = function(success, error) {
        return $http.get(this._getUrl('/groups')).then(success, error);
    };

    this.save = function(group, success, error) {
        if (group.id) {
            return $http.put(this._getUrl('groups/' + group.id), group).then(success, error);
        } else {
            return $http.post(this._getUrl('groups'), group).then(success, error);
        }
    };

    this.delete = function(group, success, error) {
        return $http.delete(this._getUrl('groups/' + group.id)).then(success, error);
    };
})

.service('BudgetTicketService', function ($http, AbstractService) {
    _.extend(this, AbstractService);

    this.getTickets = function(listId, success, error) {
        return $http.get(this._getUrl('lists/' + listId + '/tickets')).then(success, error);
    };

    this.save = function(ticket, success, error) {
        if (ticket.id) {
            return $http.put(this._getUrl('tickets/' + ticket.id), ticket).then(success, error);
        } else {
            return $http.post(this._getUrl('tickets'), ticket).then(success, error);
        }
    };

    this.delete = function(ticket, success, error) {
        return $http.delete(this._getUrl('tickets/' + ticket.id)).then(success, error);
    };
})

.service('BudgetNotesService', function ($http, AbstractService) {
    _.extend(this, AbstractService);

    this.getNotes = function(listId, success, error) {
        return $http.get(this._getUrl('lists/' + listId + '/notes')).then(success, error);
    };

    this.save = function(notes, success, error) {
        if (notes.id) {
            return $http.put(this._getUrl('notes/' + notes.id), notes).then(success, error);
        } else {
            return $http.post(this._getUrl('notes'), notes).then(success, error);
        }
    };
})
;