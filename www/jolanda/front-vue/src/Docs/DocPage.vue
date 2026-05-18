<script setup>
import { provide, ref } from "vue";
import Tag from "@/Components/Other/Tag/Tag.vue";
import Copy from "@/Components/Other/Helper/Copy.vue";

const props = defineProps({
    import: String,
});

const examples = ref({});

const registerExample = (id, title) => {
    if (!examples.value.hasOwnProperty(id)) {
        examples.value[id] = title;
    }
};

const handleExampleClick = (id) => {
    document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
};

provide("registerExample", registerExample);
</script>

<template>
    <div class="flex">
        <div class="w-[80%] p-4">
            <div>
                <div class="flex justify-between">
                    <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted"><slot name="title"></slot></h1>
                    <div v-if="props.import" class="flex items-center gap-1 text-primary">
                        <Copy class="" v-if="props.import !== 'global'" :text="props.import" /><Tag light class="items-center">import: {{ props.import }}</Tag>
                    </div>
                </div>

                <div class="text-lg text-pretty text-muted mt-4"><slot name="description"></slot></div>
            </div>
            <div>
                <slot name="content"></slot>
            </div>
        </div>
        <div class="w-[20%] p-4">
            <div class="sticky top-[80px]">
                <span class="font-bold">Na této stránce</span>
                <div class="mt-4">
                    <div v-for="(example, id) in examples" @click="handleExampleClick(id)" class="text-light hover:text-primary cursor-pointer mt-2 mb-2">
                        {{ example }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
