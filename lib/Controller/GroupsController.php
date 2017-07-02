<?php

namespace OCA\Financies\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Financies\Db;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class GroupsController extends Controller {

    /**
     *
     * @var Db\GroupMapper
     */
    private $_mapper;

    public function __construct($AppName, IRequest $request, Db\GroupMapper $mapper, $UserId){
        parent::__construct($AppName, $request);
        $this->_mapper      = $mapper;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index() {
        return new DataResponse($this->_mapper->find());
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $id
     */
    public function show($id) {
        try {
            $response = new DataResponse($this->_mapper->get($id));
        } catch(Exception $e) {
            $response = new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        return $response;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param string $name
     */
    public function create($name) {
        $group = new Db\Group();
        $group->setName($name);

        return new DataResponse($this->_mapper->insert($group));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $id
     * @param string $name
     */
    public function update($id, $name) {
        try {
            $group = $this->_mapper->get($id);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $group->setName($name);

        return new DataResponse($this->_mapper->update($group));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $id
     */
    public function destroy($id) {
        try {
            $group = $this->_mapper->get($id);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $this->_mapper->delete($group);

        return new DataResponse($group);
    }
}
