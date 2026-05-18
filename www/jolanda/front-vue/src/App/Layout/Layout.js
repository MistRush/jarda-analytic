import Menu from "./Menu/js/Menu";

export default class Layout {
    settings = {};
    menu = null;
    component = null;
    state = {
        loading: false,
        hideLayout: false,
        isMobile: false,
    };
    app = null;
    newVersionModal = {
        show: false,
    };
    newVersionAlert = {
        show: false,
    };

    constructor(settings, app) {
        this.settings = settings;
        this.app = app;

        if (!settings.menu) {
            this.menu = new Menu(this);
        } else {
            this.menu = Menu.createInstance(settings.menu, app);
        }
    }

    setComponent(component) {
        this.component = component;
        return this;
    }
}
