<?php

namespace OCA\Financies\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetShare extends Entity implements JsonSerializable {

    protected $budgetId;
    protected $userId;
    protected $permissions;

    public function jsonSerialize() {
        return [
            'id'          => $this->id,
            'budgetId'    => $this->budgetId,
            'userId'      => $this->userId,
            'permissions' => $this->permissions
        ];
    }
}
