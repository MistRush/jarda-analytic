<?php
use Admin_Model_Product as Product;
use Admin_Model_ProductDocumment as ProductDocumment;
use Admin_Model_ProductImage as ProductImage;
use Admin_Model_ProductSimiliar as ProductSimiliar;
use Admin_Model_ProductWatchDog as ProductWatchDog;
use Admin_Model_Question as Question;
use common\logic\Email\EmailFactory;
use common\logic\Eshop\Eshop;
use common\logic\Front\Breadcrumb\ProductBreadcrumb;
use common\logic\Front\Captcha;
use default\components\Common as CommonComponent;
use default\components\Layout as LayoutComponent;
use user\logic\UserClientSession;

class ProductController extends BaseController {

    public function indexAction() {
        $request = $this->getRequest();
        $eshop = Eshop::getInstance();
        $latteParams = [];
        $product = Product::getProductBySlug($request->getParam('slug'));

        if ( !$product || !$product['Active']) {
            $this->forward('not-found', 'error', 'default');
            return;
        }

        $metaDescription = $product['MetaDescription'] ?? strip_tags(rtrim($product['Description']));
        if ( strlen($metaDescription) > 159 ) {
            if (preg_match('/^(.{1,155})\b/u', $metaDescription, $matches)) {
                $metaDescription = $matches[1] . ' ...';
            } else {
                $metaDescription = substr($metaDescription, 0, 155) . ' ...';
            }
        }

        $categoryBreadcrumb = new ProductBreadcrumb($product);
        $latteParams['product'] = $product;
        $latteParams['title'] = $product['Title'] ?? ($product['ProductName'] . (isset($product['ManufacturerParamValue']) ? (' | ' . $product['ManufacturerParamValue']) : ''));
        $latteParams['metaDescription'] = $metaDescription;
        $latteParams['metaKeywords'] = $product['ProductName'];
        if ($mainImage = ProductImage::getProductMainImage($product['ID'])) {
            $latteParams['image'] = fu($mainImage[0], 'product/800');
            $latteParams['mainImage'] = $mainImage[0];
        }
        $latteParams['productImages'] = ProductImage::getProductImages($product['ID']);
        $latteParams['productSimiliars'] = ProductSimiliar::getProductSimiliars($product['ID']);
        $latteParams['breadcrumb'] = LayoutComponent::breadcrumb($categoryBreadcrumb->getBreadcrumbItems());
        $latteParams['eshop'] = Eshop::getInstance();
        $latteParams['currentUrl'] = '/' . URL::PRODUCT . '/' . $product['slug'];
        $latteParams['freeShipping'] = CommonComponent::freeShipping();
        $latteParams['productParameters'] = self::prepareParameters($product['parameters']);
        $latteParams['productDocuments'] = ProductDocumment::getProductDocumments($product['ID']);

        $structuredData = [
            "@context" => "https://schema.org",
            "@type" => "Product",
            "name" => $product['ProductName'],
            "description" => $metaDescription,
            "offers" => [
                "@type" => "Offer",
                "itemCondition" => "https://schema.org/NewCondition",
                "availability" => "https://schema.org/InStock",
                "url" => $eshop->getSettings('ProjectURL') . '/product/' . $product['slug'],
                "price" => number_format($product['PriceWithVat'], 2),
                "priceCurrency" => "EUR",
                "priceValidUntil" => (date('Y') + 1) . "-12-31"
            ],
            "sku" => $product['Code']
        ];

        if (isset($latteParams['image'])) {
            $structuredData['image'] = $eshop->getSettings('ProjectURL') . fu($mainImage[0], 'product/800');
        }

        if (isset($product['ManufacturerParamValue'])) {
            $structuredData['brand'] = [
                "@type" => "Brand",
                "name" => $product['ManufacturerParamValue']
            ];
        }

        $latteParams['structuredData'] = json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $latteParams['product']['Description'] = html_entity_decode($latteParams['product']['Description'], ENT_QUOTES, 'UTF-8');

        $this->renderLatte($latteParams);

        //Product::updateProductViewed($product['ID'], $product['Viewed'] + 1);
    }

    public function questionAction() {
        $request = $this->getRequest();
        $params = [
            'Product_ID' => $request->getParam('Product_ID'),
            'dialog_id' => $request->getParam('dialog_id')
        ];

        $this->renderLatte($params);
    }

    public function checkUnitPriceAction() {
        $productID = $this->getRequest()->getParam('productID');
        $quantity = $this->getRequest()->getParam('quantity');
        try {
            $product = Product::getProductByID($productID, requiredQuantity: $quantity);
            $out = ['error' => false, 'PriceWithoutVat' => str_replace('.',',', $product['PriceWithoutVat']), 'PriceWithVat' => str_replace('.',',',$product['PriceWithVat'])];
        } catch (Exception $e) {
            $out = ['error' => true, 'msg' => $e->getMessage()];
        }
        echo json_encode($out);
    }

    public function processQuestionAction() {
        $out = ['error' => false, 'msg' => ""];
        $request = $this->getRequest();
        $token = $request->getParam('Token');
        $captcha = new Captcha($token);
        if ($captcha->isSuccess()) {
            $question = Question::createQuestion($this->getRequest());
            EmailFactory::sendQuestion($question);
        } else {
            $out['error'] = true;
            $out['msg'] = translate('Recaptcha validation error');
        }

        echo json_encode($out);
    }

    public function setWatchdogAction() {
        $productID = $this->getRequest()->getParam('Product_ID');
        $userID = UserClientSession::getCurrentUserID();

        if(!$userID) {
            echo json_encode(['error' => true, 'msg' => 'Pro nastavení hlídacího psa se musíte přihlásit']);
            return;
        }

        if($productID && $userID) {
            try {
                ProductWatchDog::setProductWatchDog($productID, $userID);
                echo json_encode(['error' => false, 'msg' => 'Hlídací pes byl nastaven']);

            } catch (Exception $e) {
                echo json_encode(['error' => true, 'msg' => $e->getMessage()]);
                return;
            }
        }
    }

    public function disableWatchdogAction() {
        $productID = $this->getRequest()->getParam('Product_ID');
        $userID = UserClientSession::getCurrentUserID();

        if(!$userID) {
            echo json_encode(['error' => true, 'msg' => 'Pro nastavení hlídacího psa se musíte přihlásit']);
            return;
        }

        if($productID && $userID) {
            try {
                ProductWatchDog::disableProductWatchDog($productID, $userID);
                echo json_encode(['error' => false, 'msg' => 'Hlídací pes byl zrušen']);

            } catch (Exception $e) {
                echo json_encode(['error' => true, 'msg' => $e->getMessage()]);
                return;
            }
        }
    }

    public function oldProductsSeoRedirectAction() {
        $slug = $this->getRequest()->getParam('slug');
        $product = Product::getProductByOldHistorySlug($slug);
        if (isset($product['slug']) && $product['slug']) {
            header("Location: /p/" . $product['slug'], TRUE, 301);
        } else {
            $this->forward('old-categories-seo-redirect', 'category', 'default', ['slug' => $slug]);
        }
    }



    public static function prepareParameters(array $productParameters): array {
        $productParametersOutput = [];

        foreach ( $productParameters as $productParameter ) {
            if ( isset($productParameter['parameterValue']['Value']) )
                $productParametersOutput[$productParameter['parameter']['parameterLangs'][0]['Name']][] = $productParameter['parameterValue']['Value'] . ($productParameter['parameter']['Unit'] ? ' ' . $productParameter['parameter']['Unit'] : '');
        }

        return $productParametersOutput;
    }
}