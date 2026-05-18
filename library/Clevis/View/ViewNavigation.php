<?php

/**
 * Class that represents main browseable navigation menu
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ViewNavigation extends Clevis_View_ViewPage {

    private $code;

    private $ignoreChildren = array(

        );

    /**
     * Constructor
     * 
     * @param code  Navigation item code
     */
    public function __construct($code) {
        $this->code = $code;

        parent::__construct(null, null, null, false);
    }


    /**
     * @override
     */
    protected function appendContent(Clevis_View_Container & $content)
    {
        $code = $this->code;

        if ( $code == null )
            $code = CLEVIS_NAVIGATION_MAIN;

        // Get main navigation item
        $navigation = Clevis_Navigation::getInstance()->getItem($code);
        if ( $navigation == null )
            throw new Exception('No navigation item for code [' . $code . ']!');

        // Get navigation properties
        $name = $navigation->getName();
        $description = $navigation->getDescription();
        $image = $navigation->getImage();

        // Add title
        $panelTopContent = $content->addElementDiv();
        $panelTopContent->setClass('clevis-view-page-title');
        $panelTopContent->setVerticalAlign(ALIGN_MIDDLE, 'clevis-view-page-title-item');
        $panelTopContent->addImage($navigation->getImage(), Clevis_Image::ICON_NORMAL);

        if ( $navigation->getCode() != Module::MAIN )
            self::renderTitleMenu($navigation, $panelTopContent, true);
        $panelTopContent->addElement('h1', $name);

        // Add image
        if ( $image != null )
            $content->addImage($image, Clevis_Image::PICTURE, 'clevis-float-left');

        // Add description
        $content->addElement('p', $description);

        // Add statistics
        if ( count($navigation->getStatistic()) > 0 )
            $content->addCode(Clevis_View_NavigationBox::renderStatistics($navigation));

        // Clear float
        if ( $image != null )
            $content->addFloatClear();

        // Add navigation boxes
        foreach ( $navigation->getChildren() as $navigationItem ) {
            if ( in_array($navigationItem->getCode(), $this->ignoreChildren) == false ) {
                $navigationBox = new Clevis_View_NavigationBox($navigationItem);
                $content->addItem($navigationBox);
            }
        }
    }
}

?>