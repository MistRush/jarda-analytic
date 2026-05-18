<script setup>
import { computed, inject, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AppRouterLink from "@/App/Router/AppRouterLink.vue";
import { useAppStore } from "@/App/stores/appStore";

const props = defineProps({
    icon: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    level: {
        type: Number,
        default: 1,
    },
    badge: {
        type: [String, Number],
        default: null,
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["toggle", "routerClick"]);
const light = inject("light-menu", false);
const route = useRoute();
const { app } = useAppStore(window.pinia);

// Lokální stav pro Popover
const popoverOpen = ref(false);

// Kontrola, zda je položka aktivní
const isActive = computed(() => {
    let currentPath = route.path.slice(1); // Odstraníme počáteční '/'
    let itemPath = props.url.startsWith("/") ? props.url.slice(1) : props.url;

    if (currentPath.endsWith("/index")) {
        currentPath = currentPath.slice(0, currentPath.indexOf("/index"));
    }

    if (itemPath.endsWith("/index")) {
        itemPath = itemPath.slice(0, itemPath.indexOf("/index"));
    }

    return currentPath === itemPath || currentPath === itemPath + "/";
});

// // Synchronizace popoverOpen s isOpen prop
// watch(() => props.isOpen, (newValue) => {
//     popoverOpen.value = newValue;
// });

// Při změně popoverOpen emitujeme událost
watch(popoverOpen, (newValue) => {
    if (newValue === false) {
        emit("toggle", false);
    }
});

// // Při změně light módu zavřeme popover
// watch(() => light.value, () => {
//     popoverOpen.value = false;
// });

const toggleSubmenu = () => {
    emit("toggle");
};

const handleRouterLinkClick = () => {
    emit("routerClick");
};
</script>

<template>
    <div
        class="menu-item z-48"
        :class="[
            `level-${level}`,
            {
                active: isActive,
                'parent-active': isActive && level === 1,
            },
        ]"
    >
        <div class="content" v-if="!light || (light && level !== 1)">
            <div
                class="item-wrapper"
                :class="{
                    'hover:bg-primary/15': level === 1,
                    'bg-primary/15': isActive && level === 1,
                }"
            >
                <AppRouterLink v-if="!url.startsWith('/' + app.settings.module + '/menu/index?')" class="item-name-wrapper" :to="url" :data-description="description" :data-level="level" @click="handleRouterLinkClick">
                    <div
                        class="icon-wrapper mr-4"
                        :class="{
                            'w-[20px] h-[20px] mr-4': level === 1,
                            'w-[4px] mr-3': level === 2 || level === 3,
                        }"
                    >
                        <Icon v-if="level === 1" :icon="icon" class="w-[20px] max-h-[20px] text-primary duotone text-[20px]" />
                        <div v-else class="elipse"></div>
                    </div>

                    <div class="name menu-item-name text-white" :class="{ 'text-primary!': isActive }">
                        {{ name }}
                    </div>
                </AppRouterLink>
                <div
                    v-else
                    class="item-name-wrapper cursor-pointer select-none"
                    @click="
                        toggleSubmenu();
                        handleRouterLinkClick();
                    "
                >
                    <div
                        class="icon-wrapper mr-4"
                        :class="{
                            'w-[20px] h-[20px] mr-4': level === 1,
                            'w-[4px] mr-3': level === 2 || level === 3,
                        }"
                    >
                        <Icon v-if="level === 1" :icon="icon" class="w-[20px] max-h-[20px] text-primary duotone text-[20px]" />
                        <div v-else class="elipse"></div>
                    </div>

                    <div class="name menu-item-name text-white" :class="{ 'text-primary!': isActive }">
                        {{ name }}
                    </div>
                </div>

                <div v-if="level === 1 && badge" class="badge mr-2">
                    <Tag light>{{ badge }}</Tag>
                </div>

                <div class="expander-wrapper w-[20px] h-[20px] mr-1 flex items-center justify-center">
                    <div v-if="$slots.submenu" class="expander" :class="{ expanded: isOpen }" @click="toggleSubmenu" :aria-expanded="isOpen">
                        <Icon icon="arrow" class="w-[12px] text-white" :direction="isOpen ? 'top' : 'bottom'" />
                    </div>
                </div>
            </div>

            <div class="submenu" v-if="$slots.submenu" v-show="isOpen">
                <slot name="submenu" />
            </div>
        </div>
        <div class="content" v-else>
            <Popover mode="hover" :popper="{ placement: 'right-end', offsetDistance: 24 }" :closeDelay="300" :openDelay="300" v-if="level === 1" v-model:open="popoverOpen">
                <div
                    class="item-wrapper z-100"
                    :class="{
                        'hover:bg-primary/15': level === 1,
                        'bg-primary/15': isActive && level === 1,
                    }"
                >
                    <AppRouterLink :to="url" :data-description="description" :data-level="level" class="p-4" @click="popoverOpen = false">
                        <div class="icon-wrapper w-[20px] h-[20px]">
                            <Icon :icon="icon" class="w-[20px] max-h-[20px] text-primary duotone text-[20px]" />
                        </div>
                    </AppRouterLink>
                </div>

                <template #panel="{ close }">
                    <div class="bg-nav w-[250px]">
                        <div class="flex items-center justify-between p-4 pb-0" :class="{ 'pb-4': !$slots.submenu }">
                            <div class="name menu-item-name text-white">
                                {{ name }}
                            </div>
                            <div v-if="badge" class="badge">
                                <Tag :light="true">{{ badge }}</Tag>
                            </div>
                        </div>
                        <template v-if="$slots.submenu">
                            <div class="dark-theme">
                                <div class="overflow-y-auto max-h-[75dvh] p-2">
                                    <slot name="submenu" :close="close" />
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </Popover>
        </div>
    </div>
</template>

<style scoped>
.menu-item {
    position: relative;
    display: flex;
}

.level-1 {
    margin-bottom: 5px;
}

.content {
    flex: 1;
}

.item-name-wrapper {
    display: flex;
    align-items: center;
    font-size: 0.923rem;
    font-weight: 400;
    flex-grow: 1;
    padding: 0.769rem 0.5rem 0.769rem 0.769rem;
}

.expander {
    cursor: pointer;
    user-select: none;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.expander .plus {
    transition: transform 0.3s ease;
    display: inline-block;
}

.expander.expanded .plus {
    transform: rotate(180deg);
}

.submenu {
    padding-left: 14px;
    margin-top: 5px;
}

.item-wrapper {
    display: flex;
    border-radius: 0.462rem;
    align-items: center;
}

.menu-item-name {
    flex-grow: 1;
}

.level-2,
.level-3 {
    .item-name-wrapper:hover {
        div {
            color: var(--color-primary);
        }
    }

    .elipse {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: var(--color-primary);
    }

    .item-name-wrapper {
        padding-top: 0.65rem;
        padding-bottom: 0.65rem;
    }
}

/* Styly pro aktivní položky */
.active {
    .elipse {
        background-color: var(--color-primary);
    }
}

:deep(.popover-panel) {
    z-index: 999;
    --tw-ring-color: var(--color-nav) !important;
    border-color: var(--color-nav) !important;
}

:deep(.popper-arrow)::before {
    background-color: var(--color-nav) !important;
    border-color: var(--color-nav) !important;
    --tw-ring-color: var(--color-nav) !important;
}
</style>
