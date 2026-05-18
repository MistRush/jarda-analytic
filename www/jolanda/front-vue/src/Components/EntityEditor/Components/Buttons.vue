<script setup>
import {useTranslations} from "@/Composables/useTranslation.js";

const props = defineProps({
    entityEditor: Object
})

const windowCallConfirm = (a = false, b = false) => {
    window[props.entityEditor.getId()].confirm(a,b);
}

const gotoPrev = () => {
    window[props.entityEditor.getId()].gotoPrev();
}

const gotoNext = () => {
    window[props.entityEditor.getId()].gotoNext();
}

const {translations} = useTranslations();
</script>

<template>

    <div class="nextPrevHolder" v-if="entityEditor.isNextPrevButtonsEnabled()">
        <div class="d-flex">
            <button :id="entityEditor.getId() + '_editor_prev_entity_button'"
                    class="btn btn-white"
                    data-create="false"
                    data-update="true"
                    @click="gotoPrev"
            >
                <span class="new-arrow left"></span>
            </button>
            <div class="nextPrevCounterHolder" v-if="entityEditor.isNextPrevCounterEnabled()">
                [<span :id="entityEditor.getId() + '_editor_iterator_current'">-</span> / <span :id="entityEditor.getId() + '_editor_iterator_length'">-</span>]
            </div>

            <button :id="entityEditor.getId() + '_editor_next_entity_button'"
                    class="btn btn-white"
                    data-create="false"
                    data-update="true"
                    @click="gotoNext"
            >
                <span class="new-arrow right"></span>
            </button>
        </div>
    </div>

    <div
        v-for="(action, index) in entityEditor.getActions()"
        :key="index"
        class="custom-header-button"
        :class="{
            'dropdown': action.subactions.length > 0
        }"
    >
        <template v-if="action.type === 'button'">
            <button
                v-bind="action.button.attributes"
                :data-toggle="action.subactions.length > 0 ? 'dropdown' : null"
                :class="{
                    'dropdown-toggle': action.subactions.length > 0,
                }"
            >
                {{ action.button.getText() }}
            </button>
            <div
                v-if="action.subactions.length > 0"
                class="dropdown-menu"
            >
                <template v-for="(subaction, subactionIndex) in action.subactions"
                    :key="subactionIndex"
                >
                    <template v-if="subaction.type === 'button'">
                        <button
                            v-bind="subaction.button.attributes"
                        >
                            {{ subaction.button.getText() }}
                        </button>
                    </template>
                    <template v-else>
                        <div
                            v-bind="subaction.button.attributes"
                        >
                            {{ subaction.button.getText() }}
                        </div>
                    </template>
                </template>

            </div>
        </template>
        <template v-else>
            <div
                v-bind="action.button.attributes"
                :data-toggle="action.subactions.length > 0 ? 'dropdown' : null"
                :class="{
                    'dropdown-toggle': action.subactions.length > 0,
                }"
            >
                {{ action.button.getText() }}
            </div>
            <div
                v-if="action.subactions.length > 0"
                class="dropdown-menu"
            >
                <template v-for="(subaction, subactionIndex) in action.subactions"
                          :key="subactionIndex"
                >
                    <template v-if="subaction.type === 'button'">
                        <button
                            v-bind="subaction.button.attributes"
                        >
                            {{ subaction.button.getText() }}
                        </button>
                    </template>
                    <template v-else>
                        <div
                            v-bind="subaction.button.attributes"
                        >
                            {{ subaction.button.getText() }}
                        </div>
                    </template>
                </template>

            </div>
        </template>
    </div>

<!--    {foreach $editor->getActions() as $action}-->
<!--    {$action|noescape}-->
<!--    {/foreach}-->

    <template v-if="!entityEditor.isReadonly()">
        <div class="flex-break d-flex d-sm-none mb-1" ></div>
        <template v-if="entityEditor.isShowSaveButtons()">
            <button class="btn btn-green" @click="windowCallConfirm(false)" v-if="entityEditor.getEntityId() != null" type="button">
                {{ translations.SAVE }}
            </button>
            <button class="btn btn-green" @click="windowCallConfirm(true)" v-if="entityEditor.isAjax() || entityEditor.getBackUrl() != null" type="button">
                {{ translations.SAVE_CLOSE }}
            </button>
            <button class="btn btn-green" @click="windowCallConfirm(true, true)" v-if="entityEditor.isAjax() && entityEditor.getEntityId() == null" type="button">
                {{ translations.SAVE_CONTINUE }}
            </button>
        </template>
    </template>
</template>