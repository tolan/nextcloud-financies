<?php

namespace OCA\Financies\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetNotes extends Entity implements JsonSerializable {

    protected $name;
    protected $listId;
    protected $text;

    public function jsonSerialize() {
        return [
            'id'     => $this->id,
            'listId' => $this->listId,
            'text'   => $this->text
        ];
    }
}
