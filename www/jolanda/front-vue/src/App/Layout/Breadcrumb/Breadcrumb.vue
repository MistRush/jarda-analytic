<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/App/stores/appStore";
import Tooltip from "@/Components/Other/Tooltip.vue";
import Tag from "@/Components/Other/Tag/Tag.vue";

const props = defineProps({});

const route = useRoute();
const { app } = useAppStore();
const menu = app.layout.menu;

// Funkce pro nalezení cesty k aktivní položce
const findActivePath = (items, path = []) => {
    for (const item of items) {
        let itemUrl = item.URL.startsWith("/") ? item.URL.slice(1) : item.URL;
        let currentPath = route.path.slice(1);

        if (currentPath.endsWith("/index")) {
            currentPath = currentPath.slice(0, currentPath.indexOf("/index"));
        }

        if (itemUrl.endsWith("/index")) {
            itemUrl = itemUrl.slice(0, itemUrl.indexOf("/index"));
        }

        // Vytvoříme novou cestu přidáním aktuální položky
        const currentItemPath = [
            ...path,
            {
                id: item.id,
                name: item.name,
                url: "/" + item.URL,
                icon: item.icon,
                description: item.description,
                developers: item.developers,
                tags: item.tags,
            },
        ];

        // Pokud je tato položka aktivní
        if (currentPath === itemUrl) {
            return currentItemPath;
        }

        // Pokud má položka podmenu, projdeme je
        if (item.menuItems?.length) {
            const subPath = findActivePath(item.menuItems, currentItemPath);
            if (subPath) {
                return subPath;
            }
        }
    }

    return null;
};

const currentItem = ref(null);

// Computed property pro získání breadcrumb položek
const breadcrumbItems = computed(() => {
    if (!menu?.menuItems) return [];

    // Pokud jsme na homepage, vrátíme prázdné pole
    if (route.path === "/index" || route.path === "/") {
        return [];
    }

    // Najdeme cestu k aktivní položce
    const path = findActivePath(menu.menuItems);
    if (path) {
        currentItem.value = path[path.length - 1];
    } else {
        currentItem.value = null;
    }

    // Pokud jsme nenašli cestu, vrátíme alespoň homepage
    if (!path) {
        return [];
    }

    return path;
});
</script>

<template>
    <div class="flex justify-between items-center" v-if="breadcrumbItems.length">
        <nav class="breadcrumb text-light flex gap-[0.5rem]">
            <RouterLink to="/" :title="'Homepage'">
                <Icon icon="home" class="w-[13px] hover:text-primary!" />
            </RouterLink>
            <div v-for="(item, index) in breadcrumbItems" :key="item.url" class="flex gap-[0.5rem]">
                <Icon icon="arrow" direction="right" class="w-[8px]" />
                <RouterLink v-if="!item.url.startsWith('/' + app.settings.module + '/menu/index?')" :to="item.url" :title="item.description || item.name">
                    <span
                        class="font-medium hover:text-primary! hover:underline"
                        :class="{
                            'text-primary! underline': index === breadcrumbItems.length - 1,
                        }"
                        >{{ item.name }}</span
                    >
                </RouterLink>
                <div v-else>
                    <span
                        class="font-medium"
                        :class="{
                            'text-primary! underline': index === breadcrumbItems.length - 1,
                        }"
                        >{{ item.name }}</span
                    >
                </div>
            </div>
        </nav>
        <div class="flex gap-2 items-center" v-if="currentItem">
            <Tooltip v-if="currentItem.description" :text="currentItem.description"><Icon icon="QuestionMark" class="w-[16px] text-icon-light-gray hover:text-dark dark:hover:text-outline cursor-pointer" /></Tooltip>
            <div class="flex gap-2 items-center">
                <Tag v-if="currentItem.tags && currentItem.tags.length" class="uppercase" light>Oddělení: {{ currentItem.tags.join(", ") }}</Tag>
                <Tag v-if="currentItem.developers && currentItem.developers.length" class="uppercase" light>Vývojář: {{ currentItem.developers.join(", ") }}</Tag>
            </div>
        </div>
    </div>
</template>

<style scoped>
.breadcrumb {
    /* Zde můžete přidat vlastní styly */
}
</style>
