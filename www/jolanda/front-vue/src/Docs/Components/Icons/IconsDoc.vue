<script setup>
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";
import Icon from "@/Icons/Icon.vue";
import Tooltip from "@/Components/Other/Tooltip.vue";
import { useClipboard } from "@vueuse/core";
import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";
import InputField from "@/Components/Inputs/InputField.vue";
import Checkbox from "@/Components/Inputs/Checkbox.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";

const icons = Object.keys(import.meta.glob("./../../../Icons/*Icon.vue"))
    // Filtrování: nezačíná na "Icon"
    .filter((path) => !/\/Icon[^/]*Icon\.vue$/.test(path))
    // Získání názvu souboru bez cesty a odstranění "Icon.vue"
    .map(
        (path) =>
            path
                .split("/")
                .pop()
                ?.replace(/Icon\.vue$/, "") ?? "",
    )
    .filter((path) => path !== "");

const { copy, copied, isSupported } = useClipboard();
const alerts = useAlertStore(window.pinia);

const handleCopy = (icon) => {
    const iconSecondary = state.duotone ? " icon-secondary-orange" : "";
    const template = `<Icon icon="${icon}" class="w-[${state.size}px]${iconSecondary}" />`;

    alerts.info("Zkopírováno", template);
    copy(template);
};

const state = reactive({
    size: "20",
    duotone: false,
    primaryColor: "primary",
    secondaryColor: "secondary",
});
</script>

<template>
    <DocPage import="global">
        <template #title> Seznam ikon </template>
        <template #content>
            <div class="flex items-center justify-between">
                <InputField label="Velikost" type="number" v-model="state.size" class="w-[70px]!" />
                <Checkbox label="Duotone" v-model="state.duotone" />
            </div>

            <!--      <Select label="Hlavní barva" v-model="state.primaryColor" />-->
            <!--      <Select label="Sukundární barva" v-model="secondaryColor" />-->

            <div class="flex flex-wrap gap-[20px] mt-10">
                <Tooltip v-for="icon in icons" :text="icon">
                    <Icon
                        :icon="icon"
                        class="cursor-pointer"
                        :class="{
                            duotone: state.duotone,
                            'icon-secondary-orange': state.duotone,
                        }"
                        :style="{ width: state.size + 'px', maxHeight: state.size + 'px' }"
                        @click="handleCopy(icon)"
                    />
                </Tooltip>
            </div>

            <Example title="Použití ikony">
                <Preview
                    code='
          <script setup>
            import Icon from "@/Icons/Icon.vue";
          </script>

          <template>
            <Icon icon="close" class="text-primary w-[20px] h-[20px]" />
          </template>
        '
                ></Preview>
            </Example>

            <Example title="Rozšíření vlastních ikon">
                <p>Pokud chceme v projektu přidat vlastní ikony, vytvoříme si v našem projektu v src složce složku <code>icons</code>. Do ní pak vkládáme vlastní ikony jako vue komponenty. Projektové ikony mají větší prioritu a přepisují ty z jolandy.</p>

                <Preview
                    code='
<script setup>
//import { IconProps, useIcon } from "@/Icons/useIcon.js";

const props = defineProps(IconProps());

const { color } = useIcon(props);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 24 24" :style="{ color: color }">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="M6 12h12v10H6z" />
            <path d="M14 22v-4a2 2 0 1 0-4 0v4m8-10l2.702 1.013c1.078.405 1.298.722 1.298 1.873V22h-4zM2 14.886c0-1.151.22-1.468 1.298-1.873L6 12v10H2zM16.208 9.5C17.313 6.36 15.144 3 12 3S6.687 6.36 7.792 9.5M12 3V2M8 12v-2m8 2v-2m-9-.5h10" />
        </g>
    </svg>
</template>
        '
                    ><template #header> Vlastní ikona např /src/icon/TestIcon.vue </template></Preview
                >
            </Example>

            <Example title="Iconify">
                <p>Jolanda obsahuje také knihovnu Iconify popojenou s tailwindem. Seznam ikon je <a href="https://icon-sets.iconify.design/">zde</a></p>

                <p class="mt-2">Pro správnou funkci Iconify, musíme do svýj projektových css stylů vložit styly z Iconify. Popsáno v instalaci jolandy.</p>

                <Preview
                    code='
          <template>
                <span class="icon-[mdi-light--home] text-lg"></span>
                <span class="icon-[line-md--alert] text-[50px]"></span>
                <span class="icon-[bx--accessibility]"></span>
          </template>
        '
                >
                    <template #header> Použití pomocí tailwind class </template>

                    <template #default>
                        <span class="icon-[mdi-light--home] text-lg"></span>
                        <span class="icon-[line-md--alert] text-[50px]"></span>
                        <span class="icon-[bx--accessibility]"></span>
                    </template>
                </Preview>

                <p class="mt-2">Iconify ikony můžeme použít taky v menu</p>

                <Preview
                    code="
                        $menu->addItem(self::PRODUCT_INDEX, translate('Produkty'), 'default/product/index', 'icon-[iconoir--album]');
                    "
                >
                </Preview>

                <p class="mt-2">Iconify lze také použít s <prop>Icon</prop> komponentou. Pozor velikost Iconify icon se nastavuje pomocí font-size</p>

                <Preview
                    code='
                        <Icon icon="icon-[iconoir--album]" class="font-[40px]" />
                    '
                >
                </Preview>
            </Example>
        </template>
    </DocPage>
</template>
