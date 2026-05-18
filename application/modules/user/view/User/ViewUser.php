<?php
namespace user\view\User;

use Clevis_View_ActionSet as ActionSet;
use Clevis_View_Container as Container;
use Clevis_View_ViewPage as ViewPage;
use user\logic\UserAdminSession;
use User_Model_User as User;

class ViewUser extends ViewPage {

    protected function appendContent(Container & $content) {
        $listing = $content->addListing('Seznam uživatelských účtů');
        $listing->setupStore(array('controller' => 'user'));
        $listing->setFilterColumnCount(2);
        $listing->setupStoreDialog(new DialogUser($listing));
        $listing->setFilterDefault(FILTER_DISABLE);
        $listing->addColumn(COLUMN_COUNTER, 'Counter', '#');
        $listing->addColumn(COLUMN_ID, 'ID', 'ID');
        $listing->addColumn(COLUMN_TEXT | FILTER_ENABLE | COLUMN_CHECKBOX, 'Active', 'Aktivní');
        $listing->addColumn(COLUMN_TEXT | FILTER_ENABLE, 'Name', 'Uživatelský účet', 150);
        $listing->addColumn(COLUMN_ENUM | FILTER_ENABLE, 'Type', 'Typ účtu', 150)->setEnumValues(User::getUserTypes());
        $listing->addColumn(COLUMN_DATE, 'LastLogin', 'Datum posledního přihlášení');
        $listing->addColumn(COLUMN_TEXT, 'CountLogin', 'Počet přihlášení');
        if ( UserAdminSession::getCurrentUserType() == User::TYPE_ADMIN )
            $listing->addActions(ActionSet::FILL_MANAGE);
        else
            $listing->addAction('edit', 'Upravit', 'image-edit');
    }
}