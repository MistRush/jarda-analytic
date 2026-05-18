import MenuItem from "./MenuItem.js";
export default class Menu {
    menuItems = [];
    searchVisible = false;
    homepageVisible = false;
    layout;
    favorites;

    constructor(layout) {
        this.layout = layout;
    }

    addItem(id, name, URL, icon = null, description = null, visible = true) {
        const item = new MenuItem(id, name, URL, icon, description, visible, this);
        this.menuItems.push(item);

        return item;
    }

    getItemByID(id) {
        let foundItem = null;
        const findItem = (items, id) => {
            if (foundItem) return;

            items.forEach((item) => {
                if (item.id === id) {
                    foundItem = item;
                } else {
                    findItem(item.menuItems, id);
                }
            });
        };

        findItem(this.menuItems, id);

        return foundItem;
    }

    findRouteForMenuItem(router, targetURL) {
        return router.routes.some((route) => route.name === targetURL);
    }

    static createInstance(json, app) {
        const menu = new Menu();
        menu.searchVisible = json.searchVisible ?? false;
        menu.homepageVisible = json.homepageVisible ?? false;
        menu.favorites = json.favorites ?? null;

        const mapItems = (items, parent) => {
            items.forEach((item) => {
                const newItem = parent.addItem(item.id, item.name, item.URL, item.icon, item.description, item.visible); // Přidá aktuální položku
                newItem.badge = item.badge;
                newItem.tags = item.tags;
                newItem.developers = item.developers;
                newItem.responsiblePersons = item.responsiblePersons;

                if (json.favorites) {
                    newItem.isFavorite = json.favorites?.items?.includes(item.id) ?? false;
                    if (newItem.isFavorite) {
                        parent.isFavorite = true;
                    }
                }

                // Pokud má aktuální položka další menuItems, projde je rekurzivně
                if (item.menuItems && item.menuItems.length > 0) {
                    mapItems(item.menuItems, newItem);

                    if (json.favorites && !newItem.isFavorite && newItem.menuItems) {
                        const hasFavorite = newItem.menuItems.filter((i) => i.isFavorite)?.length;

                        if (hasFavorite) {
                            newItem.isFavorite = true;
                            parent.isFavorite = true;
                        }
                    }
                }
            });
        };

        mapItems(json.menuItems, menu);

        return menu;
    }
}
