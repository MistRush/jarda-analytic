import {useAppStore} from "@/App/stores/appStore.js";
import {reactive} from "vue";

export function useTranslations(_app = null){
    const app = _app ? _app : useAppStore()?.getApp();
    const translations = app ? app.settings.translations.core : (window.translations ?? {});
    const state = reactive({translations: app ? app.settings.translations : null});

    const translate = (origText) => {
        if(!state.translations) return origText;

        let translatedText = state.translations.translations[origText] ?? origText;

        if(translatedText === '') return origText;

        return translatedText;
    }

    // TODO druhý parametr locale
    const _l = (origText) => {
        return translate(origText);
    }

    const locale = state.translations?.locale;
    const activeLanguages = state.translations?.activeLanguages;
    const languages = state.translations?.languages;

    return {
        translations,
        translate,
        _l,
        locale,
        activeLanguages,
        languages
    }
}