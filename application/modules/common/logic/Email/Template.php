<?php
namespace common\logic\Email;

use Admin_Model_OrderState as OrderState;
use Admin_Model_Question as Question;
use Admin_Model_Address as Address;
use Admin_Model_Feedback as Feedback;
use Admin_Model_Complaint as Complaint;
use Common_Model_Country as Country;
use Admin_Model_FeedbackFile as FeedbackFile;
use Admin_Model_FeedbackState as FeedbackState;
use common\logic\Eshop\Eshop;
use Common_Model_File as File;
use Defr\QRPlatba\QRPlatba;
use MiladRahimi\Jwt\Exceptions\JsonEncodingException;
use MiladRahimi\Jwt\Exceptions\SigningException;
use User_Model_User as User;
use Zend_Controller_Request_Abstract;

class Template extends TemplateFactory  {

    /**
     * Render Register Email
     *
     * @param User $user
     *
     * @return string
     */
    public static function renderRegister(User $user): string {
        $params = [
            'header_img' => self::eimg('user'),
            'user' => $user,
            'invoiceAddress' => \Admin_Model_Address::getMainAddress($user->ID, Address::TYPE_INVOICE),
        ];

        return self::render('register', $params);
    }

    /**
     * Render email with url for new password
     *
     * @param array $user
     * @param string $hash
     * @return string
     */
    public static function renderLostPassword(array $user, string $hash): string {
        $params = [
//            'header_img' => self::eimg('password'),
            'user' => $user,
            'hash' => $hash,
        ];

        return self::render('lost-password', $params);
    }

    /**
     * Render feedbacku
     *
     * @param Feedback $feedback
     * @param string $type
     * @param FeedbackState|null $state
     * @return string
     */
    public static function feedback(Feedback $feedback, string $type, ?FeedbackState $state = null): string {
        $blue_color = "#0076be";
        $totalAttachSize = 0;
        $attachments = [];
        $files = [];

        /** @var FeedbackFile $file */
        foreach ($feedback->feedbackFiles as $file) {
            $filePath = File::TYPE_FEEDBACK_ATTACHMENT_FOLDER . $file->file->Name . '.' . $file->file->Extension;
            if (file_exists($filePath))
                $totalAttachSize += filesize($filePath);
            $attachments[] = [$filePath, $file->file->getFileName()];
            $files[] = "<a style='color:{$blue_color};font-size:12px;line-height:1.5;' href='{$feedback->eshop->getURL()}/common/file/download?ID={$file->file->ID}'>{$file->file->getFileName()}</a>";
        }

        $params = [
            'header_img' => self::eimg('note'),
            'feedback' => $feedback,
            'authorSolver' => $feedback->getAuthorSolver(true),
            'type' => $type,
            'state' => $state,
            'states' => FeedbackState::getStates(),
            'files' => $files,
            'attachments' => $attachments,
            'totalAttachSize' => $totalAttachSize,
        ];

        return self::render(null, $params, null, 1);
    }

    /**
     * Render Question
     *
     * @param Question $question
     * @return string
     */
    public static function renderQuestion(Question $question): string {
        $eshop = Eshop::getInstance()->getEshop();
        $productInfo = \Admin_Model_ProductEshop::getProductSlugAndNameByEshop($question->Product_ID, $eshop);
        $params = [
            'header_img' => self::eimg('user'),
            'question' => $question,
            'productSlug' => $productInfo['Slug'],
            'productName' => $productInfo['Name']
        ];

        return self::render('question', $params);
    }

    /**
     * Render Seller Inquiry
     *
     * @param Zend_Controller_Request_Abstract $info
     * @return string
     */
    public static function renderCustomerOrderQuestion(Zend_Controller_Request_Abstract $info, string $userEmail): string {
        $params = [
            'OrderID' => $info->getParam('OrderID'),
            'OrderNumber' => $info->getParam('OrderNumber'),
            'User' => $userEmail,
            'Message' => $info->getParam('Message'),
        ];

        return self::render('customer-order-question', $params);
    }

    /**
     * Render Question
     *
     * @param array $content
     * @return string
     */
    public static function renderMassEmail(string $content): string {
        $eshop = Eshop::getInstance()->getEshop();
        $params = [
            'eshop' => $eshop,
            'header_img' => self::eimg('user'),
            'content' => $content,
        ];

        return self::render('massEmail', $params);
    }

    /**
     * Render OrderState Email
     *
     * @param OrderState $orderState
     * @return string
     */
    public static function renderOrderState(OrderState $orderState): string {
        $order = $orderState->order;


//        $qrPlatba = new QRPlatba();
//        $qrPlatba->setAccount('xxxxxxxxxx/xxxx'); // nastavení č. účtu
//        $qrPlatba->setVariableSymbol($order->OrderNumber);
//        $qrPlatba->setAmount($order->PriceTotalWithVat);
//        $qrPlatba->setCurrency('CZK');
//        $qrPlatba->setDueDate(new \DateTime());
//        $qrPlatba->getQRCodeImage();
//
//        $fileURL = 'files/qrcodes/' . $order->OrderNumber . '.jpg';
//
//        $ifp = fopen($fileURL, 'wb' );
//        $data = explode( ',', $qrPlatba->getQRCodeImage(false, 120) );
//        fwrite( $ifp, base64_decode( $data[ 1 ] ) );
//        fclose( $ifp );

        $params = [
            'header_img' => self::eimg('order'),
            'orderState' => $orderState,
//            'qrPlatba' => '<img src="https://www.hadex.cz/' . $fileURL . '">'
        ];

        return self::render('order', $params, $orderState->order->eshop);
    }

    /**
     * Render OrderState Email
     *
     * @return string
     */
    public static function renderCertificate(): string {

        return self::render('certificate');
    }

    /**
     * Render Seller Inquiry
     *
     * @param Zend_Controller_Request_Abstract $contactUsInfo
     * @return string
     */
    public static function renderContactUs(Zend_Controller_Request_Abstract $contactUsInfo): string {
        $params = [
            'name' => $contactUsInfo->getParam('Name'),
            'email' => $contactUsInfo->getParam('Email'),
            'message' => $contactUsInfo->getParam('Message'),
        ];

        return self::render('contact-us', $params);
    }

    /**
     * Render Seller Inquiry
     *
     * @param Zend_Controller_Request_Abstract $contactUsInfo
     * @return string
     */
    public static function renderMainContactUs(Zend_Controller_Request_Abstract $contactUsInfo): string {
        $params = [
            'name' => $contactUsInfo->getParam('Name'),
            'email' => $contactUsInfo->getParam('Email'),
            'message' => $contactUsInfo->getParam('Message'),
            'company' => $contactUsInfo->getParam('Company'),
            'subject' => $contactUsInfo->getParam('Subject'),
        ];

        return self::render('main-contact-us', $params);
    }

    public static function renderWatchDogNotification(User $user, array $productsToBeReported) {
        $params = [
            'user' => $user,
            'productsToBeReported' => $productsToBeReported,
        ];

        return self::render('watch-dog-notification', $params);
    }

    public static function renderComplaint(Complaint $complaint): string {
        $eshop = Eshop::getInstance()->getEshop();
        $deliveryCountry = $complaint->DeliveryCountry_ID?Country::getCountryByID($complaint->DeliveryCountry_ID): null;
        $invoiceCountry = $complaint->InvoiceCountry_ID?Country::getCountryByID($complaint->InvoiceCountry_ID):null;
        $params = [
            'header_img' => self::eimg('complaint'),
            'complaint' => $complaint,
            'eshop' => $eshop,
            'deliveryCountry' => $deliveryCountry,
            'invoiceCountry' => $invoiceCountry,

        ];

        return self::render('complaint', $params, $eshop);
    }

    public static function renderMissingProductCodesInEshop(array $missingCodesInEshop): string {
        $params = [
            'missingCodesInEshop' => $missingCodesInEshop,
        ];

        return self::render('missing-product-codes-in-eshop', $params);
    }

    /**
     * @throws SigningException
     * @throws JsonEncodingException
     * @throws \Exception
     */
    public static function renderRegisterConfirmation(User $user, string $token): string {
        $params = [
            'header_img' => self::eimg('user'),
            'user' => $user,
            'token' => $token
        ];

        return self::render('register-confirmation', $params);
    }
}