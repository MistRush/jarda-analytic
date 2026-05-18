import "./assets/old.css";
import { createApp } from "vue";
import AlertManager from "@/Components/Alerts/AlertManager.vue";
import Helpbar from "@/Components/Helpbar/Helpbar.vue";
import { createPinia } from "pinia";
import Grid from "@/DataGrid/Components/Grid.vue";
import SubGrid from "@/DataGrid/Components/SubGrid.vue";
import Dashboard from "@/Dashboard/Dashboard.vue";
import TaskAttachments from "@/Dashboard/TaskAttachments/TaskAttachments.vue";
import Icon from "@/Icons/Icon.vue";
import { ColumnTypeCurrency } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCurrency.js";

if (!window.pinia) {
    window.pinia = createPinia(); //TODO TMP
}

ColumnTypeCurrency.VALUE_IS_DECIMAL = false;

const alertsElement = document.getElementById("__alert-manager");
if (alertsElement && !alertsElement.hasAttribute("data-v-app")) {
    const alertsApp = createApp(AlertManager);
    alertsApp.use(window.pinia);
    alertsApp.component("Icon", Icon);
    alertsApp.mount(alertsElement);
}

const components = {
    __dashboard__vue__: Dashboard,
    "__task-attachments__vue__": TaskAttachments,
    '__helpbar': Helpbar,
};

for (const id of Object.keys(components)) {
    const el = document.getElementById(id);
    if (el && !el.hasAttribute("data-v-app")) {
        const props = Array.from(el.attributes)
            .filter((attr) => attr.name.startsWith("data-"))
            .reduce((props, attr) => {
                const propName = attr.name.substring(5).replace(/-./g, (match) => match.charAt(1).toUpperCase());
                try {
                    props[propName] = JSON.parse(attr.value);
                } catch (e) {
                    props[propName] = attr.value;
                }
                return props;
            }, {});
        const componentApp = createApp(components[id], props);
        componentApp.use(window.pinia);
        componentApp.component("Icon", Icon);
        componentApp.mount(el);
    }
}
document.querySelectorAll("Grid:not([data-v-app])").forEach((el) => {
    mountGrid(el);
});

document.querySelectorAll("SubGrid:not([data-v-app])").forEach((el) => {
    mountSubGrid(el);
});

function mountVueComponent() {
    // Zkontroluje, zda element existuje
    // debugger;
    const el = document.getElementById("ContextMenuColumnInfo");
    if (el && !el.hasAttribute("data-v-app")) {
        const props = Array.from(el.attributes)
            .filter((attr) => attr.name.startsWith("data-"))
            .reduce((props, attr) => {
                // Převod názvu atributu z formátu data-attribute-name na attributeName
                const propName = attr.name.substring(5).replace(/-./g, (match) => match.charAt(1).toUpperCase());
                props[propName] = attr.value;
                return props;
            }, {});
        // Jestli ano, vytvoří a připojí Vue aplikaci
        const test = createApp(ContextMenuColumnInfo, props);
        test.mount(el);
    }
}

function mountGrid(gridEl) {
    // const datagridEl = document.getElementById("datagrid");
    if (gridEl && !gridEl.hasAttribute("data-v-app")) {
        const json = gridEl.attributes["json"].value;
        // Jestli ano, vytvoří a připojí Vue aplikaci
        const test = createApp(Grid, { json: json });
        test.use(window.pinia);
        test.mount(gridEl);
    }
}

function mountSubGrid(gridEl) {
    // const datagridEl = document.getElementById("datagrid");
    if (gridEl && !gridEl.hasAttribute("data-v-app")) {
        const json = gridEl.attributes["json"].value;
        // Jestli ano, vytvoří a připojí Vue aplikaci
        const test = createApp(SubGrid, { json: json });
        test.use(window.pinia);
        test.mount(gridEl);
    }
}

const observerCallback = (mutationsList, observer) => {
    const checkNodeAndChildren = (node) => {
        if (node.nodeType === 1) {
            // Zkontrolujte, zda je node element
            if (node.id === "ContextMenuColumnInfo") {
                mountVueComponent();
            }

            if (node.nodeName.toLowerCase() === "grid") {
                mountGrid(node);
            }
            if (node.nodeName.toLowerCase() === "subgrid") {
                mountSubGrid(node);
            }

            // Prohledat rekurzivně všechny děti tohoto uzlu
            node.childNodes.forEach(checkNodeAndChildren);
        }
    };

    for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
                checkNodeAndChildren(node);
            });
        }
    }
};

// Nastavení MutationObserver
const observer = new MutationObserver(observerCallback);

// Konfigurace observeru k sledování přidání nových elementů do DOM
const config = { childList: true, subtree: true };

// Spuštění observeru na celý dokument
observer.observe(document.body, config);
