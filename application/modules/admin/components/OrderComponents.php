<?php
namespace admin\components;

use admin\logic\Navigation;
use Admin_Model_Order as Order;
use common\logic\Eshop\Eshop;
use common\logic\Languages;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Form\Form;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Grid\GridVue;
use Jolanda\Controls\Grid\QuickEditor;
use Jolanda\Menu\Menu;

/**
 * Class OrderComponents
 * @package admin\components
 */
class OrderComponents {

    /**
     * @param string $url
     * @return Grid
     */
    public static function orderGrid(string $url = 'admin/order') :Grid {
        $grid = new GridVue('order', 'Seznam objednávek', 'admin/order/edit-order');
        $switches = $grid->getSwitchesForm();
        $switches->addComboBoxStore('Eshop_ID', translate('Eshop'),
            array('module' => 'common', 'controller' => 'eshop', 'acl' => true), 'Name', false)->setValue(Eshop::getInstance()->getEshopID());
        $switches->addComboBoxStore('orderStateType', translate('Stav objednávky'),
            array('module' => 'admin', 'controller' => 'order-state-type'), 'Name' . Languages::getLangCode(), false)
            ->getElement()
            ->setAttribute('style', 'display:none;');

        $grid->enableSearch(['OrderNumber', 'invoiceAddress.Email', 'invoiceAddress.LastName', 'invoiceAddress.FirstName'], 'Zadejte hledaný výraz');
        $grid->setEnabledActions(false, true, false);
        $grid->setUrl($url);
        $grid->setSelect(Grid::SELECT_MULTI_CHECKBOX, Grid::SELECT_MULTI_TYPE_ALL);
        $grid->setOrder('ID DESC');
        $grid->setRowFormatter('rowFormatter');

        //$grid->setSelect(Grid::SELECT_MULTI_CHECKBOX);
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_CUSTOM, 'ID', 'Náhled')->setFormatFunction('showPreview');
        //$grid->addColumn(COLUMN_CHECKBOX, 'InPohoda', translate('V POHODě'), 40);
        //$grid->addColumn(COLUMN_CUSTOM, 'ConversionType', translate('Konveze'), 40);
        $grid->addColumn(COLUMN_TEXT, 'OrderNumber', 'Číslo objednávky');
        $grid->addColumn(COLUMN_TEXT, 'InvoiceNumber', 'Číslo faktury');
        //$grid->addColumn(COLUMN_ENTITY, 'Vat_ID', 'Daň')->setEntity('ID', 'Name', array('module' => 'admin', 'controller' => 'vat'));
        //$grid->addColumn(COLUMN_ENTITY, 'Eshop_ID', 'Eshop')->setEntity('ID', 'Name', array('module' => 'common', 'controller' => 'eshop'));
        //$grid->addColumn(COLUMN_TEXT, 'CurrencyLabel', 'Měna', 15);
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum', 50);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 50)->setFilter(false);
        /*$grid->addColumn(COLUMN_NUMBER, 'PriceShippingWithVat', 'Cena dopravy s DPH');
        $grid->addColumn(COLUMN_NUMBER, 'PricePaymentWithVat', 'Cena plaby s DPH');*/
        $grid->addColumn(COLUMN_NUMBER, 'PriceTotalWithoutVat', 'Celková cena bez DPH');
        $grid->addColumn(COLUMN_NUMBER, 'PriceTotalWithVat', 'Celková cena s DPH');
        $grid->addColumn(COLUMN_TEXT, 'Email', 'Email');
        $grid->addColumn(COLUMN_TEXT, 'FullName', 'Zákazník');
        $grid->addColumn(COLUMN_TEXT, 'PaymentName', 'Platba', 150)->setFormatFunction('formatPayment');
        $grid->addColumn(COLUMN_TEXT, 'ShippingName', 'Doprava', 150);
        /*$grid->addColumn(COLUMN_TEXT, 'Phone', 'Phone');
        $grid->addColumn(COLUMN_TEXT, 'Email', 'Email');*/
        $grid->addColumn(COLUMN_ENTITY, 'OrderStateType_ID', 'Stav')->setEntity('ID', 'Name' . Languages::getLangCode(), array('module' => 'admin', 'controller' => 'order-state-type'))->setEditable();
        $grid->addColumn(COLUMN_TEXT, 'Description', 'Poznámka');
//        $grid->addColumn(COLUMN_TEXT, 'BalikobotPackageState', 'Stav balikobot', 150)->setFormatFunction('formatBalikobotState');
//        $grid->addColumn(COLUMN_TEXT, 'BalikobotTrackingURL', 'Tracking URL', 150)->setFormatFunction('formatBalikobotTrackingURL');
//        $grid->addColumn(COLUMN_TEXT, 'BalikobotID', 'BalikobotOrderID');

        $grid->addColumn(COLUMN_TEXT, 'TrackingUrl', 'Sledování zásilky');
        $grid->addColumn(COLUMN_TEXT, 'ParcelNumber', 'Číslo balíku');


        $grid->addAction('setState', 'Nastavit stav', 'setOrderState()');
        $actions = $grid->addAction('actions', 'Akce', null);
        $actions->setIcon('cog-o');
        $actions->addSubAction('printOrders', 'Tisk objednávek', "printOrderList();");
        $actions->addSubAction('showPDF', 'Zobrazit PDF', "showPDF();");
        $actions->addSubAction('regeneratePDF', 'Přegenerovat PDF', "regeneratePDF();");

//        $invoice = $grid->addAction('invoice', 'Zobrazit/vygenerovat fakturu', 'showInvoice();');
//        $invoice->setIcon('invoice');

//        $balikobot = $grid->addAction('balikobot', 'Balikobot', '', [true, true, false]);
//        $balikobot->setIcon('export');
//        $balikobot->addSubAction('balikobotAddPackage', 'Přidat balík', "balikobotAddPackage();");
//        $balikobot->addSubAction('balikobotAddPackageSpecify', 'Přidat balík s upřesněním', "balikobotAddPackage(true);");
//        $balikobot->addSubAction('balikobotPrintLabels', 'Tisk štítků', "balikobotPrintLabels();");
//        $balikobot->addSubAction('balikobotPrintLabel1', 'Tisk štítků' . ' #1', "balikobotPrintLabel(1);");
//        $balikobot->addSubAction('balikobotPrintLabel2', 'Tisk štítků' . ' #2', "balikobotPrintLabel(2);");
//        $balikobot->addSubAction('balikobotPrintLabel3', 'Tisk štítků' . ' #3', "balikobotPrintLabel(3);");
//        $balikobot->addSubAction('balikobotPrintLabel4', 'Tisk štítků' . ' #4', "balikobotPrintLabel(4);");
//        $balikobot->addSubAction('balikobotOrderShipment', 'Odeslat data dopravci', "balikobotOrderShipment();");
//        $balikobot->addSubAction('balikobotTrackingURL', 'URL pro sledování balíku', "balikobotTrackingURL();");
//        $balikobot->addSubAction('balikobotDeletePackage', 'Odstranit balík (pouze pokud ještě nebyl odeslán dopravci)', "balikobotDeletePackate();");

        $export = $grid->addAction('export', translate('Export'), '', [true, true, false]);
        $export->setIcon('file');
        $export->addSubAction('exportPohoda', translate('Exportovat do Pohody'), "exportPohoda();");
        $export->addSubAction('exportCsv', translate('Exportovat všechny obj. do CSV'), "exportCsv();");
/*
        $ppl = $grid->addAction('ppl', 'PPL', '', [true, true, false])->setIcon('delivery');
        $ppl->addSubAction('pplCreateNewShipment', 'Vytvořit novou zásilku', 'createNewPplShipment()');
        $ppl->addSubAction('pplGetExistingLabels', 'Zobrazit štítek', 'getAlreadyGeneratedPplLabels()');
        $ppl->addSubAction('pplGetPackageList', 'Zobrazit seznam balíčků', 'getPplPackageList()');

        $zasilkovna = $grid->addAction('zasilkovna', 'Zásilkovna', '', [true, true, false])->setIcon('delivery');
        $zasilkovna->addSubAction('sendOrderToZasilkovna', 'Odeslat objednávku do zásilkovny', 'sendOrderToZasilkovna()');
        $zasilkovna->addSubAction('zasilkovnaGetExistingLabels', 'Zobrazit štítek', 'getZasilkovnaLabels()');*/

        return $grid;
    }

    /**
     * @param bool $canEdit
     * @return EntityEditor
     */
    public static function orderEntityEditor(bool $canEdit = false) :EntityEditor {
        $editor = new EntityEditor('order', 'Objednávka', 'admin/order');
        $editor->setBackUrl(Menu::getInstance()->getItemById(Navigation::ORDER_LIST)->getUrl());
        $editor->enableStandalone();
        $editor->setEntityNameColumn('OrderNumber');

        // tab informace o zakaznikovi
        $tab = $editor->addTab('Informace o zákazníkovi', 'customer-information');
        $tab->setColumns(2);

        foreach (['a' => 'Fakturační adresa', 'da' =>  'Doručovací adresa'] as $address => $addressName) {
            $group = $tab->addGroup($addressName);
            $form = $group->addForm();

            $form->setColumns(2);
            $form->addTextBox($address . 'FirstName', 'Křestní jméno');
            $form->addTextBox($address . 'LastName', 'Příjmení');
            $form->addTextBox($address . 'Street', 'Ulice a číslo popisné');
            $form->addTextBox($address . 'City', 'Město');
            $form->addTextBox($address . 'ZipCode', 'PSČ');

            if ( $addressName == 'Fakturační adresa' ) {
                $form->addTextBox($address . 'CompanyName', 'Název společnosti');
                $form->addTextBox($address . 'IC', 'IČ');
                $form->addTextBox($address . 'DIC', 'DIČ');
            }
        }

        $group = $tab->addGroup(translate('Informace o zákazníkovi'));
        $form = $group->addForm();
        $form->addTextBox('TrackingUrl', translate('Tracking URL'), false);
        $form->addTextBox('ParcelNumber', translate('Číslo balíku'), false);
        $form->addDateBox('Date', translate('Datum'));
        $form->addDateBox('DatePayed', translate('Datum zaplacení'));
        $form->addEmpty()->setHtml('<div id="customer-information" style="padding: 20px"></div>');

        $group = $tab->addGroup(translate('Informace o výdejním místě'));
        $form = $group->addForm();
        $form->addTextBox('PickupPlace_ID', 'ID výdejního místa')->setReadOnly(true);
        $form->addTextBox('PickupPlaceName', 'Název')->setReadOnly(true);
        $form->addTextBox('PickupPlaceAddress', 'Adresa')->setReadOnly(true);


        $group = $tab->addGroup('Další informace o objednávce');
        $form = $group->addForm();
        $form->addTextArea('Description', 'Poznámka:');
        $form->addBoolRadioButton('CompleteOrder', 'Kompletní objednávka:');


        // tab informace o zakaznikovi
        $tab = $editor->addTab(translate('Položky objednávky'));
        $group = $tab->addGroup(translate('Položky objednávky'));
        $group->setColumnSize(8);

        $grid = $group->addGridVue('orderItems', 'Položky objednávky');
        $grid->setUrl('admin/order-item');
        $grid->addEditor('admin/order/edit-order-item');
        $grid->setParentEntity('Order_ID');
        $grid->setEnabledActions(true, true, true);

        $grid->addColumn(COLUMN_CUSTOM, 'ProductName', 'Produkt');
        $grid->addColumn(COLUMN_NUMBER, 'PriceWithoutVat', 'Cena bez DPH', 50);
        $grid->addColumn(COLUMN_NUMBER, 'PriceWithVat', 'Cena s DPH', 50);
        $grid->addColumn(COLUMN_NUMBER, 'Quantity', 'Množství', 35)->setEditable(1);
        $grid->addColumn(COLUMN_NUMBER, 'TotalPriceWithoutVat', 'Celkem bez DPH', 50);
        $grid->addColumn(COLUMN_NUMBER, 'TotalPriceWithVat', 'Celkem s DPH', 50);

        $group = $tab->addGroup(translate('Doprava a platba'));
        $group->setColumnSize(4);
        $form = $group->addForm();
        $productsInfo = $form->addEmpty();
        $productsInfo->setAttribute('class', 'col-12');
        $productsInfo->setHtml('<div id="products-information"></div>');

        // tab parametry produktu
        $tab = $editor->addTab('Stavy objednávky');
        $group = $tab->addGroup('Stavy objednávky');

        $grid = $group->addGridVue('orderStates', 'Stavy objednávky');
        $grid->setUrl('admin/order-state');
        $grid->addEditor('admin/order/edit-order-state');
        $grid->setParentEntity('Order_ID');
        $grid->setEnabledActions(true, false, false);
        $grid->addColumn(COLUMN_ENTITY, 'OrderStateType_ID', 'Stav')->setEntity('ID', 'Name' . Languages::getLangCode(), array('module' => 'admin', 'controller' => 'order-state-type'));
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum');
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas');
        $grid->addColumn(COLUMN_TEXT, 'Description', 'Poznámka');
        $grid->addColumn(COLUMN_TEXT, 'TrackingNumber', 'Číslo balíku');

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function createOrderItemQEditor() :QuickEditor {
        $editor = new QuickEditor(translate('Položky objednávky'), 'admin/order-item');
        $editor->addComboBoxStore('Product_ID', 'Produkt', array('module' => 'admin', 'controller' => 'product'), 'FullName', true);
        $editor->addNumericBox("Quantity", "Množství")->setValue(1);
        $editor->addFloatingPointBox("PriceWithoutVat", "Cena ks bez DPH");
        $editor->addFloatingPointBox("PriceWithVat", "Cena ks s DPH");

        return $editor;
    }

    /**
     * @return QuickEditor
     */
    public static function orderStateEditor() :QuickEditor {
        $editor = new QuickEditor('Stavy objednávky', 'admin/order-state');
        $editor->addComboBoxStore('OrderStateType_ID', 'Stav:', array('module' => 'admin', 'controller' => 'order-state-type'), 'Name' . Languages::getLangCode(), true);
        $editor->addTextArea("Description", "Poznámka:");
        $editor->addTextArea("DescriptionCustomer", "Zpráva zákazníkovi:");
        $editor->addTextBox('TrackingNumber', 'Číslo balíku:');

        return $editor;
    }

    /**
     * @return Form
     */
    public static function createOrderStateForm() :Form {
        $form = new Form();
        $form->setAction(_bu() . '/admin/order/set-order-state-done');
        $form->setAjax();

        $group = $form->addFormGroup();
        $group->addComboBoxStore('OrderState_ID', 'Stav', ['module' => 'admin', 'controller' => 'order-state-type'], 'Name' . Languages::getLangCode(), true);
        $group->addHidden('Order_IDs')->setRequired(true, 'Vyberte alespoň jednu objednávku');

        return $form;
    }

    /**
     * @return Grid
     */
    public static function orderSimpleGrid() :Grid {
        $grid = new GridVue('order', translate('Seznam objednávek'));
        $grid->enableSearch(['OrderNumber'], translate('Zadejte hledaný výraz'));
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/order');
        $grid->setOrder('ID DESC');

        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'OrderNumber', translate('Číslo objednávky'));
        $grid->addColumn(COLUMN_DATE, 'Date', translate('Datum'), 50);
        $grid->addColumn(COLUMN_TEXT, 'Time', translate('Čas'), 50)->setFilter(false);

        return $grid;
    }

    /**
     * @param $orderGrid
     * @return Grid
     */
    public static function gopayPaymentGrid($orderGrid) :Grid {
        $grid = new GridVue('orderPayment', translate('Seznam plateb'));
        $grid->enableSearch(['GopayID'], translate('Zadejte hledaný výraz'));
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/gopay-payment');
        $grid->setOrder('ID DESC');
        $grid->setParentGrid($orderGrid, 'Order_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'GopayID', 'GopayID');
        $grid->addColumn(COLUMN_TEXT, 'GopayURL', 'GopayURL');
        $grid->addColumn(COLUMN_DATE, 'Date', translate('Datum'), 50);
        $grid->addColumn(COLUMN_TEXT, 'Time', translate('Čas'), 50)
            ->setFilter(false);

        return $grid;
    }

    /**
     * @param $gopayPaymentGrid
     * @return Grid
     */
    public static function gopayPaymentStateGrid($gopayPaymentGrid) :Grid {
        $grid = new GridVue('orderPaymentState', translate('Seznam stavů plateb'));
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/gopay-payment-state');
        $grid->setOrder('ID DESC');
        $grid->setParentGrid($gopayPaymentGrid, 'GopayPayment_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum', 50);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 50)->setFilter(false);
        $grid->addColumn(COLUMN_ENTITY, 'OrderStateType_ID', 'Stav', 300)
            ->setEntity('ID', 'Name' . Languages::getLangCode(), array('module' => 'admin', 'controller' => 'order-state-type'));

        return $grid;
    }

    /**
     * @param $orderGrid
     * @return Grid
     */
    public static function balikobotPackageGrid($orderGrid) :Grid {
        $grid = new GridVue('balikobotPackage', translate('Seznam stavu balíku'));
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/balikobot-package');
        $grid->setOrder('ID DESC');
        $grid->setParentGrid($orderGrid, 'Order_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'PackageID', 'PackageID', 50);
        $grid->addColumn(COLUMN_TEXT, 'TrackingURL', 'TrackingURL')->setFormatFunction('formatUrl');
        $grid->addColumn(COLUMN_TEXT, 'LabelURL', 'LabelURL')->setFormatFunction('formatUrl');
        $grid->addColumn(COLUMN_TEXT, 'CarrierID', 'CarrierID');
        $grid->addColumn(COLUMN_TEXT, 'BalikobotOrderID', 'BalikobotOrderID');

        return $grid;
    }

    /**
     * @param $balikobotPackageGrid
     * @return Grid
     */
    public static function balikobotPackageStateGrid($balikobotPackageGrid) :Grid {
        $grid = new GridVue('balikobotState', translate('Seznam stavu balíku'));
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/balikobot-state');
        $grid->setOrder('ID DESC');
        $grid->setParentGrid($balikobotPackageGrid, 'BalikobotPackage_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_DATE, 'Date', translate('Datum'), 50);
        $grid->addColumn(COLUMN_TEXT, 'Time', translate('Čas'), 50)->setFilter(false);
        $grid->addColumn(COLUMN_TEXT, 'StatusID', 'StatusID');
        $grid->addColumn(COLUMN_TEXT, 'State', translate('Stav'));
        $grid->addColumn(COLUMN_TEXT, 'Message', translate('Zpráva'));

        return $grid;
    }

    public static function createBalikobotAddPackageForm(Order $order): Form {
        $form = new Form();
        $form->setAction(_bu() . '/admin/order/balikobot-add-package');
        $form->setAjax();

        $group = $form->addFormGroup();
        $packageCount = $group->addNumericBox('PackageCount', translate('Počet balíků'));
        $packageCount->setElementAttribute('min', 1);
        $packageCount->setElementAttribute('max', 10);
        $packageCount->setValue(1);

        $weight = $group->addNumericBox('Weight', translate('Hmotnost'));
        $weight->setElementAttribute('min', 0);
        $weight->setValue($order->TotalWeight);

        $group->addHidden('Order_IDs')
            ->setValue($order->ID)
            ->setRequired(true, translate('Vyberte alespoň jednu objednávku'));

        return $form;
    }

    public static function csobPaymentGrid(Grid $orderGrid) {
        $grid = new GridVue('orderPayment', translate('Seznam plateb'));
        $grid->enableSearch(['CsobID'], translate('Zadejte hledaný výraz'));
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/csob-payment');
        $grid->setOrder('ID DESC');
        $grid->setParentGrid($orderGrid, 'Order_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_TEXT, 'CsobID', 'ČSOB ID');
        $grid->addColumn(COLUMN_TEXT, 'CsobURL', 'ČSOB URL');
        $grid->addColumn(COLUMN_DATE, 'Date', translate('Datum'), 50);
        $grid->addColumn(COLUMN_TEXT, 'Time', translate('Čas'), 50)
            ->setFilter(false);

        return $grid;
    }

    public static function csobPaymentStateGrid(Grid $csobPaymentGrid) {
        $grid = new GridVue('orderPaymentState', translate('Seznam stavů plateb'));
        $grid->setEnabledActions(false, false, false);
        $grid->setUrl('admin/csob-payment-state');
        $grid->setOrder('ID DESC');
        $grid->setParentGrid($csobPaymentGrid, 'CsobPayment_ID');
        $grid->addColumn(COLUMN_ID, 'ID', 'ID');
        $grid->addColumn(COLUMN_DATE, 'Date', 'Datum', 50);
        $grid->addColumn(COLUMN_TEXT, 'Time', 'Čas', 50)->setFilter(false);
        $grid->addColumn(COLUMN_ENTITY, 'OrderStateType_ID', 'Stav', 300)
            ->setEntity('ID', 'Name' . Languages::getLangCode(), array('module' => 'admin', 'controller' => 'order-state-type'));

        return $grid;
    }
}