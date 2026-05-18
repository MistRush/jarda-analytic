<script setup>
import Layout from '@/App/Layout/Layout.vue';
import { PresetSetting } from "@/DataGrid/js/Settings/PresetSetting.js";
import { DataGrid } from "@/DataGrid/js/DataGrid.js";
import { ColumnTypeCurrency } from "@/DataGrid/js/Column/ColumnType/ColumnTypeCurrency.js";

DataGrid.USE_PRESETS = true; //zatím defaultně false
ColumnTypeCurrency.DECIMALS = 0;
</script>

<template>
  <Layout />
</template>