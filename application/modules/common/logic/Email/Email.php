<?php
namespace common\logic\Email;

use Admin_Model_EmailLog as EmailLog;
use common\logic\Configs;
use common\logic\Eshop\Eshop;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Email {
    const DEVELOPER_EMAIL = 'melecky@evidsoft.cz';

    /**
     * @param string $subject
     * @param string $body
     * @param string|array $receivers
     * @param array $options
     * @throws Exception
     */
    public static function sendEmail(string $subject, string $body, string|array $receivers, array $options = []) {
        $receivers = is_array($receivers) ? $receivers : array($receivers);
        $senderName = $options['senderName'] ?? Eshop::getInstance()->getSettings('SenderName');
        $senderEmail = $options['senderEmail'] ?? Eshop::getInstance()->getSettings('SenderEmail');
        $attachment = $options['attachment'] ?? null;
        $stringAttachment = $options['stringAttachment'] ?? $options[0]['stringAttachment'] ?? null;
        $stringAttachmentName = $options['stringAttachmentName'] ?? $options[0]['stringAttachmentName'] ?? null;
        $stringAttachmentType = $options['stringAttachmentType'] ?? $options[0]['stringAttachmentType'] ?? null;
        $attachmentName = $options['attachmentName'] ?? null;
        $attachments = $options['attachmentsArray'] ?? [];
        $replyName = $options['replyName'] ?? null;
        $replyEmail = $options['replyEmail'] ?? null;
        $massEmailType = $options['massEmail'] ?? null;

        if($massEmailType) {
            $sendToRecord = [];
        }
        $mail = new PHPMailer();
        foreach ($receivers as $receiver) {
            if (filter_var($receiver, FILTER_VALIDATE_EMAIL) === false)
                continue;

            try {
                $mail->IsHTML(true);
                $mail->IsSMTP();
                $mail->CharSet="UTF-8";
                $mail->SMTPAuth = true;
                $mail->Host = Configs::getSMTPServer();
                $mail->Port = Configs::getSMTPPort();
                $mail->Username = Configs::getSMTPName();
                $mail->Password = Configs::getSMTPPassword();
                $mail->SMTPOptions = array(
                    'ssl' => array(
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    )
                );
                $mail->From = $senderEmail;
                $mail->FromName = $senderName;
                $mail->WordWrap = 50;
                $mail->Subject = $subject;
                $mail->Body = $body;

                if ( $replyEmail )
                    $mail->addReplyTo($replyEmail, $replyName);

                if ( $attachment )
                    $mail->addAttachment($attachment, $attachmentName);

                $mail->AddAddress($receiver);

                foreach ( $attachments as $attachment ) {
                    $mail->addAttachment($attachment['file'], $attachment['name']);
                }

                if ( $_SERVER['SERVER_NAME'] == 'hadex.localhost' || $_SERVER['SERVER_NAME'] == 'hadex.zdvo' )
                    return;

                $mail->send();

                if ( $mail->ErrorInfo )
                    throw new Exception($mail->ErrorInfo);

                $mail->clearAddresses();

                if(!$massEmailType)
                EmailLog::createLog($body, $subject, $senderEmail, $receiver);

                if($massEmailType)
                    $sendToRecord[] = $receiver;
            } catch (Exception $e) {
                throw $e;
            }
        }
        if($massEmailType) {
            self::sendEmail('Hromadný email byl zaslán na následující adresy', implode('<br>', $sendToRecord), Eshop::getInstance()->getSettings('NotifyEmail'));
            self::sendEmail('Hromadný email byl zaslán na následující adresy', implode('<br>', $sendToRecord), self::DEVELOPER_EMAIL);
        }

    }

    /**
     * @return string
     */
    public static function getDeveloperEmail(): string {
        return self::DEVELOPER_EMAIL;
    }
}