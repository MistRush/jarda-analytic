<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
</script>

<template>
    <DocPage>
        <template #title> EntityLog</template>
        <template #content>
            <p>Komponenta
                <Prop>EntityLog</Prop>
                zobrazí modal s historií dané entity. Nejlepším použitím je v
                <Prop>DataGrid</Prop>
                , kde lze zobrazovat historii změn a kdo dané změny provedl.
            </p>


            <Example title="Před prvotním použitím">
                <p>1) Je nutné mít vytvořené tyto dvě tabulky</p>
                <Preview
                    code="
    property $ID int
    property $User_ID int
    property $URL string
    property $Entity string
    property $Entity_ID int
    property $DateTime \timestamp
    property $Action string
    property $user User_Model_User
    property $entityLogValues Doctrine_Collection
                    "
                >
                    Admin_Model_EntityLog
                </Preview>
                <Preview
                    code="
    property $ID int
    property $EntityLog_ID int
    property $Field string
    property $OldValue string
    property $NewValue string
    property $entityLog Admin_Model_EntityLog
                    "
                >
                    Admin_Model_EntityLogValues
                </Preview>

                <p>2) Do souboru s
                    <Prop>Doctrine_Record</Prop>
                    musíme přidat property, zda logovat změny u dané entity a také jednu
                    funkci pro získání popisku dané entity.
                </p>
                <Preview
                    code="
    abstract class Doctrine_Record extends Doctrine_Record_Abstract implements Countable, IteratorAggregate, Serializable
    {
        public $logChanges = false;

        public function getEntityDescription()
        {
            return get_class($this);
        }
    }
                    "
                >
                    library/Doctrine/Record.php
                </Preview>

                <p>3) U všech entit, které chceme logovat, tak musíme přidat property
                    <Prop>logChanges</Prop>
                    na true. Volitelně
                    můžeme také přidat override na funkci
                    <Prop>getEntityDescription()</Prop>
                    , abychom dostali více informací.
                    Například u logování textů v blogových článcích si zobrazíme (po zobrazení historie blogu a poté
                    proklikem na historii blogLangu) kód jazyka a název článku.
                </p>
                <Preview
                    code="
    class Admin_Model_BlogLang extends Admin_Model_Base_BlogLang
    {
        public $logChanges = true;

        public function getEntityDescription()
        {
            return $this->language->Code . ' - ' . $this->blog->getLang()->Title;
        }
    }
                    "
                >
                    application/modules/admin/models/OrderItem.php
                </Preview>

                <p>4) Vytvoříme třídu
                    <Prop>Default_Logic_EntityLogger</Prop>
                    a nadefinujeme funkci, pro získání ID aktuálního uživatele.
                </p>
                <Preview
                    code="

    use Jolanda\RecordListener\EntityLogger;
    use user\logic\UserSession;

    class Default_Logic_EntityLogger extends EntityLogger
    {
        protected function getCurrentUserID(): int
        {
            return UserSession::getCurrentUserID();
        }
    }

                    "
                >
                    application/modules/default/logic/EntityLogger.php
                </Preview>

                <p>5) Přidáme také record listenery</p>
                <Preview
                    code="
    class Clevis_Bootstrap extends Zend_Application_Bootstrap_Bootstrap
    {
        protected function _initDoctrine($dsn = null)
        {
            ...
            Doctrine_Manager::getInstance()->addRecordListener(new Default_Logic_EntityLogger());

            Clevis_Timer::stop('app-init-doctrine');
        }
    }
                    "
                >
                    library/Clevis/Bootstrap.php
                </Preview>
                <Preview
                    code="
    class Doctrine_Template_Sluggable extends Doctrine_Template
    {
        public function setTableDefinition()
        {
            ...
            $this->addListener(new Doctrine_Template_Listener_Sluggable($this->_options));
            $this->addListener(new Default_Logic_EntityLogger());
        }
    }
                    "
                >
                    library/Doctrine/Template/Sluggable.php
                </Preview>
            </Example>

            <Example title="Základní použití">
                <Preview
                    code='
  <script setup>
    import {useGrid} from "@/DataGrid/js/useGrid.js";
    import {useEntityLog} from "@/Composables/useEntityLog.js";
    import {useAlerts} from "@/Composables/useAlerts.js";

    const alert = useAlerts();
    const {grid} = useGrid("orderListGrid");

    const showHistory = () => {
      const currentItem = grid.value.getCurrentItem();
      if (!currentItem || currentItem.length !== 1) {
        alert.error("Vyberte pouze jednu objednávku");
        return;
      }

      useEntityLog("Admin_Model_Order", currentItem[0].ID);
    };
  </script>
  <template>
    <DataGrid
        id="orderListGrid"
    >
        <template #columns>
            ...
        </template>
        <template #actions>
            <Action icon="cog" label="Historie" @click="showHistory"/>
        </template>
    </DataGrid>
  </template>
        '
                >

                </Preview>
            </Example>

        </template>
    </DocPage>
</template>
