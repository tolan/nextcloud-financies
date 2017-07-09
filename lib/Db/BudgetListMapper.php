<?php

namespace OCA\Financies\Db;

use OCP\IDbConnection;
use OCP\AppFramework\Db\Mapper;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetListMapper extends Mapper {

    private $_shareTable = '*PREFIX*financies_shares';

    public function __construct(IDbConnection $db) {
        parent::__construct($db, 'financies_lists', BudgetList::class);
    }

    public function find($budgetId, $userId) {
        $sql = 'SELECT l.* FROM '.$this->tableName.' as l '
            . 'INNER JOIN '.$this->_shareTable.' as bs ON l.budget_id = bs.budget_id '
            . 'WHERE bs.user_id = ? AND l.budget_id = ? '
            . 'GROUP BY l.id '
            . 'ORDER BY `order` ASC';

        return $this->findEntities($sql, [$userId, $budgetId]);
    }

    public function get($id, $userId) {
        $sql = 'SELECT l.* FROM '.$this->tableName.' as l '
            . 'INNER JOIN '.$this->_shareTable.' as bs ON l.budget_id = bs.budget_id '
            . 'WHERE l.id = ? AND bs.user_id = ? '
            . 'GROUP BY l.id ';

        return $this->findEntity($sql, [$id, $userId]);
    }
}
