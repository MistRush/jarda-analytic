<script setup>

</script>

<template>
    <tr>
        <slot></slot>
    </tr>
</template>

<style scoped>
    tr{
        font-size: 0.846rem;
        font-weight: 500;
        border-radius: 4px;
        height: 33px;
    }

    tr:nth-child(odd){
        background: #ECF2FF;
    }

    tr:nth-child(even){
        background: none;
    }
</style>