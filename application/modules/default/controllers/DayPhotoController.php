<?php


use user\logic\UserClientSession;

class DayPhotoController extends BaseController {

    public function uploadPhotoAction() {
        $userId = UserClientSession::getCurrentUserID();

        if (!isset($_FILES['uploadFile']) || $_FILES['uploadFile']['error'] !== UPLOAD_ERR_OK) {
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Soubor nebyl nahrán nebo došlo k chybě při nahrávání.'
            ]);
            exit;
        }

        $file = $_FILES['uploadFile'];
        $day = isset($_POST['day']) ? (int)$_POST['day'] : null;


        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $fileType = mime_content_type($file['tmp_name']);

        if (!in_array($fileType, $allowedTypes)) {
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Nepodporovaný formát souboru. Povolené formáty: JPG, PNG, GIF'
            ]);
            exit;
        }

        try {
            $uploader = new \common\logic\File\Uploader(
                $file['tmp_name'],
                $file['name'],
                \Common_Model_File::TYPE_DAILY_PHOTO
            );

            $uploadedFile = \Common_Model_File::createFile(
                \Common_Model_File::TYPE_DAILY_PHOTO,
                $uploader->getFileName(),
                $uploader->getExtension()
            );

            $fileId = $uploadedFile->ID;

            if ($fileId) {
                Admin_Model_DayPhoto::saveDayPhoto($userId, $day, $fileId);

                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Fotografie byla úspěšně nahrána.',
                    'fileId' => $fileId,
                    'fileUrl' => \Common_Model_File::getFileUrlByID($fileId, \Common_Model_File::SIZE_MAXI)
                ]);
            } else {
                throw new Exception('Chyba při ukládání souboru.');
            }
        } catch (Exception $e) {
            header('Content-Type: application/json');
            echo json_json([
                'status' => 'error',
                'message' => 'Chyba při nahrávání souboru: ' . $e->getMessage()
            ]);
        }

        exit;
    }

    public function getPhotoAction() {
        $userId = UserClientSession::getCurrentUserID();
        $day = $this->getRequest()->getParam('id');

        if (!$day) {
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Den nebyl specifikován.'
            ]);
            exit;
        }

        try {
            $photo = Admin_Model_DayPhoto::getPhoto($userId, $day);

            if ($photo && $photo->File_ID) {
                $fileUrl = \Common_Model_File::getFile(
                    $photo->File_ID,
                );

                $photoUrl = '/files/images/daily-photos/800/' . $fileUrl->Name . '.jpg';


                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'photo' => [
                        'fileId' => $photo->File_ID,
                        'file' => $photoUrl,
                        'day' => $day,
                    ]
                ]);
            } else {
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'photo' => null
                ]);
            }
        } catch (Exception $e) {
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Chyba při načítání fotografie: ' . $e->getMessage()
            ]);
        }

        exit;
    }






}