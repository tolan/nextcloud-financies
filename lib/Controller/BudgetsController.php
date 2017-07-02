<?php

namespace OCA\Financies\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Financies\Db;
use OCA\Financies\Enum\Persmissions;

/**
 * This file defines class for
 *
 * @author Martin Kovar <mkovar86@gmail.com>
 */
class BudgetsController extends Controller {

    /**
     *
     * @var Db\BudgetMapper
     */
    private $_mapper;

    /**
     *
     * @var Db\BudgetShareMapper
     */
    private $_shareMapper;

    private $_userId;

    public function __construct($AppName, IRequest $request, Db\BudgetMapper $mapper, Db\BudgetShareMapper $shareMapper, $UserId){
        parent::__construct($AppName, $request);
        $this->_mapper      = $mapper;
        $this->_shareMapper = $shareMapper;
        $this->_userId      = $UserId;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index() {
        return new DataResponse($this->_mapper->find($this->_userId));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $id
     */
    public function show($id) {
        try {
            $response = new DataResponse($this->_mapper->get($id, $this->_userId));
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
     * @param int    $order
     */
    public function create($name, $order) {
        $budget = new Db\Budget();
        $budget->setName($name);
        $budget->setOrder($order);
        $budget->setCreatorId($this->_userId);

        $budget = $this->_mapper->insert($budget);

        $response = new DataResponse($budget);

        $share = new Db\BudgetShare();
        $share->setBudgetId($budget->getId());
        $share->setUserId($this->_userId);
        $share->setPermissions(Persmissions::READ);

        $this->_shareMapper->insert($share);

        return $response;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $id
     * @param string $name
     * @param int    $order
     */
    public function update($id, $name, $order) {
        try {
            $budget = $this->_mapper->get($id, $this->_userId);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $budget->setName($name);
        $budget->setOrder($order);

        return new DataResponse($this->_mapper->update($budget));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $id
     */
    public function destroy($id) {
        // TODO remove all references
        try {
            $budget = $this->_mapper->get($id, $this->_userId);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $this->_mapper->delete($budget);

        return new DataResponse($budget);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param array $budgets
     */
    public function order($budgets) {
        $result = [
            'success' => [],
            'failed'  => []
        ];

        foreach ($budgets as $item) {
            try {
                $budget = $this->_mapper->get($item['id'], $this->_userId);
                $budget->setOrder($item['order']);

                $this->_mapper->update($budget);
                $result['success'][] = $budget;
            } catch (Exception $ex) {
                $result['failed'][] = $item;
            }
        }

        return new DataResponse($result);
    }
}
