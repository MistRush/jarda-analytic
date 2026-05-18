<?php


use user\logic\UserClientSession;

class DayController extends BaseController {

    public function indexAction() {
        if (!UserClientSession::getCurrentUserID()) {
            $this->forward('login', 'customer', 'default');
            return;
        }

        $params = [
            'mainContainer' => false,
            'title' => "den",
            'metaDescription' => "den",
            'metaKeywords' => "den",
        ];

        $this->renderLatte($params);
    }

    public function getOrCreateDayAction() {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatná metoda požadavku.'
            ]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['date'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Datum je povinné.'
            ]);
            exit;
        }

        $date = $input['date'];

        try {
            $userId = UserClientSession::getCurrentUserId();

            if (!$userId) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Musíte být přihlášeni.'
                ]);
                exit;
            }

            $day = Admin_Model_Day::getDayByDate($date);

            if (!$day) {
                $day = Admin_Model_Day::createDay($date);
            }
            echo json_encode([
                'status' => 'success',
                'dayId' => $day["ID"],
                'date' => $day["Date"]
            ]);

        } catch (Exception $e) {
            error_log('Get or create day error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při načítání dne.'
            ]);
        }

        exit;
    }

    public function getRecommendationsAction() {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatná metoda požadavku.'
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

            $recommendations = Admin_Model_Recomendation::getRecommendations();

            echo json_encode([
                'status' => 'success',
                'recommendations' => $recommendations,
            ]);

        } catch (Exception $e) {
            error_log('Load recommendations error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při načítání doporučení.'
            ]);
        }

        exit;
    }






}