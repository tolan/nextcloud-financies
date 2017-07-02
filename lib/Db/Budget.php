<?php

namespace OCA\Financies\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class Budget extends Entity implements JsonSerializable {

    protected $name;
    protected $order;
    protected $creatorId;

    public function jsonSerialize() {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'order'     => $this->order,
            'creatorId' => $this->creatorId
        ];
    }
}
