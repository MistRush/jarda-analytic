<script setup>
import Layout from "@/App/Layout/Layout.vue";
import { useAppStore } from "@/App/stores/appStore.js";
import { onMounted, shallowRef, toRaw } from "vue";
import { useCookies } from "@/Composables/useCookies";
import { useTranslations } from "@/Composables/useTranslation.js";
import { setLocale } from "yup";

const props = defineProps({
    app: Object,
});

const { app } = useAppStore(window.pinia);
const { translations } = useTranslations();
// app.setApp(props.app);
window.app = app;

const cookies = useCookies();

//YUP locale
setLocale({
    mixed: {
        required: translations.VALIDATION_MIXED_REQUIRED,
        oneOf: translations.VALIDATION_MIXED_ONEOF,
        notOneOf: translations.VALIDATION_MIXED_NOTONEOF,
        defined: translations.VALIDATION_MIXED_DEFINED,
    },
    string: {
        email: translations.VALIDATION_STRING_EMAIL,
        min: translations.VALIDATION_STRING_MIN,
        max: translations.VALIDATION_STRING_MAX,
        matches: translations.VALIDATION_STRING_MATCHES,
        url: translations.VALIDATION_STRING_URL,
        length: translations.VALIDATION_STRING_LENGTH,
        uuid: translations.VALIDATION_STRING_UUID,
        trim: translations.VALIDATION_STRING_TRIM,
        lowercase: translations.VALIDATION_STRING_LOWERCASE,
        uppercase: translations.VALIDATION_STRING_UPPERCASE,
    },
    number: {
        min: translations.VALIDATION_NUMBER_MIN,
        max: translations.VALIDATION_NUMBER_MAX,
        lessThan: translations.VALIDATION_NUMBER_LESSTHAN,
        moreThan: translations.VALIDATION_NUMBER_MORETHAN,
        positive: translations.VALIDATION_NUMBER_POSITIVE,
        negative: translations.VALIDATION_NUMBER_NEGATIVE,
        integer: translations.VALIDATION_NUMBER_INTEGER,
    },
    date: {
        min: translations.VALIDATION_DATE_MIN,
        max: translations.VALIDATION_DATE_MAX,
    },
    array: {
        min: translations.VALIDATION_ARRAY_MIN,
        max: translations.VALIDATION_ARRAY_MAX,
        length: translations.VALIDATION_ARRAY_LENGTH,
    },
    object: {
        noUnknown: translations.VALIDATION_OBJECT_NOUNKNOWN,
    },
});

onMounted(async () => {
    const hasDarkMode = document.documentElement.classList.contains("dark-theme");

    cookies.setCookie("color-mode", hasDarkMode ? "prefer-dark" : "prefer-light", 999);
});

const layoutComponent = shallowRef(toRaw(app.layout.component ?? Layout));
</script>

<template>
    <component :is="layoutComponent"> </component>
</template>
