import { useTranslations } from "@/Composables/useTranslation.js"

export default {
    install(app, coreApp) {
        // Získáme funkci `_` z composable
        const { _l } = useTranslations(coreApp);
        // const l  = (a) => {
        //     return a
        // };
        // Registrujeme ji jako globální vlastnost
        app.config.globalProperties._l = _l;
    }
};