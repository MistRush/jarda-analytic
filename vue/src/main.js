import "./assets/index.css";
import { createPinia } from "pinia";
import App from "@/App/App.js";
import Layout from "./layouts/Layout.vue";
import RegistrationApp from "./modules/registration/Registration.vue";
import DayApp from "./modules/day/Day.vue";
import LoginApp from "./modules/login/Login.vue";
import "gridstack/dist/gridstack.min.css";
import "splitpanes/dist/splitpanes.css";
import {createApp} from "vue";

window.pinia = window.pinia ?? createPinia();

const jolandaApp = App.createInstance();
if (jolandaApp) {
    jolandaApp.layout.setComponent(Layout);
    jolandaApp.router.initRoutes();
    jolandaApp.mountApp();
}


const dayElement= document.querySelector("#day-app");
console.log (document.querySelector("#day-app"));
if (dayElement) {
    const pinia = createPinia();
    const dayApp = createApp(DayApp);
    dayApp.use(pinia);

    dayApp.mount("#day-app");
} else {
    console.error('Element s ID #day-app nebyl nalezen v DOM.');
}

const registrationElement= document.querySelector("#registration-app");
console.log (document.querySelector("#login-app"));
if (registrationElement) {
    const pinia = createPinia();
    const registrationElement = createApp(RegistrationApp);
    registrationElement.use(pinia);

    registrationElement.mount("#registration-app");
} else {
    console.error('Element s ID #registration-app nebyl nalezen v DOM.');
}

const loginElement= document.querySelector("#login-app");
console.log (document.querySelector("#login-app"));
if (loginElement) {
    const pinia = createPinia();
    const loginApp = createApp(LoginApp);
    loginApp.use(pinia);

    loginApp.mount("#login-app");
} else {
    console.error('Element s ID #registration-app nebyl nalezen v DOM.');
}
