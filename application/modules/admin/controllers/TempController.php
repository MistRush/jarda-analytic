<?php

class Admin_TempController extends Admin_Controller_Action {

    public function skManufacturerAction() {

        $query = Doctrine_Query::create();
        $query->from('Admin_Model_Product object');
        $query->where('object.Manufacturer_ID = ?', 5);
        $productLangs = $query->execute()->toArray();

        foreach ( $productLangs as $productLang ) {
            $query = Doctrine_Query::create();
            $query->update('Admin_Model_ProductLang object');
            $query->set('object.Description', '?', 'Ťažné zariadenia sú vyrábané za použitia najmodernejších technológií, tj. Digitálne ovládaného CNC laserového a plazmového nože a hranového lisu. Pre zaistenie vynikajúce povrchové úpravy, sú ťažné zariadenia čistená v pieskovacie komore, fosforová a následne lakovaná práškovou polyesterovou farbou. Naše produkty sú vybavené potrebnými homologáciou E20 a E20 a certfikátov PIMOS .Na základe týchto homologáciou dodávame ku každému ťažnému zariadeniu typový list. (Zákazník si môže namontovať ťažné zariadenie sám, alebo mu odporučíme naše montážne strediská po celej SR). Tieto výrobky sa predávajú do 12 štátov Európskej únie.');
            $query->where('object.Language_ID = ?', 2);
            $query->andWhere('object.Product_ID = ?', $productLang['ID']);
            $query->execute();
        }

        $query = Doctrine_Query::create();
        $query->from('Admin_Model_Product object');
        $query->where('object.Manufacturer_ID = ?', 6);
        $productLangs = $query->execute()->toArray();

        foreach ( $productLangs as $productLang ) {
            $query = Doctrine_Query::create();
            $query->update('Admin_Model_ProductLang object');
            $query->set('object.Description', '?', 'Ťažné zariadenia sú vyrábané za použitia najmodernejších technológií. Naše produkty sú vybavené potrebnými homologáciou E20 a E20. Na základe týchto homologáciou dodávame ku každému ťažnému zariadeniu typový list. Zákazník si môže namontovať ťažné zariadenie sám, alebo mu odporučíme naše montážne strediská po celej SR.');
            $query->where('object.Language_ID = ?', 2);
            $query->andWhere('object.Product_ID = ?', $productLang['ID']);
            $query->execute();
        }
    }
}