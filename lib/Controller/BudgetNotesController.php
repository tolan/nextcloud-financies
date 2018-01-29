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
class BudgetNotesController extends Controller {

    /**
     *
     * @var Db\BudgetNotesMapper
     */
    private $_mapper;

    private $_userId;

    public function __construct($AppName, IRequest $request, Db\BudgetNotesMapper $mapper, $UserId){
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
     * @param string $text
     */
    public function create($listId, $text) {
        $notes = new Db\BudgetNotes();

        $notes->setListId($listId);
        $notes->setText($text);

        return new DataResponse($this->_mapper->insert($notes));
        }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int    $listId
     * @param string $text
     */
    public function update($listId, $text) {
        try {
            $notes = $this->_mapper->get($listId, $this->_userId);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $notes->setListId($listId);
        $notes->setText($text);

        return new DataResponse($this->_mapper->update($notes));
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     *
     * @param int $id
     */
    public function destroy($id) {
        try {
            $notes = $this->_mapper->get($id, $this->_userId);
        } catch(Exception $e) {
            return new DataResponse([], Http::STATUS_NOT_FOUND);
        }

        $this->_mapper->delete($notes);

        return new DataResponse($notes);
    }
}
