<?php


use user\logic\UserClientSession;

class CosmeticsController extends BaseController {

    public function saveCosmeticsAction() {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatná metoda požadavku.'
            ]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['day']) || !is_numeric($input['day'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Den je povinný.'
            ]);
            exit;
        }

        if (!isset($input['data']) || !is_array($input['data'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Data kosmetiky jsou povinná.'
            ]);
            exit;
        }

        $dayId = (int)$input['day'];
        $data = $input['data'];

        if (!isset($data['cosmetics']) || !is_array($data['cosmetics'])) {
            echo json_encode([
                'status' => 'error',
                'message' => "Chybí pole: cosmetics"
            ]);
            exit;
        }

        try {
            $userId = UserClientSession::getCurrentUserId();

            if (!$userId) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Musíte být přihlášeni.'
                ]);
                exit;
            }

            $day = Doctrine_Core::getTable('Admin_Model_Day')->find($dayId);

            if (!$day) {
               $day = Admin_Model_Day::createDay();
               $dayId = $day->ID;
            }

            Admin_Model_Cosmetic::deleteCosmeticsForDay($dayId, $userId);

            foreach ($data['cosmetics'] as $productName) {
                if (empty(trim($productName))) {
                    continue;
                }

                Admin_Model_Cosmetic::saveUserCosmetics($dayId, $userId, $productName);
            }

            echo json_encode([
                'status' => 'success',
                'message' => 'Kosmetika byla úspěšně uložena.'
            ]);

        } catch (Exception $e) {
            error_log('Cosmetics save error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }

        exit;
    }

    public function getCosmeticsAction() {
        header('Content-Type: application/json');

        $dayId = (int)$this->getRequest()->getParam('id');

        if (!$dayId) {
            echo json_encode([
                'status' => 'error',
                'message' => 'ID dne je povinné.'
            ]);
            exit;
        }

        try {
            $userId = UserClientSession::getCurrentUserId();

            if (!$userId) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Musíte být přihlášeni.'
                ]);
                exit;
            }

            $cosmetics = Admin_Model_Cosmetic::getCosmeticsForDay($dayId, $userId);

            $cosmeticsData = [];
            foreach ($cosmetics as $cosmetic) {
                $cosmeticsData[] = $cosmetic->Name;
            }

            echo json_encode([
                'status' => 'success',
                'data' => [
                    'cosmetics' => $cosmeticsData
                ]
            ]);

        } catch (Exception $e) {
            error_log('Get cosmetics error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' =>  $e->getMessage()
            ]);
        }
        exit;
    }

    public function getCosmeticsForResultAction() {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatná metoda požadavku.'
            ]);
            exit;
        }

        $dayId = (int)$this->getRequest()->getParam('id');

        if (!$dayId) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Den je povinný.'
            ]);
            exit;
        }

        try {
            $userId = UserClientSession::getCurrentUserId();

            if (!$userId) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Musíte být přihlášeni.'
                ]);
                exit;
            }

            $cosmetics = Doctrine_Query::create()
                ->from('Admin_Model_Cosmetic') // Předpokládám, že máte model Cosmetic
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->execute();

            $cosmeticsData = [];

            foreach ($cosmetics as $cosmetic) {
                if (!empty($cosmetic->ProductName) || !empty($cosmetic->Name)) {
                    $cosmeticsData[] = [
                        'name' => $cosmetic->ProductName ?? $cosmetic->Name ?? 'Neznámý produkt',
                    ];
                }
            }

            echo json_encode([
                'status' => 'success',
                'data' => $cosmeticsData
            ]);

        } catch (Exception $e) {
            error_log('Cosmetics data load error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při načítání kosmetiky. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }





}