<?php

namespace user\view\Login;

use Clevis_Helper as Helper;
use Clevis_Image as Image;
use Clevis_View as View;

class ViewLogin extends View {

    public function  __construct() {
        parent::__construct('login');

        $this->setStyle('padding', '10px');
        $this->addCode('<h1 style="border-bottom: 1px solid silver;">Přihlášení</h1>');

        $panelLogin = $this->addElementDiv();
        $panelLogin->addCode('<table><tr><td>');

        $form = $panelLogin->addForm();
        $form->setName('login');
        $form->setElementAttribute('action', Helper::formatUrl('/user/login/process'));
        $form->setElementAttribute('method','post');
        $form->addTextBox('Name','Přihlašovací jméno:',true);
        $password = $form->addTextBox('Password','Heslo:');
        $password->setElementAttribute('type','password');

        $panelLogin->addCode('</td><td>');       
        $panelLogin->addCode(Image::render('image-login', Image::PICTURE));
        $panelLogin->addCode('</td></tr></table>');

        $actionSet = $panelLogin->addActionSet();
        $actionSet->addAction('confirm', 'Přihlásit se', 'image-ok')->setBody('window.loginDoLogin();');
        $actionSet->setOnEnterKeyAction('confirm');
        $actionSet->setAlign(ALIGN_RIGHT);
        $actionSet->setStyle('border-bottom', '1px solid silver');

        $this->addPlaceholder('ViewLogin',
            array(
                '[form]' => $form
            )
        );
    }
}

?>
<?php placeholderStart("ViewLogin"); ?>
<script type="text/javascript">

    require(["dojo/_base/xhr", "clevis/dialog"], function(xhr, dialog){
        window.loginDoLogin = function() {
            var progressDialog = dialog.showProgress("Přihlášení do systému");
            progressDialog.setText("Kontroluji přihlašovací údaje....");
            if ( [form].isValid() ) {
                xhr.post({
                    form: [form].domNode,
                    handleAs: "text",
                    load: function(data,ioArgs) {
                        if ( ioArgs.xhr.getResponseHeader("x-auth") == "correct") {
                            progressDialog.setText("Správné přihlašovací údaje, probíhá přesměrování...");
                            window.location.href = "<?= Helper::getRequestedUrl(); ?>";
                        } else {
                            progressDialog.setCompletedText("Neplatné přihlašovací údaje!");
                        }
                    },
                    error: function(error) {
                        progressDialog.setText("Při kontrole přihlašovacích údajů se vyskytla chyba!");
                    }
                });
            } else {
                progressDialog.setCompletedText("Zadejte přihlašovací jméno a heslo!");
            }
        };
    });
</script>
<?php placeholderEnd(); ?>