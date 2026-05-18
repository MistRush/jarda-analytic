<?php


use user\logic\UserClientSession;

class StressController extends BaseController {

    public function saveStressAction() {
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
                'message' => 'Data stresu jsou povinná.'
            ]);
            exit;
        }

        $dayId = (int)$input['day'];
        $data = $input['data'];

        if (!isset($data['level']) || !is_numeric($data['level']) || $data['level'] < 1 || $data['level'] > 10) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Úroveň stresu musí být číslo mezi 1 a 10.'
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

            $stress = Doctrine_Query::create()
                ->from('Admin_Model_DayStress')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->fetchOne();

            if (!$stress) {
                $stress = new Admin_Model_DayStress();
                $stress->Day_ID = $dayId;
                $stress->User_ID = $userId;
            }

            $stress->StressLevel = (int)$data['level'];
            $stress->save();

            echo json_encode([
                'status' => 'success',
                'message' => 'Stres byl úspěšně uložen.'
            ]);

        } catch (Exception $e) {
            error_log('Stress save error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při ukládání stresu. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }

    public function getStressAction() {
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

            $stress = Doctrine_Query::create()
                ->from('Admin_Model_DayStress')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->fetchOne();

            $data = [
                'level' => 5
            ];

            if ($stress) {
                $data['level'] = (int)$stress->StressLevel;
            }

            echo json_encode([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (Exception $e) {
            error_log('Stress load error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }

        exit;
    }

    public function getStressForResultAction() {
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

            $stressData = Doctrine_Query::create()
                ->from('Admin_Model_DayStress')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->fetchOne();

            $responseData = [];

            if ($stressData) {
                $stressLevel = $stressData->StressLevel ?? 0;

                $responseData = [
                    'level' => $stressLevel,
                    'description' => $stressData->Description ?? 'Nezadáno'
                ];

                $conditions = Doctrine_Query::create()
                    ->from('Admin_Model_Condition')
                    ->where('Parameter = ?', 'stress')
                    ->andWhere('Active = ?', true)
                    ->execute();

                $positiveCondition = null;
                $negativeCondition = null;

                foreach ($conditions as $condition) {
                    $conditionMet = $this->evaluateCondition($stressLevel, $condition->Comparison, $condition->Value);

                    if ($conditionMet) {
                        if ($condition->IsPositive) {
                            $positiveCondition = [
                                'name' => $condition->Name,
                                'description' => $condition->Description
                            ];
                        } else {
                            $negativeCondition = [
                                'name' => $condition->Name,
                                'description' => $condition->Description
                            ];
                        }
                    }
                }

                $responseData['conditions'] = [
                    'positive' => $positiveCondition,
                    'negative' => $negativeCondition
                ];
            }

            echo json_encode([
                'status' => 'success',
                'data' => $responseData
            ]);

        } catch (Exception $e) {
            error_log('Stress data load error: ' . $e->getMessage());
            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při načítání dat o stresu. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }

    private function evaluateCondition($value, $comparison, $targetValue) {
        switch ($comparison) {
            case '>':
            case 'greater':
                return $value > $targetValue;
            case '<':
            case 'less':
                return $value < $targetValue;
            case '>=':
            case 'greater_equal':
                return $value >= $targetValue;
            case '<=':
            case 'less_equal':
                return $value <= $targetValue;
            case '==':
            case '=':
            case 'equal':
                return $value == $targetValue;
            case '!=':
            case 'not_equal':
                return $value != $targetValue;
            default:
                return false;
        }
    }





}