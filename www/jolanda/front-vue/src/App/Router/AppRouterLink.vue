<script setup>
import { computed } from "vue";
import { useAppStore } from "@/App/stores/appStore";
import { RouterLink } from "vue-router";

const props = defineProps({
    to: {
        type: [String, Object],
        required: true,
    },
    dataDescription: {
        type: String,
        default: "",
    },
    dataLevel: {
        type: [String, Number],
        default: 1,
    },
    class: {
        type: String,
        default: "",
    },
});

const { app } = useAppStore(window.pinia);
const basePath = window.basePath;

// Kontrola, zda URL existuje v routeru
const isRouterLink = computed(() => {
    if (typeof props.to === "object") {
        return true;
    }

    let path = props.to.startsWith("/") ? props.to.slice(1) : props.to;
    path = path.split("?")[0];

    return app.router.routes.some((route) => {
        // Kontrola hlavní cesty
        if (route.path.slice(1) === path) return true;

        // Kontrola aliasu (pokud existuje)
        if (route.alias && typeof route.alias === "string" && route.alias.slice(1) === path) return true;

        if (route.alias && Array.isArray(route.alias)) {
            let found = false;
            route.alias.forEach((alias) => {
                if (alias.slice(1) === path) {
                    found = true;
                    return;
                }
            });

            return found;
        }

        return false;
    });
});

// Upravená URL pro <a> tag
const hrefUrl = computed(() => {
    return props.to.startsWith("/") ? basePath + props.to : basePath + "/" + props.to;
});
</script>

<template>
    <RouterLink v-if="isRouterLink" :to="to" :class="{ [props.class]: true }" :data-description="dataDescription" :data-level="dataLevel">
        <slot />
    </RouterLink>
    <a v-else :href="hrefUrl" :class="{ [props.class]: true }" :data-description="dataDescription" :data-level="dataLevel">
        <slot />
    </a>
</template>
