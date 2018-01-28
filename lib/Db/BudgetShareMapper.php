<?php

namespace OCA\Financies\Db;

use OCP\IDbConnection;
use OCP\AppFramework\Db\Mapper;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetShareMapper extends Mapper {

    public function __construct(IDbConnection $db) {
        parent::__construct($db, 'financies_shares', BudgetShare::class);
    }

    public function findUsers($query, $userId) {
        $userTable  = '*PREFIX*users';
        $groupTable = '*PREFIX*group_user';

        $sql = 'SELECT DISTINCT u.uid, u.displayname '
            . 'FROM '.$userTable.' as u '
            . 'INNER JOIN '.$groupTable.' as gu ON gu.uid = u.uid '
            . 'INNER JOIN '.$groupTable.' as gu2 ON gu.gid = gu2.gid '
            . 'WHERE (LOWER(u.uid) like ? OR LOWER(u.displayname) like ?) AND gu2.uid = ? ';

        $stmt = $this->execute($sql, ['%'.strtolower($query).'%', '%'.strtolower($query).'%', $userId]);
        return $stmt->fetchAll();
    }

    public function find($budgetId) {
        $userTable = '*PREFIX*users';

        $sql = 'SELECT fs.*, u.displayname FROM '.$this->tableName.' as fs '
            . 'INNER JOIN '.$userTable.' as u ON fs.user_id = u.uid '
            . 'WHERE budget_id = ?';

        return $this->findEntities($sql, [$budgetId]);
    }

    public function get($id) {
        $sql = 'SELECT * FROM '.$this->tableName.' WHERE id = ?';

        return $this->findEntity($sql, [$id]);
    }
}
