<script setup>
import { DataGrid } from "@/DataGrid/js/DataGrid.js";
import Head from "@/DataGrid/Components/Table/Head/Head.vue";
import { onMounted, ref, provide } from "vue";
import Body from "@/DataGrid/Components/Table/Body/Body.vue";
import LoadingLine from "@/Components/Other/Loading/LoadingLine.vue";
import Footer from "@/DataGrid/Components/Table/Footer/Footer.vue";

const props = defineProps({
    dataGrid: {
        type: DataGrid,
        required: true,
    },
    theme: {
        type: String,
        default: "new",
    },
});

const gridRef = ref(null);

const dataGrid = ref(props.dataGrid);
provide("__dataGrid", dataGrid.value);
provide("__dataGrid_theme", props.theme);

const initHeaderScroll = () => {
    const elmnt = gridRef.value.querySelector(".header-wrapper");
    const elmnt2 = gridRef.value.querySelector(".v-vl--show-scrollbar");

    elmnt2.addEventListener("scroll", (e) => {
        elmnt.scrollLeft = e.target.scrollLeft;
    });
};

onMounted(() => {
    initHeaderScroll();

    props.dataGrid?.onInitComplete?.();
});
</script>

<template>
    <div class="grid grid-vue" :class="{ oldTheme: props.theme === 'old', newTheme: props.theme === 'new' }" style="width: 100%" ref="gridRef">
        <div class="grid-wrapper">
            <Head></Head>
            <div class="body-wrapper">
                <div v-if="dataGrid.ajax" class="loading-line-wrapper">
                    <LoadingLine v-if="dataGrid.ajax._loading"></LoadingLine>
                </div>
                <Body> </Body>
            </div>
        </div>
        <div>
            <Footer></Footer>
        </div>

        <slot name="columns"></slot>
        <slot name="actions"></slot>
    </div>
</template>

<style scoped>
.newTheme {
    .grid-wrapper {
        max-width: 100%;
        overflow: hidden;
    }

    &.grid {
        margin-top: 10px;

        .loading-line-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1;
        }
    }

    .body-wrapper {
        position: relative;
        overflow-x: hidden;
        overflow-y: hidden;
    }
}

.oldTheme {
    .grid-wrapper {
        box-shadow: 0 3px 15px rgba(62, 70, 84, 0.3882352941);
        max-width: 100%;
        overflow: hidden;
    }

    &.grid {
        margin-top: 10px;

        .loading-line-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1;
        }
    }

    .body-wrapper {
        position: relative;
        overflow-x: hidden;
        overflow-y: hidden;
    }
}
</style>
