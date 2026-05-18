<script setup>
import Dialog from "../js/Dialog.js";
import {reactive} from "vue";

const props = defineProps({
    dialog: Object
});

const dialog = reactive(props.dialog ? props.dialog : new Dialog());

const getFooter = () => {
    if (!dialog._footer) {
        return null;
    }

    let footer = dialog._footer;

    if (dialog.confirmButton && !dialog._footer.includes(`id="dialog_${dialog._uid}_confirm_button"`)){
        footer += `<button class="btn btn-success" id="dialog_${dialog._uid}_confirm_button" data-dialog-id="dialog_${dialog._uid}" onclick="${dialog.confirm_function}">${dialog._confirmButtonText}</button>`;
    }

    if (dialog.cancelButton && !dialog._footer.includes(`id="dialog_${dialog._uid}_cancel_button"`))
        footer += `<button class="btn btn-red" id="dialog_${dialog._uid}_cancel_button"  data-dialog-id="dialog_${dialog._uid}" onclick="dialog.close()">${dialog._cancelButtonText}</button>`;

    return footer;
}

</script>

<template>
    <Teleport to="#vue_teleport">
        <div
            :id="dialog._uid"
            class="modal fade"
            :class="{
                show: dialog.shown,
            }"
            :style="{
                display: dialog.shown ? 'block' : 'none',
            }"
            role="dialog"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered" :id="'dialog_' + dialog._uid" role="document"
                 :style="{
                ['max-width']: dialog ? dialog._maxWidth + 'px' : null,
            }"
            >
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><slot name="title">{{ dialog._title }}</slot></h5>
                        <button type="button" class="close" @click="dialog.close()" aria-label="Close">
                            <span aria-hidden="true"><i class="ci ci-times"></i></span>
                        </button>
                    </div>
                    <div v-if="$slots.content" class="modal-body">
                        <slot name="content">
                        </slot>
                    </div>
                    <div v-else class="modal-body" v-html="dialog._content">
                    </div>
                    <template v-if="$slots.footer || dialog._footer || (dialog.confirmButton || dialog.cancelButton)">
                        <template v-if="$slots.footer">
                            <div class="modal-footer">
                                <slot name="footer"></slot>
                                <button
                                    v-if="dialog.confirmButton"
                                    class="btn btn-success"
                                    :id="'dialog_' + dialog._uid + '_confirm_button'"
                                    :data-dialog-id="'dialog_' + dialog._uid"
                                    @click="dialog.confirm_function"
                                >
                                    {{ dialog._confirmButtonText }}
                                </button>
                                <button
                                    v-if="dialog.cancelButton"
                                    class="btn btn-red"
                                    :id="'dialog_' + dialog._uid + '_cancel_button'"
                                    :data-dialog-id="'dialog_' + dialog._uid"
                                    @click="dialog.close()"
                                >
                                    {{ dialog._cancelButtonText }}
                                </button>
                            </div>
                        </template>
                        <template v-else-if="getFooter()">
                            <div class="modal-footer" v-html="getFooter()">
                            </div>
                        </template>
                        <template v-else>
                            <div class="modal-footer">
                                <button
                                    v-if="dialog.confirmButton"
                                    class="btn btn-success"
                                    :id="'dialog_' + dialog._uid + '_confirm_button'"
                                    :data-dialog-id="'dialog_' + dialog._uid"
                                    @click="dialog.confirm_function"
                                >
                                    {{ dialog._confirmButtonText }}
                                </button>
                                <button
                                    v-if="dialog.cancelButton"
                                    class="btn btn-red"
                                    :id="'dialog_' + dialog._uid + '_cancel_button'"
                                    :data-dialog-id="'dialog_' + dialog._uid"
                                    @click="dialog.close()"
                                >
                                    {{ dialog._cancelButtonText }}
                                </button>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
        </div>
    </Teleport>
</template>