<script setup>
    import { computed} from "vue";

    const props = defineProps({
        highlight: [String, Array],
        text: String,
    });

    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const highlightedText = computed(() => {
        if(!props.text){
            return "";
        }

        if (!props.highlight) {
            return props.text;
        }

        if(Array.isArray(props.highlight)){
            let text = props.text;
            props.highlight.forEach((highlight) => {
                const regex = new RegExp(escapeRegExp(highlight), 'gi');
                text = text.replace(regex, (match) => {
                    return `<span class="highlighted-text" style="background-color: yellow; color: red !important;">${match}</span>`;
                });
            });
            return text;
        }else{
            const regex = new RegExp(escapeRegExp(props.highlight), 'gi');

            return props.text.replace(regex, (match) => {
                return `<span class="highlighted-text" style="background-color: yellow; color: red !important;">${match}</span>`;
            });
        }
    });

</script>

<template>
    <div v-html="highlightedText"></div>
</template>

<style scoped>
    .highlighted-text {
        background-color: yellow;
        color: red;
    }
</style>