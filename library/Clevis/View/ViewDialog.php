<?php

/**
 * Class for rendering view with dialog
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_View_ViewDialog extends Clevis_View {

    /**
     * Constructor
     *
     * @param entityId
     * @param array $url
     * @param Clevis_View_Dialog|null $dialog
     * @param null $permission
     */
    public function __construct($entityId, $url, Clevis_View_Dialog $dialog = null, $permission = null) {
        parent::__construct();
        
        // Get current navigation item
        $navigationItem = Default_Logic_Navigation::getInstance()->getItemForCurrentUrl();
        if ( $navigationItem == null ) {
            throw new Exception('Tato stánka není k dispozici nebo k ní aktuální uživatel nemá přístup!');
        }

        // Get permission from navigation
        if ( $permission == null )
            $permission = $navigationItem->getPermission();

        // Set permission
        if ( $permission != null )
            $this->setPermission($permission);

        $name = $dialog->getTitle();
        if ( Clevis_Helper::isDevelopmentEnvironment() )
            $name .= ' [ID = ' . $entityId . ']';

        // Render title
        $panelTitle = Clevis_View_ViewPage::renderTitle($name, $navigationItem, $this);
        Clevis_View_ViewPage::renderTitleMenu($navigationItem, $panelTitle);

        // Add entity
        $entity = $this->addEntity();
        $entity->setStyle('text-align', 'center');
        $entity->setIdentifier('ID');
        $entity->addDialog($dialog, array(), $url);
        
        // Setup dialog
        $dialog->setInline(true);
        $dialog->setStyle('text-align', 'left');

        // Add javascript
        $this->addPlaceholder('Clevis_ViewDialog',
            array(
                '[entity]' => $entity,
                '[entityId]' => $entityId
            )
        );
    }
    
}

?>
<?php placeholderStart("Clevis_ViewDialog"); ?>
<script type="text/javascript">

    require(["clevis/ready!"], function() {
        setTimeout(function(){
            [entity].editEntity({ID: [entityId]});
            [entity].onAfterEditEntity = function() {
                history.go(-1);
            }
        },0)
    });

</script>
<?php placeholderEnd(); ?>