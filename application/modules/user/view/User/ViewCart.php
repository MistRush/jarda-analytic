<?php

namespace user\view\User;

use Clevis_View_Container as Container;
use Clevis_View_ViewPage as ViewPage;

class ViewCart extends ViewPage {

    protected function appendContent(Container & $content) {
        $listing = $content->addListing('Obsahy nákupních košíků');
        $listing->setupStore(array('module' => 'admin', 'controller' => 'cart'));
        $listing->setFilterDefault(FILTER_DISABLE);
        $listing->addColumn(COLUMN_COUNTER, 'Counter', '#');
        $listing->addColumn(COLUMN_ID, 'ID', 'ID');
        $listing->addColumn(COLUMN_DATE | FILTER_ENABLE, 'Date', 'Datum');
        $listing->addColumn(COLUMN_TEXT | FILTER_ENABLE, 'Time', 'Čas');
        $listing->addColumn(COLUMN_ENTITY | FILTER_ENABLE, 'User_ID', 'Uživatel')->setEntity('ID', 'Name', array('module' => 'user', 'controller' => 'user'));
        $listing->addColumn(COLUMN_TEXT | FILTER_ENABLE, 'IP', 'IP');
        $listing->addColumn(COLUMN_TEXT, 'Quantity', 'Počet');
        $listing->addColumn(COLUMN_ENTITY | FILTER_ENABLE, 'Product_ID', 'Produkt')->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'product'));
        $listing->addAction('delete', 'Odstranit košík', 'image-delete');
    }

}