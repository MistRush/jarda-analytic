<?php


use user\logic\UserClientSession;

class SleepController extends BaseController {


    public function saveSleepAction() {
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
                'message' => 'Data spánku jsou povinná.'
            ]);
            exit;
        }

        $dayId = (int)$input['day'];
        $data = $input['data'];

        if (!isset($data['from']) || empty($data['from'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Čas usnutí je povinný.'
            ]);
            exit;
        }

        if (!isset($data['to']) || empty($data['to'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Čas probuzení je povinný.'
            ]);
            exit;
        }

        if (!preg_match('/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/', $data['from'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatný formát času usnutí.'
            ]);
            exit;
        }

        if (!preg_match('/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/', $data['to'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatný formát času probuzení.'
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
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Den nebyl nalezen.'
                ]);
                exit;
            }

            $sleep = Doctrine_Query::create()
                ->from('Admin_Model_DaySleep')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->fetchOne();

            if (!$sleep) {
                $sleep = new Admin_Model_DaySleep();
                $sleep->Day_ID = $dayId;
                $sleep->User_ID = $userId;
            }

            $sleep->StartTime = $data['from'];
            $sleep->FinishTime = $data['to'];

            if (isset($data['duration']) && isset($data['duration']['total'])) {
                $sleep->Hours = $data['duration']['total'];
            }

            $sleep->save();

            echo json_encode([
                'status' => 'success',
                'message' => 'Spánek byl úspěšně uložen.'
            ]);

        } catch (Exception $e) {
            error_log('Sleep save error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při ukládání spánku. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }

    public function getSleepAction() {
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

            $day = Doctrine_Core::getTable('Admin_Model_Day')->find($dayId);

            if (!$day) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Den nebyl nalezen.'
                ]);
                exit;
            }

            $sleep = Doctrine_Query::create()
                ->from('Admin_Model_DaySleep')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->fetchOne();

            $data = [
                'from' => '',
                'to' => ''
            ];

            if ($sleep) {
                $data['from'] = $sleep->StartTime;
                $data['to'] = $sleep->FinishTime;
            }

            echo json_encode([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (Exception $e) {
            error_log('Sleep load error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }

        exit;
    }





}