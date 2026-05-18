<?php
namespace user\view\User;

use Clevis_View_DialogEdit as DialogEdit;
use User_Model_User as User;

class DialogUser extends DialogEdit {

    public function __construct($listing = 0, $passwordOnly = false) {
        parent::__construct('Uživatelský účet', 'userDialog', true);

        $tab = $this->addTab('Uživatelský účet');
        $tab->setImage('image-user');

        $form = $tab->addForm();
        $name = $form->addTextBox('Name', 'Název účtu:', true);
        $name->setReadonly($passwordOnly);
        $form->addComboBoxEnum('Type', 'Typ účtu:', User::getUserTypes(), true);

        $password = $form->addTextBox('Password', 'Heslo:', true);
        $password->setElementAttribute('type', 'password');
        $passwordAgain = $form->addTextBox('PasswordConfirmation', 'Heslo znovu:', true);
        $passwordAgain->setElementAttribute('type', 'password');
        $passwordAgain->setDojoAttribute('validator', 'function() { return this.getValue() == dijit.byId("' . $password->getId() . '").getValue(); }');

        // Placeholder
        $this->addPlaceholder('DialogUser', array(
            '[dialog]' => $this,
            '[listing]' => $listing,
            '[form]' => $form)
        );
    }
}
?>

<?php placeholderStart("DialogUser"); ?>
<script type="text/javascript">
    require(["clevis/ready!", "clevis/dialog", "dojo/_base/xhr"], function(ready, dialog, xhr) {
        [dialog].onValidate = function(data) {
            var userId = data['ID'];
            var result = xhr.post({
                url: "<?= _bu(); ?>/user/user/check-user-exist/",
                content: {
                    UserName: [form].getValue("Name"),
                    UserId: userId
                },
                handleAs: "text",
                sync: true
            });
            if (result.ioArgs.xhr.getResponseHeader("x-user") == "exist") {
                dialog.showError("Upozornění", "Zadaný uživatelský účet již existuje!");
                return false;
            }
            return true;
        };

        [dialog].onShow = function() {
            [form].setEnabled("Name", [form].getValue('Name') != 'admin');
        };
    });
</script>
<?php placeholderEnd(); ?>