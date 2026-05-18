#FileManager

V nevé verzi Filemanageru, je třeba kvůlu bezpočnosti si vytvořit vlastní controller přes který se bude do něho přistupovat.

Stačí vytvořit controller, který bude dědit z controlleru, který se nachází přímo v jolandě. Zatím se musí jmenovat controller přesně takhle a být v modulu admin.

```php
use \Jolanda\FileManager\FileManagerController;

class Admin_FileManagerController extends FileManagerController
{
    protected function isAccessAllowed(){
        if(!User_Logic_Session::getCurrentUserID()){
            return false;
        }else{
            if(!in_array(User_Logic_Session::getCurrentUserType(), [User_Model_User::TYPE_SUPERADMIN, User_Model_User::TYPE_ADMIN])){
                return false;
            }
        }

        return true;
    }
}
```

Přepíšeme si funkci isAccessAllowed podle toho jaký typ uživatele chceme, aby měl přístup k filemanageru. Defaultně funkce vrací vždy false kvůli bezpečnosti.