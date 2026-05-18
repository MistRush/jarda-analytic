<script setup>
import { ref, provide, watch, nextTick, computed } from "vue";
import { useAppStore } from "@/App/stores/appStore";
import { useRoute } from "vue-router";
import MenuItem from "./MenuItem.vue";
import { useEventListener } from "@vueuse/core";
import { useTranslations } from "@/Composables/useTranslation.js";

const props = defineProps({
    menu: Object,
    light: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:light", "routerClick"]);

const { app } = useAppStore(window.pinia);
const route = useRoute();
const search = ref(null);
const light = ref(props.light);
const searchInputRef = ref(null);
const { translations } = useTranslations();

provide("light-menu", light);

// Stav otevřených menu - ukládáme celé cesty
const openMenus = ref(new Set());

// Funkce pro kontrolu, zda položka odpovídá vyhledávání
const matchesSearch = (item) => {
    if (!search.value) return true;

    const searchValue = search.value.trim().toLowerCase();
    const itemName = item.name.trim().toLowerCase();

    if (itemName.includes(searchValue)) return true;

    return item.menuItems?.some((subItem) => matchesSearch(subItem)) || false;
};

// Funkce pro získání ID menu
const getMenuPath = (item, parentPath = "") => {
    return parentPath ? `${parentPath}/${item.URL}` : item.URL;
};

// Funkce pro přepnutí stavu menu
const toggleMenu = (path, value) => {
    if (value === undefined) {
        if (openMenus.value.has(path)) {
            // Zavřeme toto menu a všechna jeho podmenu
            const toRemove = Array.from(openMenus.value).filter((p) => p.startsWith(path));
            toRemove.forEach((p) => openMenus.value.delete(p));
        } else {
            openMenus.value.add(path);
        }
    } else if (value) {
        openMenus.value.add(path);
    } else {
        // Zavřeme toto menu a všechna jeho podmenu
        const toRemove = Array.from(openMenus.value).filter((p) => p.startsWith(path));
        toRemove.forEach((p) => openMenus.value.delete(p));
    }
};

// Funkce pro kontrolu, zda je menu otevřené
const isMenuOpen = (path) => {
    return openMenus.value.has(path) || !!search.value;
};

// Funkce pro otevření cesty k aktivní položce
const openActiveMenuPath = () => {
    const currentPath = route.path.slice(1); // Odstraníme počáteční '/'

    // Nejdřív zavřeme všechna menu
    openMenus.value.clear();

    // Projdeme všechny položky menu a hledáme cestu k aktivní položce
    const findAndOpenPath = (items, parentPaths = [], level = 1) => {
        for (const item of items) {
            const currentMenuPath = getMenuPath(item, parentPaths[parentPaths.length - 1] || "");
            const itemUrl = item.URL.startsWith("/") ? item.URL.slice(1) : item.URL;
            const newParentPaths = [...parentPaths, currentMenuPath];

            // Kontrola, zda je položka nebo některá z jejích podpoložek aktivní
            const isCurrentItemActive = currentPath === itemUrl;
            let hasActiveChild = false;

            // Rekurzivně projdeme podpoložky
            if (item.menuItems?.length) {
                const checkChildrenActive = (children) => {
                    for (const child of children) {
                        const childUrl = child.URL.startsWith("/") ? child.URL.slice(1) : child.URL;
                        if (currentPath === childUrl || currentPath.startsWith(childUrl + "/")) {
                            hasActiveChild = true;
                            return true;
                        }
                        if (child.menuItems?.length && checkChildrenActive(child.menuItems)) {
                            hasActiveChild = true;
                            return true;
                        }
                    }
                    return false;
                };

                checkChildrenActive(item.menuItems);
            }

            // Otevřeme menu pouze pokud:
            // 1. Pro lvl1 a lvl2: pouze pokud mají aktivní podpoložku
            // 2. Pro lvl3: pokud jsou samy aktivní
            if ((level < 3 && hasActiveChild) || (level === 3 && isCurrentItemActive)) {
                newParentPaths.forEach((path) => {
                    openMenus.value.add(path);
                });
            }

            // Pokud má položka podmenu, pokračujeme v hledání
            if (item.menuItems?.length) {
                findAndOpenPath(item.menuItems, newParentPaths, level + 1);
            }
        }
    };

    findAndOpenPath(props.menu.menuItems);
};

// Při změně cesty otevřeme příslušná menu
watch(
    () => route.path,
    () => {
        if (props.menu?.menuItems?.length) {
            openActiveMenuPath();
        }
    },
    { immediate: true },
);

// Sledujeme, kdy se načtou položky menu
watch(
    () => props.menu?.menuItems,
    (newItems) => {
        if (newItems?.length) {
            openActiveMenuPath();
        }
    },
    { immediate: true },
);

// Při změně vyhledávání
watch(search, (newValue) => {
    if (!newValue) {
        openMenus.value.clear();
        openActiveMenuPath();
    }
});

// Při změně light módu
watch(
    () => props.light,
    (newVal) => {
        if (newVal) {
            search.value = null;
        }

        light.value = newVal;

        // Počkáme na další tick, aby se mohla spustit animace
        nextTick(() => {
            // Použijeme setTimeout pro operace s menu, aby neblokovali animaci
            setTimeout(() => {
                openMenus.value.clear();
                if (!newVal) {
                    openActiveMenuPath();
                }
            }, 200); // Počkáme až se menu zmenší/zvětší
        });
    },
);

const handleOnSearchIconClick = () => {
    emit("update:light", false);
    setTimeout(() => searchInputRef.value.inputEl.focus(), 100);
};

const onShortcut = (e) => {
    // Ctrl+Shift+F (na Macu Cmd místo Ctrl)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyF") {
        e.preventDefault();
        nextTick(() => {
            searchInputRef.value?.inputEl?.focus();
        });
    }
};

useEventListener(window, "keydown", onShortcut);

const favorites = ref(null);
const menuItems = computed(() => {
    const mapItems = (items) => {
        return items.map((item) => {
            const subItems = mapItems(item.menuItems);

            return { ...item, menuItems: subItems, nonFavoritesCollapsed: false };
        });
    };

    favorites.value = mapItems(props.menu.menuItems);

    return favorites.value;
});

//favorites
const isAllOfItemsFavorites = (items) => {
    return items.filter((item) => {
        return !item.isFavorite;
    });
};
</script>

<template>
    <nav id="mainMenu">
        <div class="items">
            <div class="top">
                <!-- Vyhledávání -->
                <div class="main-search sticky top-[-21px] z-[49] pt-2 pb-2 bg-nav dark:bg-dark flex justify-center w-full" v-if="menu.searchVisible">
                    <InputField v-show="!light" v-model="search" type="text" icon="search" class="menu-search-input w-full" :placeholder="translations.SEARCH + '...'" :dark="true" ref="searchInputRef" :show-clear="true" />
                    <transition name="fade-fast-out">
                        <Button class="min-h-[2.538rem] px-[0.62rem]!" v-show="light" @click="handleOnSearchIconClick">
                            <Icon icon="search" class="w-[15px] text-light" />
                        </Button>
                    </transition>
                </div>

                <slot name="beforeItems" />
                <div>
                    <!-- Homepage -->
                    <MenuItem v-if="menu.homepageVisible" icon="home" :url="'/' + app.settings.module" :name="_l('Homepage')" :level="1" @routerClick="emit('routerClick')" />

                    <template v-if="menu.favorites">
                        <div class="text-[0.769rem] text-primary mb-2">{{ translations.PINNED }}</div>
                        <template v-for="(item, index) in favorites" :key="index">
                            <MenuItem v-if="item.visible && matchesSearch(item) && item.isFavorite" :icon="item.icon" :url="'/' + item.URL" :name="item.name" :description="item.description" :badge="item.badge" :level="1" :is-open="isMenuOpen(getMenuPath(item)) || !!search" @toggle="toggleMenu(getMenuPath(item))" @routerClick="emit('routerClick')">
                                <template v-if="item.menuItems?.length" #submenu="{ close }">
                                    <!-- Submenu první úrovně -->
                                    <template v-for="(secondItem, secondIndex) in item.menuItems" :key="secondIndex">
                                        <MenuItem
                                            v-if="secondItem.visible && matchesSearch(secondItem) && (secondItem.isFavorite || item.nonFavoritesCollapsed || search)"
                                            :url="'/' + secondItem.URL"
                                            :name="secondItem.name"
                                            :description="secondItem.description"
                                            :level="2"
                                            :is-open="isMenuOpen(getMenuPath(secondItem, getMenuPath(item)))"
                                            @toggle="toggleMenu(getMenuPath(secondItem, getMenuPath(item)))"
                                            @routerClick="
                                                () => {
                                                    close ? close() : null;
                                                    emit('routerClick');
                                                }
                                            "
                                        >
                                            <template v-if="secondItem.menuItems?.length" #submenu>
                                                <!-- Submenu druhé úrovně -->
                                                <template v-for="(thirdItem, thirdIndex) in secondItem.menuItems" :key="thirdIndex">
                                                    <MenuItem
                                                        v-if="thirdItem.visible && matchesSearch(thirdItem) && (thirdItem.isFavorite || secondItem.nonFavoritesCollapsed || search)"
                                                        :url="'/' + thirdItem.URL"
                                                        :name="thirdItem.name"
                                                        :description="thirdItem.description"
                                                        :level="3"
                                                        @routerClick="
                                                            () => {
                                                                close ? close() : null;
                                                                emit('routerClick');
                                                            }
                                                        "
                                                    />
                                                </template>
                                                <div v-if="isAllOfItemsFavorites(secondItem.menuItems)?.length && !search">
                                                    <div @click="secondItem.nonFavoritesCollapsed = !secondItem.nonFavoritesCollapsed" class="p-[0.65rem] pt-2 pl-3 text-[0.923rem] hover:text-primary hover:underline cursor-pointer">{{ secondItem.nonFavoritesCollapsed ? "Zobrazit pouze oblíbené" : "Zobrazit vše" }}</div>
                                                </div>
                                            </template>
                                        </MenuItem>
                                    </template>
                                    <div v-if="isAllOfItemsFavorites(item.menuItems)?.length && !search">
                                        <div @click="item.nonFavoritesCollapsed = !item.nonFavoritesCollapsed" class="p-[0.65rem] pl-3 pt-2 text-[0.923rem] hover:text-primary hover:underline cursor-pointer">{{ item.nonFavoritesCollapsed ? "Zobrazit pouze oblíbené" : "Zobrazit vše" }}</div>
                                    </div>
                                </template>
                            </MenuItem>
                        </template>
                    </template>

                    <div v-if="menu.favorites" class="text-[0.769rem] text-primary mb-2 mt-2">{{ translations.OTHER }}</div>
                    <!-- Hlavní položky menu -->
                    <template v-for="(item, index) in menuItems" :key="index">
                        <MenuItem v-if="item.visible && matchesSearch(item) && !item.isFavorite" :icon="item.icon" :url="'/' + item.URL" :name="item.name" :description="item.description" :badge="item.badge" :level="1" :is-open="isMenuOpen(getMenuPath(item)) || !!search" @toggle="toggleMenu(getMenuPath(item))" @routerClick="emit('routerClick')">
                            <template v-if="item.menuItems?.length" #submenu="{ close }">
                                <!-- Submenu první úrovně -->
                                <template v-for="(secondItem, secondIndex) in item.menuItems" :key="secondIndex">
                                    <MenuItem
                                        v-if="secondItem.visible && matchesSearch(secondItem)"
                                        :url="'/' + secondItem.URL"
                                        :name="secondItem.name"
                                        :description="secondItem.description"
                                        :level="2"
                                        :is-open="isMenuOpen(getMenuPath(secondItem, getMenuPath(item)))"
                                        @toggle="toggleMenu(getMenuPath(secondItem, getMenuPath(item)))"
                                        @routerClick="
                                            () => {
                                                close ? close() : null;
                                                emit('routerClick');
                                            }
                                        "
                                    >
                                        <template v-if="secondItem.menuItems?.length" #submenu>
                                            <!-- Submenu druhé úrovně -->
                                            <template v-for="(thirdItem, thirdIndex) in secondItem.menuItems" :key="thirdIndex">
                                                <MenuItem
                                                    v-if="thirdItem.visible && matchesSearch(thirdItem)"
                                                    :url="'/' + thirdItem.URL"
                                                    :name="thirdItem.name"
                                                    :description="thirdItem.description"
                                                    :level="3"
                                                    @routerClick="
                                                        () => {
                                                            close ? close() : null;
                                                            emit('routerClick');
                                                        }
                                                    "
                                                />
                                            </template>
                                        </template>
                                    </MenuItem>
                                </template>
                            </template>
                        </MenuItem>
                    </template>
                </div>
                <slot name="afterItems" />
            </div>
        </div>
    </nav>
</template>

<style scoped>
.first-level-wrapper {
    display: flex;
    align-items: center;
}

/* Příklad základního stylu pro animaci a stav tlačítka expander */
.expander {
    cursor: pointer;
    user-select: none;
}
.expander .plus {
    transition: transform 0.3s ease;
}

/* Když je submenu otevřené, otočíme šipku */
.expander.expanded .plus {
    transform: rotate(180deg);
}

/* Můžeš upravit styly pro submenu dle vlastního návrhu */
.first-submenu,
.second-submenu {
    transition: max-height 0.3s ease;
}

:global(.theme-dark) .menu-search-input:deep(input) {
    background: red !important;
    color: white;
}

:global(.theme-dark) .menu-search-input {
    background: red !important;
    color: white;
}

.fade-fast-out-enter-active {
    transition: opacity 0.1s ease;
}
.fade-fast-out-leave-active {
    transition: none; /* zmizí okamžitě */
}

.fade-fast-out-enter-from,
.fade-fast-out-leave-to {
    opacity: 0;
}
.fade-fast-out-enter-to,
.fade-fast-out-leave-from {
    opacity: 1;
}
</style>
