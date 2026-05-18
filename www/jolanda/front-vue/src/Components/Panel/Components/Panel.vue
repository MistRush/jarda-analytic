<script setup>
const props = defineProps({
    panel: Object
});

</script>

<template>
<!--    <Teleport to="#panel-wrapper">-->
        <div :id="'panel-' + panel.uid"
             :class="
                {
                    [panel.classes]: true,
                }
            "
             :style="{
                'display': panel.showed ? 'block' : 'none',
             }"
        >
            <div class="panel-heading row">
                <div class="col-12 col-md-auto">
                    <slot name="back">
                        <button class="btn btn-icon" @click="panel.close()"><i class="fa fa-arrow-left"></i></button>
                        <h1 class="d-inline-block" data-content="title" v-html="panel.title"></h1>
                    </slot>
                </div>
                <div v-if="!$slots.buttons" class="col-12 col-md text-right" data-content="buttons" v-html="panel.buttons_html">
                </div>
                <div v-else class="col-12 col-md text-right" data-content="buttons">
                    <slot name="buttons">
                    </slot>
                </div>
                <div v-if="!$slots.header" class="col-12" data-content="header" v-html="panel.header">
                </div>
                <div v-else class="col-12" data-content="header">
                    <slot name="header">
                    </slot>
                </div>
            </div>
            <div v-if="!$slots.content" class="panel-content" data-content="content" v-html="panel.content">
            </div>
            <div v-else class="panel-content" data-content="content">
                <slot name="content">
                </slot>
            </div>
            <div v-if="!$slots.footer" data-content="footer" v-html="panel.footer">
            </div>
            <div v-else data-content="footer">
                <slot name="footer">
                </slot>
            </div>
        </div>
<!--    </Teleport>-->
</template>

<style scoped>
.panel-content{
    position: relative;
}
</style>