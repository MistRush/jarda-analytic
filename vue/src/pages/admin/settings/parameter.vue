<script setup>
import ParameterGrid from "@project/components/grids/settings/ParameterGrid.vue";
import ParameterValueGrid from "@project/components/grids/settings/ParameterValueGrid.vue";

import {ref} from "vue";

const parameterGridRef = ref(null);
</script>

<template>
    <div class="row">
        <div class="col-6">
            <ParameterGrid ref="parameterGridRef" class="section" />
        </div>
        <div class="col-6">
            <ParameterValueGrid
                :parent="{
                    ref: parameterGridRef?.gridRef,
                    parent: 'ID',
                    child: 'Parameter_ID',
                }"
                class="section"
            />
        </div>
    </div>
</template>