<?php

namespace OCA\Financies\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetNotesMapper extends Mapper {

    private $_listMapper;

    public function __construct(IDb $db) {
        $this->_listMapper = new BudgetListMapper($db);
        parent::__construct($db, 'ownfinancies_budgets_notes', BudgetNotes::class);
    }

    public function find($listId, $userId) {
        $this->_listMapper->get($listId, $userId);

        $sql = 'SELECT * FROM '.$this->tableName.' WHERE list_id = ?';

        return $this->findEntities($sql, [$listId]);
    }

    public function get($listId, $userId) {
        $this->_listMapper->get($listId, $userId);

        $sql = 'SELECT * FROM '.$this->tableName.' WHERE id = ?';

        return $this->findEntity($sql, [$listId]);
    }
}
