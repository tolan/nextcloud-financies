<?php

namespace OCA\Financies\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetShareMapper extends Mapper {

    public function __construct(IDb $db) {
        parent::__construct($db, 'ownfinancies_budgets_shares', BudgetShare::class);
    }

    public function findUsers($query, $userId) {
        $userTable  = '*PREFIX*users';
        $groupTable = '*PREFIX*group_user';

        $sql = 'SELECT DISTINCT u.uid '
            . 'FROM '.$userTable.' as u '
            . 'INNER JOIN '.$groupTable.' as gu ON gu.uid = u.uid '
            . 'INNER JOIN '.$groupTable.' as gu2 ON gu.gid = gu2.gid '
            . 'WHERE u.uid like ? AND gu2.uid = ?';

        $stmt = $this->execute($sql, ['%'.$query.'%', $userId]);
        return $stmt->fetchAll();
    }

    public function find($budgetId) {
        $sql = 'SELECT * FROM '.$this->tableName.' WHERE budget_id = ?';

        return $this->findEntities($sql, [$budgetId]);
    }

    public function get($id) {
        $sql = 'SELECT * FROM '.$this->tableName.' WHERE id = ?';

        return $this->findEntity($sql, [$id]);
    }
}
