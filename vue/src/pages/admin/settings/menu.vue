<script setup>
import MenuGrid from "@project/components/grids/settings/MenuGrid.vue";
import MenuItemGrid from "@project/components/grids/settings/MenuItemGrid.vue";

import {ref} from "vue";

const menuGridRef = ref(null);
</script>

<template>
    <div class="row">
        <div class="col-6">
            <MenuGrid ref="menuGridRef" class="section" />
        </div>
        <div class="col-6">
            <MenuItemGrid
                :parent="{
                    ref: menuGridRef?.gridRef,
                    parent: 'ID',
                    child: 'Menu_ID',
                }"

                class="section"
            />
        </div>
    </div>
</template>