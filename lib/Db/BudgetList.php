<?php

namespace OCA\Financies\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetList extends Entity implements JsonSerializable {

    protected $name;
    protected $budgetId;
    protected $order;
    protected $creatorId;

    public function jsonSerialize() {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'budgetId'  => $this->budgetId,
            'order'     => $this->order,
            'creatorId' => $this->creatorId
        ];
    }
}
