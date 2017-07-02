<?php

namespace OCA\Financies\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class GroupMapper extends Mapper {

    public function __construct(IDb $db) {
        parent::__construct($db, 'ownfinancies_budgets_groups', Group::class);
    }

    public function find() {
        $sql = 'SELECT * FROM '.$this->tableName;

        return $this->findEntities($sql);
    }

    public function get($id) {
        $sql = 'SELECT * FROM '.$this->tableName.' WHERE id = ?';

        return $this->findEntity($sql, [$id]);
    }
}
