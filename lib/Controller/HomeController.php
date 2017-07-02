<?php

namespace OCA\Financies\Controller;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Controller;

class HomeController extends Controller {

    /**
     * CAUTION: the @Stuff turns off security checks; for this page no admin is
     *          required and no CSRF check. If you don't know what CSRF is, read
     *          it up in the docs or you might create a security hole. This is
     *          basically the only required method to add this exemption, don't
     *          add it to any other method if you don't exactly know what it does
     *
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index() {
        return new TemplateResponse('financies', 'index');  // templates/index.php
    }
}
