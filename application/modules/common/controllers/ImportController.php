<?php
use User_Model_OldUser as OldUser;

class Common_ImportController extends Clevis_Zend_Controller_Action {

    public function init() {
        parent::init();

        $this->disableLayout();
    }



    public function removeFilesAction() {
        ini_set('memory_limit', '-1');
        ini_set('max_execution_time', '0');
        $offset = $this->getRequest()->getParam('offset') ?? 0;
        $limit = $this->getRequest()->getParam('limit') ?? 100;
        $filepath = '../data/import/files.csv';
        $temp_filepath = '../data/import/files_tmp.csv';
        $checkpoint_file = '../data/import/checkpoint_files.txt';

        // Kontrola existence souboru
        if (!file_exists($filepath)) {
            echo "Soubor $filepath neexistuje!";
            return;
        }

        // Načtení celého souboru do paměti
        $lines = file($filepath, FILE_IGNORE_NEW_LINES);
        if (empty($lines)) {
            echo "Soubor je prázdný nebo nemůže být načten!";
            return;
        }

        $total_lines = count($lines);
        $processed = 0;
        $skipped = 0;

        // Otevření dočasného souboru pro zápis nezpracovaných řádků
        $temp_file = fopen($temp_filepath, 'w');
        if (!$temp_file) {
            echo "Nelze vytvořit dočasný soubor!";
            return;
        }

        // Zpracování dávky řádků
        $start_index = $offset;
        $end_index = min($offset + $limit, $total_lines);

        for ($i = 0; $i < $total_lines; $i++) {
            $row = $lines[$i];

            // Pokud je řádek v aktuální dávce, zpracujeme ho
            if ($i >= $start_index && $i < $end_index) {
                $rowExplode = explode(',', trim($row));

                // Kontrola platnosti řádku
                if (!isset($rowExplode[3])) {
                    echo "Neplatný řádek: " . htmlspecialchars($rowExplode[0] ?? '') . "<br/>";
                    // I neplatný řádek se odstraní, nepřesuneme ho do temp souboru
                    $skipped++;
                    continue;
                }

                $type = $rowExplode[2];
                $name = $rowExplode[3];
                $extension = $rowExplode[4];
                $directoryPhoto = APPLICATION_PATH . '/../www/files/images/product/';
                $directoryDocument = APPLICATION_PATH . '/../www/files/documments/product/';


                if($type == 'product-photo') {
                    $this->deleteFileByName($directoryPhoto.'50/', $name . '.' . $extension);
                    $this->deleteFileByName($directoryPhoto.'200/', $name . '.' . $extension);
                    $this->deleteFileByName($directoryPhoto.'350/', $name . '.' . $extension);
                    $this->deleteFileByName($directoryPhoto.'800/', $name . '.' . $extension);
                    $this->deleteFileByName($directoryPhoto.'original/', $name . '.' . $extension);
                }

                elseif($type == 'product-documment')
                $this->deleteFileByName($directoryDocument, $name . '.' . $extension);
                else {
                    echo "Neznámý typ souboru: $type<br/>";
                    // I neplatný řádek se odstraní, nepřesuneme ho do temp souboru
                    $skipped++;
                    continue;
                }

                $processed++;

            } else {
                // Řádek není v aktuální dávce, kopírujeme ho do temp souboru
                fwrite($temp_file, $row . PHP_EOL);
            }
        }

        // Zavření temp souboru
        fclose($temp_file);

        // Nahrazení původního souboru dočasným
        rename($temp_filepath, $filepath);

        // Aktualizace checkpoint souboru - nyní bude obsahovat pouze offset, protože odstraňujeme řádky
        $new_offset = $offset - $skipped; // Nový offset odečítá odstraněné řádky
        $new_offset = max(0, $new_offset); // Ujistíme se, že offset není záporný
        file_put_contents($checkpoint_file, $new_offset);

        echo "Zpracováno $processed záznamů z offsetu $offset. Odstraněno $skipped záznamů.<br/>";
        echo "V CSV souboru zůstává " . (file_exists($filepath) ? count(file($filepath)) : 0) . " řádků.<br/>";

        // Výpočet následujícího offsetu
        $nextOffset = $new_offset; // Příští offset zůstává stejný, protože jsme odstranili zpracované řádky
        echo "<br/><a href='?offset=$nextOffset&limit=$limit'>Další dávka</a>";

        if ($new_offset > 0) {
            $prevOffset = max(0, $new_offset - $limit);
            echo " | <a href='?offset=$prevOffset&limit=$limit'>Předchozí dávka</a>";
        }
    }

    public function importOldUsersAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');

        $offset = $this->getRequest()->getParam('offset') ?? 0;
        $limit = $this->getRequest()->getParam('limit') ?? 100;
        $filepath = '../data/import/pristupy.csv';
        $temp_filepath = '../data/import/pristupy_temp.csv';
        $checkpoint_file = '../data/import/checkpoint.txt';

        // Kontrola existence souboru
        if (!file_exists($filepath)) {
            echo "Soubor $filepath neexistuje!";
            return;
        }

        // Načtení celého souboru do paměti
        $lines = file($filepath, FILE_IGNORE_NEW_LINES);
        if (empty($lines)) {
            echo "Soubor je prázdný nebo nemůže být načten!";
            return;
        }

        $total_lines = count($lines);
        $processed = 0;
        $skipped = 0;

        // Otevření dočasného souboru pro zápis nezpracovaných řádků
        $temp_file = fopen($temp_filepath, 'w');
        if (!$temp_file) {
            echo "Nelze vytvořit dočasný soubor!";
            return;
        }

        // Zpracování dávky řádků
        $start_index = $offset;
        $end_index = min($offset + $limit, $total_lines);

        for ($i = 0; $i < $total_lines; $i++) {
            $row = $lines[$i];

            // Pokud je řádek v aktuální dávce, zpracujeme ho
            if ($i >= $start_index && $i < $end_index) {
                $rowExplode = explode(';', trim($row));

                // Kontrola platnosti řádku
                if (!isset($rowExplode[3])) {
                    echo "Neplatný řádek: " . htmlspecialchars($rowExplode[0] ?? '') . "<br/>";
                    // I neplatný řádek se odstraní, nepřesuneme ho do temp souboru
                    $skipped++;
                    continue;
                }

                $code = $rowExplode[1];
                $login = $rowExplode[3];

                // Kontrola existence uživatele
                if(OldUser::oldUserExists($login, $code)) {
                    echo "Uživatel s loginem $login a externím ID $code již existuje.<br/>";
                    // Řádek se odstraní, nepřesuneme ho do temp souboru
                    $skipped++;
                    continue;
                }

                // Příprava dat
                $userData = [
                    'Code' => $code,
                    'LoginName' => $login,
                    'Password' => str_replace('"', '', $rowExplode[4]),
                    'Transfered' => 0,
                    'ContactPerson' => $rowExplode[5] !== '""' ? $rowExplode[5] : null,
                    'ContactPhone' => $rowExplode[6] !== '""' ? str_replace(' ', '', $rowExplode[6]) : null,
                    'ContactEmail' => $rowExplode[7] !== '""' ? $rowExplode[7] : null,
                    'CompanyName' => $rowExplode[8] !== '""' ? $rowExplode[8] : null,
                    'CompanyStreet' => $rowExplode[9] !== '""' ? $rowExplode[9] : null,
                    'CompanyCity' => $rowExplode[10] !== '""' ? $rowExplode[10] : null,
                    'CompanyZipCode' => $rowExplode[11] !== '""' ? mb_substr(str_replace(' ', '', $rowExplode[11]), 0, 10) : null,
                    'CompanyCountry' => $rowExplode[12] !== '""' ? $rowExplode[12] : null,
                    'CompanyID' => $rowExplode[13] !== '""' ? $rowExplode[13] : null,
                    'CompanyVatID' => $rowExplode[14] !== '""' ? $rowExplode[14] : null,
                    'DeliveryName' => $rowExplode[15] !== '""' ? $rowExplode[15] : null,
                    'DeliveryStreet' => $rowExplode[16] !== '""' ? $rowExplode[16] : null,
                    'DeliveryCity' => $rowExplode[17] !== '""' ? $rowExplode[17] : null,
                    'DeliveryZipCode' => $rowExplode[18] !== '""' ? mb_substr(str_replace(' ', '', $rowExplode[18]), 0, 10) : null,
                    'DeliveryCountry' => $rowExplode[19] !== '""' ? $rowExplode[19] : null,
                    'Currency' => $rowExplode[21] !== '""' ? $rowExplode[21] : null,
                    'Lang' => $rowExplode[20] !== '""' ? $rowExplode[20] : null,
                    'PaymentAvailability' => $rowExplode[22] !== '""' ? $rowExplode[22] : null,
                    'PriceType' => $rowExplode[23] !== '""' ? $rowExplode[23] : null,
                    'Discount' => $rowExplode[24] !== '""' ? (float)$rowExplode[24] : null,
                    'State' => filter_var($rowExplode[27], FILTER_VALIDATE_BOOLEAN),
                    'Newsletter' => filter_var($rowExplode[29], FILTER_VALIDATE_BOOLEAN)
                ];

                // Vytvoření a uložení uživatele
                $oldUser = new OldUser();

                foreach ($userData as $property => $value) {
                    $oldUser->$property = $value;
                }

                $oldUser->save();
                $processed++;

                // Řádek byl zpracován, takže ho nepřesuneme do temp souboru
            } else {
                // Řádek není v aktuální dávce, kopírujeme ho do temp souboru
                fwrite($temp_file, $row . PHP_EOL);
            }
        }

        // Zavření temp souboru
        fclose($temp_file);

        // Nahrazení původního souboru dočasným
        rename($temp_filepath, $filepath);

        // Aktualizace checkpoint souboru - nyní bude obsahovat pouze offset, protože odstraňujeme řádky
        $new_offset = $offset - $skipped; // Nový offset odečítá odstraněné řádky
        $new_offset = max(0, $new_offset); // Ujistíme se, že offset není záporný
        file_put_contents($checkpoint_file, $new_offset);

        echo "Zpracováno $processed záznamů z offsetu $offset. Odstraněno $skipped neplatných nebo již existujících záznamů.<br/>";
        echo "V CSV souboru zůstává " . (file_exists($filepath) ? count(file($filepath)) : 0) . " řádků.<br/>";

        // Výpočet následujícího offsetu
        $nextOffset = $new_offset; // Příští offset zůstává stejný, protože jsme odstranili zpracované řádky
        echo "<br/><a href='?offset=$nextOffset&limit=$limit'>Další dávka</a>";

        if ($new_offset > 0) {
            $prevOffset = max(0, $new_offset - $limit);
            echo " | <a href='?offset=$prevOffset&limit=$limit'>Předchozí dávka</a>";
        }
    }

    private function deleteFileByName($directory, $filename) {
    $fullPath = rtrim($directory, '/') . '/' . $filename;

    if (is_file($fullPath)) {
        if (unlink($fullPath)) {
            echo "Soubor $fullPath byl smazán.\n";
        } else {
            echo "Nepodařilo se smazat $fullPath.\n";
        }
    } else {
        echo "Soubor neexistuje: $fullPath\n";
    }
}

}
