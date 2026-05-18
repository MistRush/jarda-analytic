<script setup>
    import {provide, reactive, ref, watch} from "vue";
    import Filter from "@/Filter/Filter.vue";
    import {Filter as FilterObj} from "@/Filter/js/Filter";
    import {cloneDeep} from "lodash";
    import Button from "@/Components/Inputs/Button.vue";
    import Modal from "@/Components/Modal/Modal.vue";

    const emit = defineEmits(['change', 'close', 'save']);

    const props = defineProps({
        show: Boolean,
        filter: Object,
    });

    const show = ref(props.show);

    const state = reactive(props.filter ? cloneDeep(props.filter) : new FilterObj(null));
    provide('filterObj', state);

    const save = () => {
        emit('save', state);
        close();
    }

    const close = () => {
        show.value = false;
        emit('close', state);
    }

    watch(() => props.show, (val) => {
        show.value = props.show;
    });
</script>

<template>
    <Modal :isVisible="show" @update:isVisible="close">
        <template #header>
            Filtry
        </template>
        <template #body>
            <Filter></Filter>
        </template>
        <template #footer>
            <Button variant="green" @click="save">Uložit</Button>
            <Button variant="red" @click="close">Zavřít</Button>
        </template>
    </Modal>
</template>