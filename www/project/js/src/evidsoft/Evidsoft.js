class Evidsoft {
    constructor(request) {
        this.layout = new EvidsoftLayout();
        //this.cart = new Cart();

        this.modules = {};

        this.dispatch();
    }

    dispatch() {
        if (request.module === 'admin'){
            if (request.controller === 'index' && request.action === 'index') {
                this.modules['homepage'] = new Homepage();
            }

            if (request.controller === 'translation') {
                this.modules['translation'] = new Translation(lang);
            }

            if (request.controller === 'order' && request.action === 'list') {
                this.modules['orderList'] = new OrderList();
            }
        }

    }
}