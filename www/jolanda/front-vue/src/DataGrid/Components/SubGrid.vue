<script setup>
import {reactive} from "vue";
import Grid from "@/DataGrid/Components/Grid.vue";
import SubGridMapper from "../js/Mappers/SubGridMapper";

const props = defineProps({
    json: String,
    subGrid: Object
});

const subGrid = reactive(!props.subGrid ? SubGridMapper.map(props.json) : props.subGrid);
</script>

<template>
    <Grid :grid="subGrid"></Grid>
</template>
