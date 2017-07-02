<?php

namespace OCA\Financies\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetMapper extends Mapper {

    private $_shareTable = '*PREFIX*ownfinancies_budgets_shares';

    public function __construct(IDb $db) {
        parent::__construct($db, 'ownfinancies_budgets', Budget::class);
    }

    public function find($userId) {
        $sql = 'SELECT b.* FROM '.$this->tableName.' as b'
            . ' INNER JOIN '.$this->_shareTable.' as bs ON b.id = bs.budget_id'
            . ' WHERE bs.user_id = ?'
            . ' GROUP BY b.id'
            . ' ORDER BY `order` ASC';

        return $this->findEntities($sql, [$userId]);
    }

    public function get($id, $userId) {
        $sql = 'SELECT b.* FROM '.$this->tableName.' as b'
            . ' INNER JOIN '.$this->_shareTable.' as bs ON b.id = bs.budget_id'
            . ' WHERE b.id = ? AND bs.user_id = ?'
            . ' GROUP BY b.id';

        return $this->findEntity($sql, [$id, $userId]);
    }
}
