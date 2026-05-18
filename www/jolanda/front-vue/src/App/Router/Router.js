import { createWebHistory, createRouter } from "vue-router";
import { useInternalStore } from "@/App/stores/internalStore";
import Page from "@/App/Page/Page.vue";
import { useTabsStore } from "@/App/stores/tabsStore";

export default class Router {
    routes = [];
    router = null;
    menu = null;

    constructor(routes = [], menu = null) {
        this.routes = routes;
        this.menu = menu;
    }

    addRoute(route) {
        this.routes.push(route);
        return this;
    }

    addRoutes(routes) {
        this.routes = [...this.routes, ...routes];

        return this;
    }

    createRouter() {
        this.router = createRouter({
            history: createWebHistory(),
            routes: this.routes,
        });

        this.router.beforeEach((to, from, next) => {
            const internalStore = useInternalStore(window.pinia);

            // if(from?.meta?.cache){
            //     const cache = {
            //         component: from.name,
            //         activeGrid: null,
            //     };
            //
            //     if(from.meta.activeGrid){
            //         cache.activeGrid = from.meta.activeGrid;
            //     }
            //
            //     internalStore.addPageToCache(cache);
            //     internalStore.setPageDeepCacheCount(0);
            // }else{
            //     internalStore.setPageDeepCacheCount(internalStore.getPageDeepCacheCount() + 1);
            //     // internalStore.clearPageCache();
            // }

            const {
                __jolanda_fromGridId,
                __jolanda_gridParentId,
                __jolanda_gridParentCol,
                ...publicQuery
            } = to.query;

            const tabsStore = useTabsStore(window.pinia);
            tabsStore.openTab({
                id: this.normalizeFullPathWithQuery(to),
                title: to.meta.title ?? "Tab #" + (tabsStore.tabs.length + 1),
                route: to,
                icon: to.meta.icon ?? "invoice",
                fromGridId: __jolanda_fromGridId ?? null,
                gridParentId:  __jolanda_gridParentId ?? null,
                gridParentCol:  __jolanda_gridParentCol ?? null,
            });

            if (__jolanda_fromGridId) {
                next({ ...to, query: publicQuery });
            } else {
                next();
            }
        });

        // this.router.beforeResolve((a) => {
        //     console.log(a);
        //     return true;
        // });
        //
        // this.router.afterEach((to, from, failure) => {
        //     if (isNavigationFailure(failure)) {
        //         console.log('failed navigation', failure)
        //     }else{
        //         console.log(from,to);
        //     }
        // });

        return this.router;
    }

    initRoutes() {
        const modules = import.meta.glob("/src/pages/**/*.vue");

        const routes = [];

        const foundMenuItem = (items, routePath) => {
            let menuItem = null;

            if (menuItem) {
                return menuItem;
            }

            items.forEach((item) => {
                if (menuItem) {
                    return;
                }

                const nonIndexRoutePath = routePath.replace(/(?<!\/index)\/index$/, "");
                let nonIndexMenuItemPath = item.URL.replace(/(?<!\/index)\/index$/, "");

                if (!nonIndexMenuItemPath.startsWith("/")) {
                    nonIndexMenuItemPath = "/" + nonIndexMenuItemPath;
                }

                if (nonIndexRoutePath === nonIndexMenuItemPath) {
                    menuItem = item;
                    return;
                }

                menuItem = foundMenuItem(item.menuItems, routePath);
            });

            return menuItem;
        };

        for (const path in modules) {
            // Extrahujeme relativní cestu a vytvoříme URL routu
            const routePath = path
                .replace("/src/pages", "") // Odebereme začátek
                .replace(/\.vue$/, ""); // Odebereme příponu .vue

            const hasDoubleIndex = /\/index\/index$/.test(routePath);
            let module = null;

            if (hasDoubleIndex) {
                module = routePath.replace(/\/index\/index$/, "");
            }

            const component = modules[path];

            const menuItem = foundMenuItem(this.menu.menuItems, routePath);

            // Kontrola, zda jde o index soubor
            if (routePath.endsWith("index")) {
                const nonIndexRoutePath = routePath.replace(/\/index$/, "");

                routes.push({
                    path: nonIndexRoutePath, // Hlavní cesta s /index
                    alias: hasDoubleIndex ? [routePath, module] : routePath, // Alias bez /index
                    name: routePath.slice(1),
                    components: {
                        default: Page,
                    },
                    props: {
                        default: {
                            pageComponentPath: routePath + ".vue",
                        },
                    },
                    meta: {
                        title: menuItem?.name,
                        icon: menuItem?.icon,
                    },
                });
            } else {
                routes.push({
                    path: routePath,
                    name: routePath.slice(1),
                    components: {
                        default: Page,
                    },
                    props: {
                        default: {
                            pageComponentPath: routePath + ".vue",
                        },
                    },
                    meta: {
                        title: menuItem?.name,
                        icon: menuItem?.icon,
                    },
                });
            }
        }

        this.routes = routes;

        return routes;
    }

    normalizeFullPathWithQuery(route) {
        let path = route.path;

        // Odstranit '/index' na konci
        if (path.endsWith("/index")) {
            path = path.slice(0, -"/index".length);
        }
        if (path === "") {
            path = "/";
        }

        // Serializace query parametrů
        const query = route.query;
        const queryKeys = Object.keys(query)
            .filter((key) => !key.startsWith("__jolanda_"))
            .sort();

        if (queryKeys.length > 0) {
            const queryString = queryKeys
                .map((key) => {
                    const value = query[key];
                    if (Array.isArray(value)) {
                        return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
                    } else if (value !== undefined && value !== null) {
                        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                    } else {
                        return encodeURIComponent(key);
                    }
                })
                .join("&");

            return `${path}?${queryString}`;
        } else {
            return path;
        }
    }
}
