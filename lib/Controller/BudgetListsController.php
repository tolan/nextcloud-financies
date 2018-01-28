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
class BudgetListsController extends Controller {

    /**
     *
     * @var Db\BudgetListMapper
     */
    private $_mapper;

    private $_userId;

    public function __construct($AppName, IRequest $request, Db\BudgetListMapper $mapper, $UserId){
        parent::__construct($AppName, $request);
        $this->_mapper      = $mapper;
        $this->_userId      = $UserId;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $budgetId
     */
    public function index($budgetId) {
        return new DataResponse($this->_mapper->find($budgetId, $this->_userId));
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
     * @param int    $budgetId
     * @param int    $order
     */
    public function create($name, $budgetId, $order) {
        $list = new Db\BudgetList();
        $list->setName($name);
        $list->setBudgetId($budgetId);
        $list->setOrder($order);
        $list->setCreatorId($this->_userId);

        return new DataResponse($this->_mapper->insert($list));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int    $id
     * @param string $name
     * @param int    $budgetId
     * @param int    $order
     */
    public function update($id, $name, $budgetId, $order) {
        try {
            $list = $this->_mapper->get($id, $this->_userId);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $list->setName($name);
        $list->setBudgetId($budgetId);
        $list->setOrder($order);

        return new DataResponse($this->_mapper->update($list));
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
            $list = $this->_mapper->get($id, $this->_userId);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $this->_mapper->delete($list);

        return new DataResponse($list);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param array $lists
     */
    public function order($lists) {
        $result = [
            'success' => [],
            'failed'  => []
        ];

        foreach ($lists as $item) {
            try {
                $list = $this->_mapper->get($item['id'], $this->_userId);
                $list->setOrder($item['order']);

                $this->_mapper->update($list);
                $result['success'][] = $list;
            } catch (Exception $ex) {
                $result['failed'][] = $item;
            }
        }

        return new DataResponse($result);
    }
}
