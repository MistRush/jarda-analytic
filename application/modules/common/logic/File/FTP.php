<?php

namespace common\logic\File;

/**
 * Class FTP
 * @package common\logic\File
 */
class FTP {

    /**
     * @param string $url
     * @param string $user
     * @param string $password
     * @param string $fileNameToSend
     * @param string $fileNameOnServer
     */
    public static function UploadAscii(string $url, string $user, string $password, string $fileNameToSend,string $fileNameOnServer): void {
        $connection = ftp_connect($url);
        if (!$connection) {
            new \Exception('FTP server not find ' . $url . ' ' . $user);

            return;
        }

        if (!@ftp_login($connection, $user, $password)) {
            new \Exception('Not login to FTP ' . $url . ' ' . $user);

            return;
        }

        if (!@ftp_put($connection, $fileNameOnServer, $fileNameToSend, FTP_ASCII)) {
            new \Exception('Not send file to FTP ' . $url . ' ' . $user);

            return;
        }

        ftp_close($connection);
    }

    /**
     * @param string $url
     * @param string $user
     * @param string $password
     * @param string $fileNameToSend
     * @param string $fileNameOnServer
     */
    public static function UploadOverCurl(string $url, string $user, string $password, string $fileNameToSend, string $fileNameOnServer): void {
        $curl = curl_init();
        $fp = fopen($fileNameToSend, 'r');
        curl_setopt($curl, CURLOPT_URL, "sftp://$user:$password@$url/$fileNameOnServer");
        curl_setopt($curl, CURLOPT_UPLOAD, 1);
        curl_setopt($curl, CURLOPT_INFILE, $fp);
        curl_setopt($curl, CURLOPT_INFILESIZE, filesize($fileNameToSend));
        curl_exec($curl);
        $error_no = curl_errno($curl);
        curl_close($curl);

        if ($error_no) {
            new \Exception('Not send file to FTP ' . $url . ' ' . $user);
        }
    }
}