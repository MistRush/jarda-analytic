<?php
namespace common\logic\Email;

use Admin_Model_Feedback as Feedback;
use Admin_Model_FeedbackState as FeedbackState;
use Admin_Model_OrderState as OrderState;
use Admin_Model_Question as Question;
use Admin_Model_Complaint as Complaint;
use common\logic\Eshop\Eshop;
use common\logic\Tokenizer;
use PHPMailer\PHPMailer\Exception;
use User_Model_User as User;
use Zend_Controller_Request_Abstract;


class EmailFactory {

    /**
     * @param User $user
     */
    public static function sendRegister(User $user) {
        $subject = Template::subject('[SHOP] ' . 'Nová registrace na webu');
        $body = Template::renderRegister($user);

        $receivers = [];
        $receivers[] = $user->Name;

        if ($notifyEmail = Eshop::getInstance()->getSettings('NotifyEmail'))
            $receivers[] = $notifyEmail;

        Email::sendEmail($subject, $body, $receivers);
    }

    /**
     * @param string $email
     * @param string $password
     */
    public static function sendLostPassword(array $user, string $hash) {
        $subject = Template::subject('[SHOP] ' . translate('Obnova hesla'));
        $body = Template::renderLostPassword($user, $hash);

        Email::sendEmail($subject, $body, $user[0]['Name']);
    }


    /**
     * @param Question $question
     */
    public static function sendQuestion(Question $question) {
        $subject = Template::subject('[SHOP] ' . translate('Dotaz na serveru'));
        $body = Template::renderQuestion($question);

        $receivers[] = Email::getDeveloperEmail();
        if ($notifyEmail = Eshop::getInstance()->getSettings('NotifyEmail'))
            $receivers[] = $notifyEmail;

        Email::sendEmail($subject, $body, $receivers);
    }

    public static function sendCustomerOrderQuestion(Zend_Controller_Request_Abstract $info) {
        $subject = Template::subject('[SHOP] ' . translate('Zpráva od zákazníka ohledně objednávky č. ') . $info->getParam('OrderNumber'));
        $userEmail = \User_Model_User::getUser($info->getParam('UserID'))['Name'];
        $body = Template::renderCustomerOrderQuestion($info, $userEmail);

        $receivers[] = Email::getDeveloperEmail();
        if ($notifyEmail = Eshop::getInstance()->getSettings('NotifyEmail'))
            $receivers[] = $notifyEmail;

        if ($info->getParam('Email'))
            $receivers[] = $userEmail;

        Email::sendEmail($subject, $body, $receivers, ['reply' => $userEmail, 'replyName' => $userEmail]);
    }

    /**
     * @param array $attributes
     */
    public static function sendMassEmail(array $attributes) {
        $eshop = \Common_Model_Eshop::getEshopByID($attributes['Eshop_ID']);
        $subject = Template::subject('[SHOP] ' . $attributes['Subject']);
        $body = Template::renderMassEmail($attributes['Content']);
        $receivers = User::getAllUserEmails($attributes['Eshop_ID']);

        $receivers[] = Email::getDeveloperEmail();
        if ($attributes['TestMail']) {
            $receivers = [$attributes['TestMail']];
        }

        Email::sendEmail($subject, $body, $receivers, ['senderEmail' => $eshop->settings->ContactEmail, 'senderName' => $eshop->Name, 'reply' => $eshop->settings->ContactEmail, 'replyName' => $eshop->Name, 'massEmail' => true]);
    }


    public static function sendConfirmRegistrationEmail(User $user) {
        $subject = Template::subject('[SHOP] ' . translate('Potvrzení registrace'));
        $token = Tokenizer::generateToken(['ID' => $user->ID, 'Name'=> $user->Name]);

        $body = Template::renderRegisterConfirmation($user, $token);

        $receivers = [];
        $receivers[] = $user->Name;

        Email::sendEmail($subject, $body, $receivers);
    }


    /**
     * @param string $certificate
     */
    public static function sendCertificate(string $certificate, string $email) {
        $subject = Template::subject('[SHOP] ' . translate('Váš certifikát'));
        $body = Template::renderCertificate();

//        $receivers[] = Email::getDeveloperEmail();
//        if ( $notifyEmail = Eshop::getInstance()->getSettings('NotifyEmail') )
//            $receivers[] = $notifyEmail;
        $receivers[] = $email;

        Email::sendEmail($subject, $body, $receivers, ['stringAttachmentType' => 'application/pdf', 'stringAttachmentName' => 'certifikat.pdf', 'stringAttachment' => $certificate]);
    }

    /**
     * @param OrderState $orderState
     */
    public static function sendOrderState(OrderState $orderState, $invoice = null) {
        $subject = '[SHOP] ' . $orderState->orderStateType->getLang($orderState->order->eshop->Language_ID)->EmailHeader;
        $subject = Template::subject($subject, ['number' => $orderState->order->OrderNumber], $orderState->order->eshop);
        $body = Template::renderOrderState($orderState);
        $eshop = $orderState->order->eshop;

//        $attachment = ['file' => APPLICATION_PATH . "/../www/files/documments/gdpr.pdf", 'name' => 'GDPR.pdf'];
//        $attachments[] = $attachment;
//        $attachment = ['file' => APPLICATION_PATH . "/../www/files/documments/reklamacni-rad.pdf", 'name' => 'Reklamační řád.pdf'];
//        $attachments[] = $attachment;
//        $attachment = ['file' => APPLICATION_PATH . "/../www/files/documments/souhlas-se-zpracovanim-osobnich-udaju.pdf", 'name' => 'Souhlas se zpracováním osobních údajů.pdf'];
//        $attachments[] = $attachment;
//        $attachment = ['file' => APPLICATION_PATH . "/../www/files/documments/vseobecne-obchodni-podminky.pdf", 'name' => 'Všeobecné obchodní podmínky.pdf'];
//        $attachments[] = $attachment;
//        $attachment = ['file' => APPLICATION_PATH . "/../www/files/documments/vzorovy-formular-pro-odstoupeni.pdf", 'name' => 'Vzorový dokument pro odstoupení od smlouvy.pdf'];
//        $attachments[] = $attachment;

        Email::sendEmail($subject, $body, Email::DEVELOPER_EMAIL, [
            'reply' => $orderState->order->invoiceAddress->Email,
            'replyName' => $orderState->order->invoiceAddress->getFullName(),
//            'attachmentsArray' => $attachments
        ]);

        if ($orderState->OrderStateType_ID == 1) {
//            Email::sendEmail($subject, $body, 'info@hadex.cz', [
//                'reply' => $orderState->order->invoiceAddress->Email,
//                'replyName' => $orderState->order->invoiceAddress->getFullName(),
////                'attachmentsArray' => $attachments
//            ]);
        }

        Email::sendEmail($subject, $body, $orderState->order->invoiceAddress->Email, [
            'reply' => $eshop->settings->ContactEmail,
            'replyName' => $eshop->Name,
//            'attachmentsArray' => $attachments
        ]);
    }

    /**
     * @param Feedback $feedback
     * @param string $type
     * @param FeedbackState|null $state
     */
    public static function sendFeedbackEmail(Feedback $feedback, string $type, FeedbackState $state = null)
    {
        $priority = ucfirst($feedback->Priority)[0];
        $errorReporting = $feedback->ErrorReporting ? '!' : '';

        $subject = Template::subject('[PROJECT] [[TYPE] [PRIORITY][ERROR_REPORTING]] [AUTHOR_SOLVER] - [[NUMBER]] [HEADER]', [
            'PROJECT' => 'trym CZ',
            'TYPE' => $type == 'state' ? $state->State : $type,
            'PRIORITY' => $priority,
            'ERROR_REPORTING' => $errorReporting,
            'AUTHOR_SOLVER' => $feedback->getAuthorSolver(),
            'NUMBER' => $feedback->FeedbackNumber,
            'HEADER' => $feedback->Header,
        ], $feedback->eshop);

        $body = Template::feedback($feedback, $type, $state);

        $receivers = [];
        $receivers[] = $feedback->creatorUser->Name;
        $receivers[] = $feedback->solverUser->Name;
//        $receivers[] = Email::getDeveloperEmail();
//        $receivers[] = 'studnik@evidsoft.cz';

        Email::sendEmail($subject, $body, array_unique($receivers), ['reply' => $feedback->creatorUser->Name ?? null]);
    }


    /**
     * @param Zend_Controller_Request_Abstract $contactUsInfo
     * @throws Exception
     */
    public static function sendMainContactUsForm(Zend_Controller_Request_Abstract $contactUsInfo): void
    {
        $subject = Template::subject(translate('[TRYM] Contact form message'));
        $body = Template::renderMainContactUs($contactUsInfo);

        $receivers[] = Email::getDeveloperEmail();
        if ($notifyEmail = Eshop::getInstance()->getSettings('NotifyEmail'))
            $receivers[] = $notifyEmail;

        if ($contactUsInfo->getParam('Email'))
            $receivers[] = $contactUsInfo->getParam('Email');

        Email::sendEmail($subject, $body, $receivers, ['reply' => $contactUsInfo->getParam('Email'), 'replyName' => $contactUsInfo->getParam('Name')]);
    }

    /**
     * @throws Exception
     */
    public static function sendWatchDogNotificationEmail(User $user, array $productsToBeReported) {
        $subject = Template::subject('[SHOP] ' . 'Hlídací pes - Upozornění na sledované produkty');
        $body = Template::renderWatchDogNotification($user, $productsToBeReported);

        Email::sendEmail($subject, $body, $user->Name);
    }

    public static function sendComplaintEmail(Complaint $complaint) {
        $subject = Template::subject('[SHOP] ' . 'Reklamace č. ' . $complaint->ID);
        $body = Template::renderComplaint($complaint);

        $receivers = [];
        $receivers[] = 'vojkuvka@evidsoft.cz';
        $receivers[] = $complaint->Email;
//        $receivers[] = $eshop->getSettings('NotifyEmail');

        Email::sendEmail($subject, $body, $receivers, [
            'reply' => $complaint->Email,
            'replyName' => $complaint->Name,
        ]);
    }

    public static function sendMissingProductCodesInEshopEmail(array $missingCodesInEshop) {
        //ToDO: pak upravit subject a odkomentovat notifyEmail
        $subject = Template::subject('[SHOP] ' . 'Nový e-shop - Chybějící produkty v e-shopu');
        $body = Template::renderMissingProductCodesInEshop($missingCodesInEshop);

        $receivers = [];
        $receivers[] = Email::getDeveloperEmail();
        $receivers[] = 'loskot@softima.cz';
        $receivers[] = 'vojkuvka@evidsoft.cz';
//        if ($notifyEmail = Eshop::getInstance()->getSettings('NotifyEmail'))
//            $receivers[] = $notifyEmail;

        Email::sendEmail($subject, $body, $receivers);
    }

    private static function calculateOffset($offset, $i, $totalReceivers)
    {
        $result = ($totalReceivers - $i) >= $offset ? $offset : $totalReceivers - $i;
        if ($result === 0) {
            $result = 1;
        }
        return $result;
    }
}