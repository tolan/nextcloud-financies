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
class BudgetTicketsController extends Controller {

    /**
     *
     * @var Db\BudgetTicketMapper
     */
    private $_mapper;

    private $_userId;

    public function __construct($AppName, IRequest $request, Db\BudgetTicketMapper $mapper, $UserId){
        parent::__construct($AppName, $request);
        $this->_mapper      = $mapper;
        $this->_userId      = $UserId;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $listId
     */
    public function index($listId) {
        return new DataResponse($this->_mapper->find($listId, $this->_userId));
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
     * @param int    $listId
     * @param string $date
     * @param string $price
     * @param array  $groups
     * @param array  $payers
     * @param array  $consumers
     * @param string $notes
     */
    public function create($listId, $date, $price, $groups, $payers, $consumers, $notes) {
        $ticket = new Db\BudgetTicket();

        $ticket->setListId($listId);
        $ticket->setDate($date);
        $ticket->setPrice($price);
        $ticket->setGroups(json_encode($groups));
        $ticket->setPayers(json_encode($payers));
        $ticket->setConsumers(json_encode($consumers));
        $ticket->setNotes($notes);

        return new DataResponse($this->_mapper->insert($ticket));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int    $listId
     * @param string $date
     * @param string $price
     * @param array  $groups
     * @param array  $payers
     * @param array  $consumers
     * @param string $notes
     */
    public function update($id, $listId, $date, $price, $groups, $payers, $consumers, $notes) {
        try {
            $ticket = $this->_mapper->get($id, $this->_userId);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $ticket->setListId($listId);
        $ticket->setDate($date);
        $ticket->setPrice($price);
        $ticket->setGroups(json_encode($groups));
        $ticket->setPayers(json_encode($payers));
        $ticket->setConsumers(json_encode($consumers));
        $ticket->setNotes($notes);

        return new DataResponse($this->_mapper->update($ticket));
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
            $ticket = $this->_mapper->get($id, $this->_userId);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $this->_mapper->delete($ticket);

        return new DataResponse($ticket);
    }
}
