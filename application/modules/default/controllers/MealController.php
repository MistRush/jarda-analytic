<?php


use user\logic\UserClientSession;

class MealController extends BaseController {

    public function saveMealAction() {
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
                'message' => 'Data jídla jsou povinná.'
            ]);
            exit;
        }

        $dayId = (int)$input['day'];
        $data = $input['data'];

        $requiredFields = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || !is_array($data[$field])) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Chybí pole: {$field}"
                ]);
                exit;
            }
        }

        foreach ($requiredFields as $field) {
            foreach ($data[$field] as $item) {
                if (!isset($item['food']) || empty(trim($item['food']))) {
                    continue;
                }

                if (!isset($item['grams']) || !is_numeric($item['grams']) || $item['grams'] <= 0) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Gramy musí být číslo větší než 0.'
                    ]);
                    exit;
                }
            }
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

                echo json_encode([
                    'status' => 'error',
                    'message' => 'Den nebyl nalezen.'
                ]);
                exit;
            }

            Doctrine_Query::create()
                ->delete('Admin_Model_Meal')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->execute();

            $mealTypeMap = [
                'breakfast' => 'breakfast',
                'morningSnack' => 'morning_snack',
                'lunch' => 'lunch',
                'afternoonSnack' => 'afternoon_snack',
                'dinner' => 'dinner',
                'drink' => 'drink'
            ];

            foreach ($requiredFields as $field) {
                foreach ($data[$field] as $item) {
                    if (empty(trim($item['food']))) {
                        continue;
                    }

                    $meal = new Admin_Model_Meal();
                    $meal->Day_ID = $dayId;
                    $meal->User_ID = $userId;
                    $meal->MealType = $mealTypeMap[$field];
                    $meal->OffCode = trim($item['food']);
                    $meal->Quantity = (float)$item['grams'];
                    $meal->DateCreated = date('Y-m-d H:i:s');

                    if (isset($item['nutrients']) && is_array($item['nutrients'])) {
                        $quantity = (float)$item['grams'];
                        $multiplier = $quantity / 100;

                        $meal->Carbs = isset($item['nutrients']['carbohydrates_100g']) ? (float)$item['nutrients']['carbohydrates_100g'] * $multiplier : 0;
                        $meal->Sugar = isset($item['nutrients']['sugars_100g']) ? (float)$item['nutrients']['sugars_100g'] * $multiplier : 0;
                        $meal->Fat = isset($item['nutrients']['fat_100g']) ? (float)$item['nutrients']['fat_100g'] * $multiplier : 0;
                        $meal->Kcal = isset($item['nutrients']['energy-kcal_100g']) ? (float)$item['nutrients']['energy-kcal_100g'] * $multiplier : 0;
                    } else {
                        $meal->Carbs = 0;
                        $meal->Sugar = 0;
                        $meal->Fat = 0;
                        $meal->Kcal = 0;
                    }

                    $meal->save();
                }
            }

            echo json_encode([
                'status' => 'success',
                'message' => 'Jídlo bylo úspěšně uloženo.'
            ]);

        } catch (Exception $e) {
            error_log('Meal save error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při ukládání jídla. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }


    public function getMealAction() {
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

            $meals = Doctrine_Query::create()
                ->from('Admin_Model_Meal')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->execute();

            $mealTypeMap = [
                'breakfast' => 'breakfast',
                'morning_snack' => 'morningSnack',
                'lunch' => 'lunch',
                'afternoon_snack' => 'afternoonSnack',
                'dinner' => 'dinner'
            ];

            $data = [
                'breakfast' => [],
                'morningSnack' => [],
                'lunch' => [],
                'afternoonSnack' => [],
                'dinner' => []
            ];

            foreach ($meals as $meal) {
                $mealType = $mealTypeMap[$meal->MealType] ?? null;

                if ($mealType) {
                    $nutrients = null;

                    if ($meal->Kcal > 0 || $meal->Carbs > 0 || $meal->Fat > 0 || $meal->Sugar > 0) {
                        $quantity = (float)$meal->Quantity;
                        $multiplier = $quantity > 0 ? 100 / $quantity : 1;

                        $nutrients = [
                            'carbohydrates_100g' => $meal->Carbs * $multiplier,
                            'sugars_100g' => $meal->Sugar * $multiplier,
                            'fat_100g' => $meal->Fat * $multiplier,
                            'energy-kcal_100g' => $meal->Kcal * $multiplier
                        ];
                    }

                    $data[$mealType][] = [
                        'food' => $meal->OffCode,
                        'grams' => (float)$meal->Quantity,
                        'nutrients' => $nutrients
                    ];
                }
            }

            foreach ($data as $key => $value) {
                if (empty($value)) {
                    $data[$key] = [
                        ['food' => '', 'grams' => 100, 'nutrients' => null]
                    ];
                }
            }

            echo json_encode([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (Exception $e) {
            error_log('Meal load error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při načítání jídla. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }

    public function saveDrinkAction() {
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
                'message' => 'Data pití jsou povinná.'
            ]);
            exit;
        }

        $dayId = (int)$input['day'];
        $data = $input['data'];

        $requiredFields = ['drinks'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || !is_array($data[$field])) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Chybí pole: {$field}"
                ]);
                exit;
            }
        }

        foreach ($requiredFields as $field) {
            foreach ($data[$field] as $item) {
                if (!isset($item['drink']) || empty(trim($item['drink']))) {
                    continue;
                }

                if (!isset($item['ml']) || !is_numeric($item['ml']) || $item['ml'] <= 0) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Mililitry musí být číslo větší než 0.'
                    ]);
                    exit;
                }
            }
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

                echo json_encode([
                    'status' => 'error',
                    'message' => 'Den nebyl nalezen.'
                ]);
                exit;
            }

            Doctrine_Query::create()
                ->delete('Admin_Model_Meal')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->andWhere('MealType = ?', 'drink')
                ->execute();

            $mealTypeMap = [
                'drinks' => 'drink'
            ];

            foreach ($requiredFields as $field) {
                foreach ($data[$field] as $item) {
                    if (empty(trim($item['drink']))) {
                        continue;
                    }

                    $meal = new Admin_Model_Meal();
                    $meal->Day_ID = $dayId;
                    $meal->User_ID = $userId;
                    $meal->MealType = $mealTypeMap[$field];
                    $meal->OffCode = trim($item['drink']);
                    $meal->Quantity = (float)$item['ml'];
                    $meal->DateCreated = date('Y-m-d H:i:s');

                    if (isset($item['nutrients']) && is_array($item['nutrients'])) {
                        $quantity = (float)$item['ml'];
                        $multiplier = $quantity / 100;

                        $meal->Carbs = isset($item['nutrients']['carbohydrates']) ? (float)$item['nutrients']['carbohydrates'] * $multiplier : 0;
                        $meal->Sugar = isset($item['nutrients']['sugars']) ? (float)$item['nutrients']['sugars'] * $multiplier : 0;
                        $meal->Fat = isset($item['nutrients']['fat']) ? (float)$item['nutrients']['fat'] * $multiplier : 0;
                        $meal->Kcal = isset($item['nutrients']['energy_kcal']) ? (float)$item['nutrients']['energy_kcal'] * $multiplier : 0;
                    } else {
                        $meal->Carbs = 0;
                        $meal->Sugar = 0;
                        $meal->Fat = 0;
                        $meal->Kcal = 0;
                    }

                    $meal->save();
                }
            }

            echo json_encode([
                'status' => 'success',
                'message' => 'Pití bylo úspěšně uloženo.'
            ]);

        } catch (Exception $e) {
            error_log('Drink save error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při ukládání pití. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }

    public function getDrinkAction() {
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

            $meals = Doctrine_Query::create()
                ->from('Admin_Model_Meal')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->andWhere('MealType = ?', 'drink')
                ->execute();

            $data = [
                'drinks' => []
            ];

            foreach ($meals as $meal) {
                $nutrients = null;

                if ($meal->Kcal > 0 || $meal->Carbs > 0 || $meal->Fat > 0 || $meal->Sugar > 0) {
                    $quantity = (float)$meal->Quantity;
                    $multiplier = $quantity > 0 ? 100 / $quantity : 1;

                    $nutrients = [
                        'carbohydrates' => $meal->Carbs * $multiplier,
                        'sugars' => $meal->Sugar * $multiplier,
                        'fat' => $meal->Fat * $multiplier,
                        'energy_kcal' => $meal->Kcal * $multiplier
                    ];
                }

                $data['drinks'][] = [
                    'drink' => $meal->OffCode,
                    'ml' => (float)$meal->Quantity,
                    'nutrients' => $nutrients
                ];
            }

            if (empty($data['drinks'])) {
                $data['drinks'] = [
                    ['drink' => '', 'ml' => 250, 'nutrients' => null]
                ];
            }

            echo json_encode([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (Exception $e) {
            error_log('Drink load error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při načítání pití. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }

    public function getMealsForResultAction() {
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

            $meals = Doctrine_Query::create()
                ->from('Admin_Model_Meal')
                ->where('Day_ID = ?', $dayId)
                ->andWhere('User_ID = ?', $userId)
                ->execute();

            $foodQuantities = [];

            foreach ($meals as $meal) {
                if (!empty($meal->OffCode)) {
                    $foodName = $meal->OffCode;
                    $quantity = (float)$meal->Quantity;

                    if (isset($foodQuantities[$foodName])) {
                        $foodQuantities[$foodName]['quantity'] += $quantity;
                    } else {
                        $foodQuantities[$foodName] = [
                            'name' => $foodName,
                            'quantity' => $quantity,
                            'type' => $meal->MealType ?? 'food'
                        ];
                    }
                }
            }

            $foodData = array_values($foodQuantities);

            echo json_encode([
                'status' => 'success',
                'data' => $foodData
            ]);

        } catch (Exception $e) {
            error_log('Meal names load error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při načítání jídla. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }


    public function searchFoodAction() {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatná metoda požadavku.'
            ]);
            exit;
        }

        $query = $this->getRequest()->getParam('query');

        if (!$query || strlen($query) < 3) {
            echo json_encode([
                'status' => 'success',
                'data' => []
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

            $meals = Admin_Model_CustomMeal::getSearchMeals($query);

            bdump($meals);

            $data = [];

            foreach ($meals as $meal) {
                $nutrients = null;

                if ($meal->Kcal > 0 || $meal->Carbs > 0 || $meal->Fat > 0 || $meal->Sugar > 0) {
                    $nutrients = [
                        'energy_kcal' => (float)$meal->Kcal,
                        'carbohydrates' => (float)$meal->Carbs,
                        'fat' => (float)$meal->Fat,
                        'sugars' => (float)$meal->Sugar,
                        'proteins' => (float)$meal->Protein,
                        'fiber' => 0,
                        'salt' => 0
                    ];
                }

                $data[] = [
                    'name' => $meal->Name,
                    'brand' => '',
                    'nutrients' => $nutrients
                ];
            }

            echo json_encode([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (Exception $e) {
            error_log('Food search error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }

        exit;
    }






}