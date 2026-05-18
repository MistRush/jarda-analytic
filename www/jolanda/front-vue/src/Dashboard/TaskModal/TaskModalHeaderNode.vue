<script setup>
    import { ref } from 'vue';
    import {useTranslations} from "@/Composables/useTranslation.js";

    import InputField from "@/Components/Inputs/InputField.vue";
    import DatePicker from "@/Components/Inputs/DatePicker.vue";
    import Select from "@/Components/Inputs/Select.vue";
    import TextArea from "@/Components/Inputs/TextArea.vue";

    const props = defineProps({
        title: String,
        icon: String,
        allowInlineEdit: {
            type: Boolean,
            default: false,
        },
        inlineEditType: {
            type: String,
            default: 'text',
        },
        fullWidth: {
            type: Boolean,
            default: false,
        },
        inlineEditDefaultValue: String|Number|Object|Array,
        inlineEditEnumOptions: Array,
    });

    const {translations} = useTranslations();
    const emit = defineEmits(["inline-edited"]);
    const isEditing = ref(false);
    const inlineEditValue = ref(props.inlineEditDefaultValue);
    const taskDetailNode = ref(null);

    function startEditing() {
        inlineEditValue.value = Array.isArray(props.inlineEditDefaultValue)
            ? [...props.inlineEditDefaultValue]
            : props.inlineEditDefaultValue;

        isEditing.value = true;
    }

    function confirmEdit() {
        if(props.inlineEditType === 'number')
            inlineEditValue.value = parseInt(inlineEditValue.value, 10);

        emit("inline-edited", inlineEditValue.value);
        isEditing.value = false;
    }

    function cancelEdit() {
        isEditing.value = false;
        inlineEditValue.value = props.inlineEditDefaultValue;
    }
</script>

<template>
    <div class="task-detail-node" ref="taskDetailNode">
        <div class="task-detail-node-title" :class="{ 'full-width': fullWidth }">
            <Icon :icon="icon" :width="16" :height="16" color="#36557F" class="task-detail-node-icon" />
            <div>{{ title }}</div>
        </div>
        <div class="task-detail-node-content">
            <slot  v-if="!isEditing" />

            <InputField
                v-if="allowInlineEdit && inlineEditType === 'text' && isEditing"
                v-model="inlineEditValue"
                size="small"
                font="realist"
                @blur="confirmEdit"
                @keyup.enter="confirmEdit"
                @keyup.esc="cancelEdit"
            />
            <InputField
                v-if="allowInlineEdit && inlineEditType === 'number' && isEditing"
                v-model="inlineEditValue"
                type="number"
                size="small"
                font="realist"
                @blur="confirmEdit"
                @keyup.enter="confirmEdit"
                @keyup.esc="cancelEdit"
            />
            <DatePicker
                v-if="allowInlineEdit && inlineEditType === 'date' && isEditing"
                v-model="inlineEditValue"
                size="small"
                @update:modelValue="confirmEdit"
            />
            <Select
                v-if="allowInlineEdit && inlineEditType === 'enum' && isEditing"
                v-model="inlineEditValue"
                :options="inlineEditEnumOptions"
                :required="true"
                :filterable="true"
                size="small"
                font="realist"
                style="max-width: 200px"
                @update:modelValue="confirmEdit"
            />
            <Select
                v-if="allowInlineEdit && inlineEditType === 'multienum' && isEditing"
                v-model="inlineEditValue"
                :options="inlineEditEnumOptions"
                :returnObject="true"
                :filterable="true"
                :multiple="true"
                size="small"
                font="realist"
                style="max-width: 200px"
            />
            <TextArea
                class="text-area"
                v-if="allowInlineEdit && inlineEditType === 'textarea' && isEditing"
                v-model="inlineEditValue"
                :rows="2"
                :placeholder="translations.EXPECTED_RETURN_HELP"
                font="realist"
                @blur="confirmEdit"
                @keyup.enter="confirmEdit"
                @keyup.esc="cancelEdit"
            />

            <Icon icon="edit" v-if="allowInlineEdit && !isEditing" @click="startEditing" class="inline-edit-icon" :width="16" :height="16" color="#36557F" />
            <Icon icon="checkmark-circle" v-if="allowInlineEdit && isEditing && ['multiselect', 'text', 'textarea', 'number'].includes(inlineEditType)" @click="confirmEdit" class="inline-edit-icon" :width="16" :height="16" color="#36557F" />
            <Icon icon="close" v-if="allowInlineEdit && isEditing" @click="cancelEdit" class="inline-edit-icon" :width="16" :height="16" color="#36557F" />
        </div>
    </div>
</template>

<style scoped>
    .task-detail-node {
        display: flex;
        align-items: center;
        min-height: 18px;
        overflow: hidden;

        @media(max-width: 768px) {
            gap: 16px;
        }

        .task-detail-node-title {
            min-width: 220px;
            display: flex;
            align-items: center;
            gap: 4px;
            color: #36557F;

            @media(max-width: 768px) {
                min-width: unset;
            }

            &.full-width {
                white-space: nowrap;
                padding-right: 8px;

                .task-detail-node-icon {
                    min-width: 16px;
                    min-height: 16px;
                }
            }
        }

        .task-detail-node-content {
            font-weight: 600;
            display: flex;
            align-items: center;
            flex-grow: 1;

            .text-area {
                width: 100%;
            }
        }

        &:not(.full-width) {
            .task-detail-node-content {
                max-width: 220px;

                @media(max-width: 768px) {
                    max-width: unset;
                }

                & > *:not(.inline-edit-icon) {
                    overflow: hidden;
                }
            }
        }

        .inline-edit-icon {
            margin-left: 4px;
            cursor: pointer;
            min-width: 16px;
        }
    }

    html.prefer-dark, html.dark-theme {
        .task-detail-node {
            svg {
                color: #d5dbea !important;
            }

            .task-detail-node-title {
                color: #d5dbea;
            }
        }
    }
</style>