<script setup>
import {Cell} from "@/DataGrid/js/Cell/Cell";
import Skeleton from "@/Components/Other/Skeleton/Skeleton.vue";
import SkeletonItem from "@/Components/Other/Skeleton/SkeletonItem.vue";
import {Column} from "@/DataGrid/js/Column/Column";

const props = defineProps({
    cell: {
        type: Cell
    },
    column: {
        type: Column
    },
    left: Number,
    data: String
})

</script>

<template>
    <div :style="{width: column.currentWidth + 'px', left: props.left+'px'}" class="absolute py-[4px] px-[6px] overflow-ellipsis overflow-hidden whitespace-nowrap cell" v-if="typeof data !== 'undefined'" v-html="data">

    </div>
    <div :style="{width: column.currentWidth + 'px', left: props.left+'px'}" class="absolute py-[4px] px-[6px] overflow-ellipsis overflow-hidden whitespace-nowrap cell" v-else>
        <Skeleton>
            <SkeletonItem :width="column.currentWidth" class="mt-2"></SkeletonItem>
        </Skeleton>
    </div>
</template>

<style scoped>
    .cell {
        border-bottom: 1px solid #efefef;

        max-height: 33px;
        height: 100%;
        top: 0;
        left: 0;

        &:after{
            content: "";
            height: 100%;
            width: 1px;
            background-color: #282828;
            top: 0;
            right: 1px;
            position: absolute;
        }
    }
</style>