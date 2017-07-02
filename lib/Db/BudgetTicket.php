<?php

namespace OCA\Financies\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetTicket extends Entity implements JsonSerializable {

    protected $listId;
    protected $date;
    protected $price;
    protected $groups;
    protected $payers;
    protected $consumers;
    protected $notes;

    public function jsonSerialize() {
        return [
            'id'        => $this->id,
            'listId'    => $this->listId,
            'date'      => $this->date,
            'price'     => $this->price,
            'groups'    => json_decode($this->groups, true),
            'payers'    => json_decode($this->payers, true),
            'consumers' => json_decode($this->consumers, true),
            'notes'     => $this->notes
        ];
    }
}
