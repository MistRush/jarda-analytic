class customerController {

    myaccountAction() {
        new MyAccount('order-list');
    }
    addressAction() {
        window.address = new Address();
    }

    registerAction() {
        window.registration = new Registration();
    }

    oldaccountAction() {
        window.oldAccountForm = new OldAccountForm();
    }

    changeaddressrequestAction() {
        window.changeAddressRequest = new ChangeAddressRequest();
    }
}