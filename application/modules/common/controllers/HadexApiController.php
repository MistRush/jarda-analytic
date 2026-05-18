<?php
use Admin_Model_ApiLog as HadexApiLog;
use common\logic\HadexApi\Resources\CategoryAttachment;
use common\logic\HadexApi\Resources\Customer;
use common\logic\HadexApi\Resources\Order;
use common\logic\HadexApi\Resources\Product;
use common\logic\HadexApi\Resources\ProductAttachment;
use common\logic\HadexApi\Resources\ProductCategory;
use common\logic\HadexApi\Resources\ProductSimple;
use common\logic\HadexApi\Resources\ProductStock;
use common\logic\HadexApi\Resources\ShippingMethod;
use User_Model_User as User;
use common\logic\HadexApi\Resources\Token;
use common\logic\HadexApi\Converters\DateTimeConverter as DateTimeConverter;

/**
 * @OA\Info(
 *     title="Hadex Evidsoft API",
 *     version="1.0")
 */
class Common_HadexApiController extends Clevis_Zend_Controller_Action {
    private array $allowedActions;
    private string $authToken;
    private HadexApiLog $logger;
    private User $user;

    public function init() {
        parent::init();
        $this->disableLayout();
        $this->logger = new HadexApiLog();
        $this->allowedActions = ['attachment', 'product', 'productAttachment', 'productCategory', 'productCategoryAttachment', 'productStock', 'productSimple', 'order', 'customer', 'shippingMethod'];
        $actionName = $this->getRequest()->getActionName();
        if ($actionName !== 'token') {
            $this->authToken = $this->getRequest()->getServer('HTTP_AUTHORIZATION') ?? $this->getRequest()->getServer('HTTPS_AUTHORIZATION');
            $this->authorize();
        }
    }

    public function __call($methodName, $args) {
        if (!in_array(substr($methodName, 0, -6), $this->allowedActions)) {
            $this->forward('error');
            return;
        }

        // Jinak zavoláme původní __call
        parent::__call($methodName, $args);
    }

    /**
     * @throws Zend_Controller_Response_Exception
     * @throws Exception
     */
    public function tokenAction() {
        $token = new Token();
        $data = $this->processRequestBody();

        $tokenResult = $token->getAccessToken($data);
        if($tokenResult['status'] === 'error' && $tokenResult['code'] === 400) {
            $this->sendBadRequest($tokenResult['message']);
            return;
        }
        if($tokenResult['status'] === 'error' && $tokenResult['code'] === 403) {
            $this->sendForbiddenResponse($tokenResult['message']);
            return;
        }
        $this->sendResponse($tokenResult);
        $this->logger::insertRecord([
            'User'=> $data['Username'],
            'Url' => htmlentities($_SERVER['REQUEST_URI']),
            'StatusCode'=> '200',
            'Message' => 'User authorized',
        ]);
        exit;
    }

    public function productAction() {
        $request = $this->getRequest();
        if($request->isGet()) {
            $productID = $request->getParam('id');
            $productCode = $request->getParam('code');
            $product = new Product();
            $result = $product->getProduct($productID, $productCode);

            if(isset($result['errorCode']) && $result['errorCode']) {
                $this->handleErrors($result);
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPut() || $request->isPost()) {
            $data = $this->processRequestBody(true);
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                $product = new Product();
                try {
                    $result[$i] = $product->processProduct($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isDelete()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                $product = new Product();
                try {
                    $result[$i] = $product->archiveProduct($dataItem);
                    if (isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }

                $i++;
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        $this->sendBadRequest('Invalid request method');
    }

    /**
     * @throws DateMalformedStringException
     * @throws Zend_Controller_Response_Exception
     */
    public function productAttachmentAction() {
        $request = $this->getRequest();
        if($request->isGet()) {
            $attachmentID = $request->getParam('id');
            $productID = $request->getParam('productId');
            $productCode = $request->getParam('productCode');
            $attachment = new ProductAttachment($attachmentID, $productID, $productCode);
            $result = $attachment->getAttachment();

            if(isset($result['errorCode']) && $result['errorCode']) {
              $this->handleErrors($result);
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPost()) {
            $data = $this->processRequestBody(true);
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                $attachment = new ProductAttachment($dataItem['id']??null, $dataItem['productId']??null, $dataItem['productCode']??null);
                try {
                    $result[$i] = $attachment->processAttachment($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPut()) {
            $data = $this->processRequestBody(true);
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                if(!isset($dataItem['id'])) {
                    $this->sendBadRequest('Attachment ID is required');
                    exit;
                }
                $attachment = new ProductAttachment($dataItem['id'], $dataItem['productId']??null, $dataItem['productCode']??null);
                try {
                    $result[$i] = $attachment->processAttachment($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }

                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }
    }

    public function productCategoryAttachmentAction() {
        $request = $this->getRequest();
        if($request->isGet()) {
            $attachmentID = $request->getParam('id');
            $categoryID = $request->getParam('categoryId');
            $categoryCode = $request->getParam('categoryCode');
            $attachment = new CategoryAttachment($attachmentID, $categoryID, $categoryCode);
            $result = $attachment->getAttachment();

            if(isset($result['errorCode']) && $result['errorCode']) {
                $this->handleErrors($result);
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPost()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                $attachment = new CategoryAttachment($dataItem['id']??null, $dataItem['categoryId']??null, $dataItem['categoryCode']??null);
                try {
                    $result[$i] = $attachment->processAttachment($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPut()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                if(!isset($dataItem['id'])) {
                    $this->sendBadRequest('Attachment ID is required');
                    exit;
                }
                $attachment = new CategoryAttachment($dataItem['id'], $dataItem['categoryId']??null, $dataItem['categoryCode']??null);
                try {
                    $result[$i] = $attachment->processAttachment($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }
    }

    /**
     * @throws Exception
     */
    public function productCategoryAction() {
        //TODO: jak má fungovat query parametr filter? Využívá ho vůbec nekdo?
        $request = $this->getRequest();
        if($request->isGet()) {
            $categoryID = $request->getParam('id');
            $filter = $request->getParam('filter');
            $changedSince = $request->getParam('ChangedSince');
            $productCategory = new ProductCategory($categoryID);
            $result = $productCategory->getProductCategories($filter, $changedSince);
            if(isset($result['errorCode']) && $result['errorCode']) {
                $this->handleErrors($result);
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isDelete()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                if(!isset($dataItem['id'])) {
                    $this->sendBadRequest('Category ID is required');
                    exit;
                }
                $productCategory = new ProductCategory($dataItem['id']);
                $result[$i] = $productCategory->archiveCategory();
                if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                    $this->handleErrors($result[$i]);
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPut()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                if(!isset($dataItem['id'])) {
                    $this->sendBadRequest('Category ID is required');
                    exit;
                }
                $productCategory = new ProductCategory($dataItem['id']);
                $result[$i] = $productCategory->updateProductCategory($dataItem);
                if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                    $this->handleErrors($result[$i]);
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPost()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                $productCategory = new ProductCategory();
                $result[$i] = $productCategory->createProductCategory($dataItem);
                if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                    $this->handleErrors($result[$i]);
                }
                $i++;
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }
    }

    public function productStockAction() {
        $request = $this->getRequest();
        if($request->isGet()) {
            $productStockID = $request->getParam('id');
            $productID = $request->getParam('productId');
            $productCode = $request->getParam('productCode');
            $productStock = new ProductStock($productStockID, $productID, $productCode);
            $result = $productStock->getProductStock();

            if(isset($result['errorCode']) && $result['errorCode']) {
                $this->handleErrors($result);
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPost() || $request->isPut()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                $attachment = new ProductStock($dataItem['id']??null, $dataItem['productId']??null, $dataItem['productCode']??null);
                try {
                    $result[$i] = $attachment->processProductStock($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }
    }

    public function productSimpleAction() {
        $request = $this->getRequest();
        if($request->isGet()) {
            try {
                $productSimple = new ProductSimple();
                $result = $productSimple->getProductSimple();
                if(isset($result['errorCode']) && $result['errorCode']) {
                    $this->handleErrors($result);
                }
                $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
                $this->sendResponse($result);
                exit;
            } catch (Exception $e) {
                $this->sendBadRequest($e->getMessage());
                exit;
            }
        } else {
            $this->sendBadRequest('Invalid request method');
        }

    }

    /**
     * @throws DateMalformedStringException
     * @throws Zend_Controller_Response_Exception
     */
    public function orderAction() {
        $request = $this->getRequest();
        if($request->isGet()) {
            $orderID = $request->getParam('id');
            $changedSince = $request->getParam('changedSince');
            if($changedSince) {
                $changedSince = DateTimeConverter::convertUtcToMySqlFormat($changedSince);
            }
            if(!$orderID && !$changedSince) {
                $changedSince = date('Y-m-d H:i:s', strtotime('-1 day'));
            }
            $order = new Order($orderID??null);
            $result = $order->getOrders(null, $changedSince);

            if(isset($result['errorCode']) && $result['errorCode']) {
                $this->handleErrors($result);
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }
        if($request->isPut()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                if(!isset($dataItem['id'])) {
                    $this->sendBadRequest('Order ID is required');
                    exit;
                }
                try {
                    $order = new Order($dataItem['id']);
                    $result[$i] = $order->updateOrder($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        $this->sendBadRequest('Invalid request method');
    }

    public function customerAction() {
        $request = $this->getRequest();
        if($request->isGet()) {
            $customerID = $request->getParam('id');
            $changedSince = $request->getParam('changedSince');
            if($changedSince) {
                $changedSince = DateTimeConverter::convertUtcToMySqlFormat($changedSince);
            }
            if(!$customerID && !$changedSince) {
                $changedSince = date('Y-m-d H:i:s', strtotime('-1 day'));
            }
            $customer = new Customer($customerID??null);
            $result = $customer->getCustomers(null, $changedSince);

            if(isset($result['errorCode']) && $result['errorCode']) {
                $this->handleErrors($result);
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPost()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                try {
                    $customer = new Customer();
                    $result[$i] = $customer->createCustomer($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                    $i++;
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPut()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                if(!isset($dataItem['id']) && !isset($dataItem['externalId'])) {
                    $this->sendBadRequest('Customer ID or ExternalId is required');
                    exit;
                }
                try {
                    $customer = new Customer($dataItem['id']);
                    $result[$i] = $customer->updateCustomer($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        $this->sendBadRequest('Invalid request method');
    }

    /**
     * @throws Doctrine_Query_Exception
     * @throws Zend_Controller_Response_Exception
     */
    public function shippingMethodAction() {
        $request = $this->getRequest();
        if($request->isGet()) {
            $shippingID = $request->getParam('id');

            $shippingMethod = new ShippingMethod($shippingID??null);
            $result = $shippingMethod->getShippingMethods();

            if(isset($result['errorCode']) && $result['errorCode']) {
                $this->handleErrors($result);
                exit;
            }
            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPost()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                try {
                    $shippingMethod = new ShippingMethod();
                    $result[$i] = $shippingMethod->createShippingMethod($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        if($request->isPut()) {
            $data = $this->processRequestBody();
            $result = [];
            $i=0;
            foreach($data as $dataItem) {
                if(!isset($dataItem['id']) && !isset($dataItem['externalId'])) {
                    $this->sendBadRequest('ID or ExternalId is required');
                    exit;
                }
                try {
                    $shippingMethod = new ShippingMethod($dataItem['id']??null);
                    $result[$i] = $shippingMethod->updateShippingMethod($dataItem);
                    if(isset($result[$i]['errorCode']) && $result[$i]['errorCode']) {
                        $this->handleErrors($result[$i]);
                    }
                } catch (Exception $e) {
                    $this->sendBadRequest($e->getMessage());
                    exit;
                }
                $i++;
            }

            $this->logger->log(200, mb_substr(json_encode($result, JSON_UNESCAPED_UNICODE), 0, 1000));
            $this->sendResponse($result);
            exit;
        }

        $this->sendBadRequest('Invalid request method');
    }



    /**
     * @throws Zend_Controller_Response_Exception
     */
    public function errorAction(): void {
        $this->sendNotFoundResponse('Action does not exist');
    }

    /**
     * @throws Zend_Controller_Response_Exception
     */
    private function authorize(): void {
        if (empty($this->authToken)) {
            $this->sendUnauthorizedResponse('Unauthorized');
            $this->logger->log(401, 'Empty auth token', [], ['error' => 'Unauthorized']);
            exit;
        }
        try {
            $this->authToken = str_replace('Bearer ', '', $this->authToken);
            $token = new Token();
            $userPayload = $token->checkToken($this->authToken);
            if(isset($userPayload['status']) && $userPayload['status'] === 'error' && $userPayload['code'] === 403) {
                $this->sendForbiddenResponse($userPayload['message']);
                exit;
            }
            $this->user = User::getUserForApiLogin($userPayload['iss']);
        } catch (Exception $e) {
            $this->sendUnauthorizedResponse('Unauthorized');
            $this->logger->log(401, 'Unauthorized', [], ['error' => 'Unauthorized']);
            exit;
        }
    }

    private function processRequestBody(bool $debug = false): array {
        $requestBody = $this->getRequest()->getRawBody();
        $data = json_decode($requestBody, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->sendBadRequest('Invalid JSON');
            exit;
        }
        if ($debug) {
            $this->debug('Request body: ' . $requestBody);
        }
        return $data;
    }


    /**
     * @return void
     * @throws Zend_Controller_Response_Exception
     */
    private function sendNotFoundResponse($errorDescription): void {
        $response = $this->getResponse()->setHttpResponseCode(404);
        $response->setHeader('Content-Type', 'application/json');
        echo Zend_Json::encode(['status'=> 'not found', 'code'=>404, 'message' => $errorDescription]);
        $response->sendResponse();
    }

    /**
     * @param array $result
     * @return void
     */
    private function sendResponse(array $result): void {
        header('Content-Type: application/json');
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return void
     * @throws Zend_Controller_Response_Exception
     */
    private function sendBadRequest($errorMessage): void {
        $response = $this->getResponse()->setHttpResponseCode(400);
        $response->setHeader('Content-Type', 'application/json');
        echo Zend_Json::encode(['status'=> 'bad request', 'code'=>400, 'message' => $errorMessage]);
        $response->sendResponse();
    }

    /**
     * @return void
     * @throws Zend_Controller_Response_Exception
     */
    private function sendUnauthorizedResponse($errorMessage): void {
        $response = $this->getResponse()->setHttpResponseCode(401);
        $response->setHeader('Content-Type', 'application/json');
        echo Zend_Json::encode(['status'=> 'unauthorized', 'code'=>401, 'message' => $errorMessage]);
        $response->sendResponse();
    }

    /**
     * @return void
     * @throws Zend_Controller_Response_Exception
     */
    private function sendForbiddenResponse($errorMessage): void {
        $response = $this->getResponse()->setHttpResponseCode(403);
        $response->setHeader('Content-Type', 'application/json');
        echo Zend_Json::encode(['status'=> 'forbidden', 'code'=>403, 'message' => $errorMessage]);
        $response->sendResponse();
    }

    /**
     * @return void
     * @throws Zend_Controller_Response_Exception
     */
    public function sendConflictRequest($errorDescription): void {
        $response = $this->getResponse()->setHttpResponseCode(409);
        $response->setHeader('Content-Type', 'application/json');
        echo Zend_Json::encode(['status'=> 'conflict', 'code'=>409, 'message' => $errorDescription]);
        $response->sendResponse();
    }

    /**
     * @return void
     * @throws Zend_Controller_Response_Exception
     */
    public function sendInternalServerError($errorMessage): void {
        $response = $this->getResponse()->setHttpResponseCode(500);
        $response->setHeader('Content-Type', 'application/json');
        echo Zend_Json::encode(['status'=> 'internal server error', 'code'=>500, 'message' => $errorMessage]);
        $response->sendResponse();
    }

    /**
     * @throws Zend_Controller_Response_Exception
     */
    private function handleErrors(array $result) {
        if (isset($result['errorCode']) && $result['errorCode'] === 400) {
            $this->sendBadRequest($result['message']);
            $this->logger->log(400, 'Bad request', [], ['error' => $result['message']]);
            exit;
        } elseif (isset($result['errorCode']) && $result['errorCode'] === 401) {
            $this->sendUnauthorizedResponse($result['message']);
            $this->logger->log(401, 'Unauthorized', [], ['error' => $result['message']]);
            exit;
        } elseif (isset($result['errorCode']) && $result['errorCode'] === 404) {
            $this->sendNotFoundResponse($result['message']);
            $this->logger->log(404, 'Not found', [], ['error' => $result['message']]);
            exit;
        } elseif (isset($result['errorCode']) && $result['errorCode'] === 403) {
            $this->sendForbiddenResponse($result['message']);
            $this->logger->log(403, 'Forbidden', [], ['error' => $result['message']]);
            exit;
        } elseif (isset($result['errorCode']) && $result['errorCode'] === 409) {
            $this->sendConflictRequest($result['message']);
            $this->logger->log(409, 'Duplicated data', [], ['error' => $result['message']]);
            exit;
        } else {
            $this->sendInternalServerError($result['message']);
            $this->logger->log(500, 'Error', [], ['error' => $result['message']]);
            exit;
        }
    }

    function debug($message): void {
        $filename = APPLICATION_PATH.'/../data/log/hadex-api/debug_' . date('Y-m-d') . '.txt';
        $logEntry = date('H:i:s') . ' - ' . $message . PHP_EOL;
        file_put_contents($filename, $logEntry, FILE_APPEND);
    }

}
