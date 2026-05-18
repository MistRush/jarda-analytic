<script setup>
import { useClipboard } from "@vueuse/core";
import Tooltip from "@/Components/Other/Tooltip.vue";
import { useAlerts } from "@/Composables/useAlerts.js";
import { useTranslations } from "@/Composables/useTranslation.js";

const props = defineProps({
    text: String,
    title: String,
    class: {
        type: [String, Object, Array],
        default: "",
    },
    alert: {
        type: Boolean,
        default: true,
    },
});

const { info } = useAlerts();
const { translations } = useTranslations();

const emit = defineEmits(["copied"]);

const { copy, copied, isSupported } = useClipboard({ source: props.text });

const onCopy = () => {
    copy(props.text);
    emit("copied", props.text);
    if (props.alert) {
        info(translations.COPY_TO_CLIPBOARD, props.text);
    }
};
</script>

<template>
    <Tooltip v-if="isSupported" @click="onCopy" :text="title" preferred-position="above" class="w-[1.5em] h-[1.5em]" :class="[props.class]">
        <Icon :icon="copied ? 'checkmarkcircle' : 'copy'" :class="[copied ? 'text-primary opacity-100' : '']" class="transition cursor-pointer opacity-70 hover:text-green hover:opacity-100" />
    </Tooltip>
</template>
