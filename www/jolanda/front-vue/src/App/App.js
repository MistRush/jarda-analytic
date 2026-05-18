import Router from "./Router/Router";
import Layout from "./Layout/Layout";
import User from "./User/User";
import AppComponent from "./App.vue";
import { createApp } from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import { useAjax } from "@/Composables/useAjax.js";
import { useErrorHandler } from "@/App/composables/useErrorHandler";
import { useErrorHandlerStore } from "@/App/stores/errorHandlerStore";
import { useAppStore } from "@/App/stores/appStore";
import { useAlertStore } from "@/Components/Panel/stores/panelStore";
import { addCustomTab } from "@vue/devtools-api";

//translations
import translationPlugin from "@/App/Translation/translationPlugin.js";

export default class App {
    static userClass = User;

    router;
    layout;
    settings;
    element;
    user = null;
    panelStore = null;
    buildTime = window.initJolandaBuildTime;

    title = null;

    constructor(settings) {
        this.settings = settings;

        this.layout = new Layout(settings, this);
        this.router = new Router([], this.layout.menu);
        this.user = settings.user ? new App.userClass(settings.user) : null;
        this.panelStore = useAlertStore(window.pinia);
    }

    static createInstance() {
        const appEl = document.getElementsByTagName("JolandaApp")[0];

        if (appEl) {
            const settings = JSON.parse(appEl.attributes["settings"].value);

            const jolandaApp = new this(settings);
            jolandaApp.element = appEl;

            return jolandaApp;
        }

        return;
    }

    mountApp(options = {}) {
        const store = useAppStore(window.pinia);
        store.setApp(this);

        // const app = createApp(AppComponent, {app: this});
        const app = createApp(AppComponent);
        app.use(this.router.createRouter());
        app.use(VueAxios, axios);
        app.use(window.pinia);

        this.router.router.beforeEach(async (to, from, next) => {
            const { app } = useAppStore(window.pinia);

            if (to.meta.fetchServerData) {
                try {
                    // to.meta.loading = true; // Nastav loading stav
                    // const data = await to.meta.fetchData();
                    app.layout.state.loading = true;
                    const ajax = useAjax();
                    const response = await ajax.post(basePath + to.fullPath, {});
                    const data = response.response.data;
                    to.meta.fetchedData = data; // Načtená data
                } catch (error) {
                    console.error("Chyba při načítání dat:", error);
                    app.layout.state.loading = false;
                    // next({ path: "/error" });
                    return;
                } finally {
                    app.layout.state.loading = false;
                }
            }
            next();
        });

        app.use(translationPlugin, this);

        const isDevelopment = import.meta.env.DEV;
        if(!isDevelopment && options?.errorPath) {
            const errorHandler = useErrorHandler(app, options.errorPath);
            const errorHandlerStore = useErrorHandlerStore(window.pinia);

            errorHandler.initErrorHandler();
            errorHandlerStore.setErrorHandler(errorHandler);
        }

        if (options.docsUrl) {
            addCustomTab({
                // unique identifier
                name: "jolanda-docs",
                // title to display in the tab
                title: "Jolanda Docs",
                // any icon from material design icons or a URL to an image
                icon: "https://vueuse.org/favicon.svg",
                // iframe view
                view: {
                    type: "iframe",
                    src: options.docsUrl,
                },
                category: "advanced",
            });
        }

        app.mount(this.element);

        return app;
    }

    get basePath() {
        return this.settings.basePath;
    }

    checkBuildVersion(buildTime) {
        if (this.buildTime != buildTime && this.buildTime && buildTime) {
            this.buildTime = buildTime;
            this.layout.newVersionModal.show = true;
            this.layout.newVersionAlert.show = true;
        } else if (!this.buildTime) {
            this.buildTime = buildTime;
        }
    }
}
