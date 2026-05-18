<script setup>
import Modal from "@/Components/Modal/Modal.vue";
import { VueDraggable } from "vue-draggable-plus";
import { ref } from "vue";
import { useAjax } from "@/Composables/useAjax.js";
import { useApp } from "@/App/composables/useApp.js";
import { useTranslations } from "@/Composables/useTranslation.js";

const props = defineProps({
    menu: Object,
});

const emit = defineEmits(["close"]);

const ajax = useAjax();
const { user, layout } = useApp();
const { translations } = useTranslations();

const mapItems = (items, favorites = false, firstLevel = false) => {
    return items
        .filter((item) => {
            if (!item.visible) {
                return false;
            }

            if (firstLevel) {
                if (favorites) {
                    return item.isFavorite;
                } else {
                    return !item.isFavorite;
                }
            }

            return true;
        })
        .map((item) => {
            const subItems = mapItems(item.menuItems, favorites);

            return {
                id: item.id,
                name: item.name,
                url: item.url,
                icon: item.icon,
                visible: item.visible,
                menuItems: subItems,
                collapsed: false,
                isFavorite: favorites ? item.isFavorite : false,
            };
        });
};

const list1 = ref(mapItems(props.menu.menuItems, false, true));
const favorites = ref(mapItems(props.menu.menuItems, true, true));
console.log(list1.value);
console.log(props.menu);

const onUpdate = (data) => {};

const onAdd = (data) => {
    data.clonedData.collapsed = false;
};

const remove = (data) => {
    data.clonedData.collapsed = false;
};

const onChangeSubItem2 = (subItem) => {
    const subItems2Favorites = subItem.menuItems?.filter((item) => {
        return item.isFavorite;
    });

    if (subItems2Favorites && subItems2Favorites.length > 0) {
        subItem.isFavorite = true;
    } else {
        subItem.isFavorite = false;
    }
};

const save = () => {
    const resetItems = (items) => {
        items.forEach((item) => {
            item.isFavorite = false;

            if (item.menuItems) {
                resetItems(item.menuItems);
            }
        });
    };

    resetItems(props.menu.menuItems);

    const ids = [];
    const saveItems = (items, firstLevel = false, save = true) => {
        items.forEach((item) => {
            const origMenuItem = props.menu.getItemByID(item.id);

            if (origMenuItem) {
                const isFavorite = firstLevel ? true : item.isFavorite;

                if (save) {
                    origMenuItem.isFavorite = isFavorite;
                }

                if (isFavorite && !save) {
                    ids.push(item.id);
                }
            }

            if (item.menuItems) {
                saveItems(item.menuItems, false, save);
            }
        });
    };

    saveItems(favorites.value, true, false);

    if (props.menu.favorites?.url) {
        ajax.postForm(
            props.menu.favorites?.url + "/save-favorites",
            {
                UserID: user.ID,
                Items: JSON.stringify(ids),
            },
            null,
            {
                waitingAlert: {
                    title: translations.SAVING,
                },
            },
        )
            .then(({ data, alert }) => {
                if (data === "ok") {
                    saveItems(favorites.value, true, true);
                    alert.changeToSuccess();
                    emit("close");
                } else {
                    alert.changeToError();
                }
            })
            .catch(({ alert }) => {
                alert.changeToError();
            });
    } else {
        console.error("Menu favorites URL is not set");
    }
};
</script>

<template>
    <Modal :is-visible="true" size="large" @close="$emit('close')">
        <template #header>
            <div class="flex items-center gap-2"><Icon icon="gear" class="w-[17px] text-icon-light-gray" />{{ translations.SETTINGS_MENU_FAVORITES }}</div>
        </template>
        <template #body>
            <div class="@container">
                <div>
                    <div class="gap-6 text-primary mb-2 hidden @3xl:flex">
                        <div class="w-[50%]">{{ translations.PINNED }}</div>
                        <div class="w-[1px]"></div>
                        <div class="w-[50%]">{{ translations.OTHER }}</div>
                    </div>
                    <div class="flex gap-6 h-full flex-wrap @3xl:flex-nowrap">
                        <div class="text-primary mb-[-12px] block @3xl:hidden">{{ translations.PINNED }}</div>
                        <VueDraggable class="flex flex-col gap-2 p-3 w-[100%] @3xl:w-[50%] h-[300px] m-auto bg-outline dark:bg-nav rounded-lg overflow-auto" v-model="favorites" animation="150" group="people" ghostClass="ghost" handle=".handle" @update="onUpdate" @add="onAdd" @remove="remove">
                            <div v-for="item in favorites" :key="item.id" class="bg-white dark:bg-dark rounded-lg">
                                <div class="flex gap-2 items-center p-1">
                                    <div class="p-2 border-r border-outline dark:border-outline/20 mr-2 handle group cursor-pointer">
                                        <Icon icon="handle" class="w-[18px] h-[18px] text-icon-light-gray group-hover:text-primary" />
                                    </div>
                                    <div class="w-[18px] h-[18px]">
                                        <Icon :icon="item.icon" class="max-w-full max-h-full duotone text-primary icon-secondary-gray" />
                                    </div>

                                    <div class="font-medium grow">
                                        {{ item.name }}
                                    </div>
                                    <div>
                                        <div class="w-[24px] h-[24px] bg-outline dark:bg-nav rounded-[50%] flex items-center justify-center mr-2 cursor-pointer" v-if="item.menuItems && item.menuItems.length > 0" @click="item.collapsed = !item.collapsed">
                                            <Icon icon="arrow" class="w-[16px]" :direction="item.collapsed ? 'top' : 'bottom'" />
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 border-t border-outline dark:border-outline/20 flex flex-col gap-2" v-if="item.menuItems && item.menuItems.length > 0 && item.collapsed">
                                    <div v-for="subItem in item.menuItems" :key="subItem.id">
                                        <Checkbox :label="subItem.name" v-model="subItem.isFavorite" :class="{ 'text-light': !subItem.isFavorite }" />

                                        <div class="p-4 flex flex-col gap-2" v-if="subItem.menuItems && subItem.menuItems.length > 0">
                                            <div v-for="subItem2 in subItem.menuItems" :key="subItem2.id">
                                                <Checkbox :label="subItem2.name" v-model="subItem2.isFavorite" @change="onChangeSubItem2(subItem)" :class="{ 'text-light': !subItem2.isFavorite }" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </VueDraggable>
                        <div class="h-[300px] w-[1px] bg-outline dark:bg-outline/20 hidden @3xl:block"></div>
                        <div class="text-primary mb-[-12px] block @3xl:hidden">{{ translations.OTHER }}</div>
                        <VueDraggable class="flex flex-col gap-2 p-3 w-[100%] @3xl:w-[50%] h-[300px] m-auto bg-outline dark:bg-nav rounded-lg overflow-auto" v-model="list1" animation="150" ghostClass="ghost" group="people" handle=".handle" @update="onUpdate" @add="onAdd" @remove="remove">
                            <div v-for="item in list1" :key="item.id" class="bg-white dark:bg-dark rounded-lg">
                                <div class="flex gap-2 items-center p-1">
                                    <div class="p-2 border-r border-outline dark:border-outline/20 mr-2 handle group cursor-pointer">
                                        <Icon icon="handle" class="w-[18px] h-[18px] text-icon-light-gray group-hover:text-primary" />
                                    </div>
                                    <div class="w-[18px] h-[18px]">
                                        <Icon :icon="item.icon" class="max-w-full max-h-full duotone text-primary icon-secondary-gray" />
                                    </div>

                                    <div class="font-medium">
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>
                        </VueDraggable>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <Button @click="save">Uložit</Button>
        </template>
    </Modal>
</template>

<style scoped></style>
