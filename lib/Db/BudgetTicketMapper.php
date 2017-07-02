<?php

namespace OCA\Financies\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetTicketMapper extends Mapper {

    private $_listMapper;

    public function __construct(IDb $db) {
        $this->_listMapper = new BudgetListMapper($db);
        parent::__construct($db, 'ownfinancies_budgets_tickets', BudgetTicket::class);
    }

    public function find($listId, $userId) {
        $this->_listMapper->get($listId, $userId);
        $sql = 'SELECT * FROM '.$this->tableName.' WHERE list_id = ?';

        return $this->findEntities($sql, [$listId]);
    }

    public function get($id, $userId) {
        $sql    = 'SELECT * FROM '.$this->tableName.' WHERE id = ?';
        $entity = $this->findEntity($sql, [$id]);
        $this->_listMapper->get($entity->getListId(), $userId);

        return $entity;
    }
}
