<?php

namespace OCA\Financies\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class Group extends Entity implements JsonSerializable {

    protected $name;
    protected $creatorId;

    public function jsonSerialize() {
        return [
            'id'        => $this->id,
            'name'      => $this->name
        ];
    }
}
