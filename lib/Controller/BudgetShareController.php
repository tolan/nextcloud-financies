<?php

namespace OCA\Financies\Controller;

use Exception;

use OCP\IRequest;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Financies\Db\BudgetShare;
use OCA\Financies\Db\BudgetShareMapper;
use OCA\Financies\Enum\Persmissions;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetShareController extends Controller {

    /**
     *
     * @var BudgetShareMapper
     */
    private $_mapper;
    private $_userId;

    public function __construct($AppName, IRequest $request, BudgetShareMapper $mapper, $UserId){
        parent::__construct($AppName, $request);
        $this->_mapper = $mapper;
        $this->_userId = $UserId;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $budgetId
     */
    public function index($budgetId) {
        return new DataResponse($this->_mapper->find($budgetId));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int    $budgetId
     * @param string $userId
     * @param int    $permissions
     */
    public function create($budgetId, $userId, $permissions = Persmissions::READ) {
        $share = new BudgetShare();
        $share->setBudgetId($budgetId);
        $share->setUserId($userId);
        $share->setPermissions($permissions);

        return new DataResponse($this->_mapper->insert($share));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int    $id
     * @param int    $budgetId
     * @param string $userId
     * @param int    $permissions
     */
    public function update($id, $budgetId, $userId, $permissions = Persmissions::READ) {
        try {
            $share = $this->_mapper->get($id);
            $share->setBudgetId($budgetId);
            $share->setUserId($userId);
            $share->setPermissions($permissions);
            $response = new DataResponse($this->_mapper->update($share));
        } catch(Exception $e) {
            $response = new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        return $response;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param string $id
     */
    public function destroy($id) {
        // TODO remove all references
        try {
            $share = $this->_mapper->get($id);
            $this->_mapper->delete($share);
            $response = new DataResponse($share);
        } catch(Exception $e) {
            $response = new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        return $response;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param string $query
     */
    public function findUser($query) {
        return new DataResponse($this->_mapper->findUsers($query, $this->_userId));
    }
}
