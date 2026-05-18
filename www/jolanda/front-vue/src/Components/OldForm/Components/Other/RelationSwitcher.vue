<script setup>
import RelationSwitcherJs from "../../js/Other/RelationSwitcher";
import {onMounted} from "vue";

const props = defineProps({
    relationSwitcher: RelationSwitcherJs
});

window[props.relationSwitcher.getId()] = null;

onMounted(() => {
    if(props.relationSwitcher.getId()){
        window[props.relationSwitcher.getId()] = new RelationSwitcher(props.relationSwitcher.getSettings(), $('#'+props.relationSwitcher.getId()), props.relationSwitcher.getEditor().getEntityId());
    }
})
</script>

<template>
    <div :id="relationSwitcher.getId()" class="relation-switcher">
<!--        <h2>Test (<span class="from"></span>/<span class="to"></span>)</h2>-->
    </div>
</template>