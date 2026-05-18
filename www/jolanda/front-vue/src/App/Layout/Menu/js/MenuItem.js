export default class MenuItem {
    id = null;
    name = null;
    URL = null;
    icon = null;
    menuItems = [];
    visible = true;
    menu = null;
    description = null;
    badge = null;
    parentItem = null;
    tags = [];
    developers = [];
    responsiblePersons = [];
    isFavorite = false;

    constructor(id, name, URL, icon = null, description = null, visible = true, menu = null) {
        this.id = id;
        this.name = name;
        this.URL = URL;
        this.icon = icon;
        this.description = description;
        this.visible = visible;
        this.menu = menu;
    }

    addItem(id, name, URL, icon = null, description = null, visible = true) {
        const item = new MenuItem(id, name, URL, icon, description, visible, this.menu);
        item.parentItem = this;

        this.menuItems.push(item);

        return item;
    }

    getURL() {
        return this.URL;
    }
}
