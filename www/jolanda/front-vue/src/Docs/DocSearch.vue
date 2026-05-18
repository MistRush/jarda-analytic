<template>
    <div class="relative w-[80%] p-4">
        <InputField v-model="query" type="text" placeholder="Hledat v dokumentaci..." variant="fancy" icon="search" class="w-full" show-clear />

        <ul v-if="query && results.length" class="absolute z-10 bg-white dark:bg-dark border border-outline dark:border-light/30 mt-1 rounded shadow w-[97%]">
            <template v-for="result in results" :key="result.item.path">
                <li v-if="result.score < 1" @click="goTo(result.item.path)" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-bg cursor-pointer">
                    <strong>{{ result.item.title }}</strong
                    ><small class="ml-2">[{{ result.item.path }}]</small>

                    <div v-if="getSnippet(result)" class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        <span v-html="getSnippet(result)"></span>
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Fuse from "fuse.js";
import docsIndex from "./docs-index.json";
import InputField from "@/Components/Inputs/InputField.vue";

const emit = defineEmits(["goTo"]);

const query = ref("");
const results = ref([]);
const fuse = ref(null);

// Načteme JSON index
const loadIndex = async () => {
    // const res = docsIndex; // nebo /static/docs-index.json pro Nuxt
    const data = docsIndex;
    fuse.value = new Fuse(data, {
        keys: ["title", "component", "path", "content"],
        includeScore: true,
        includeMatches: true,
        threshold: 0.2,
        ignoreLocation: true,
        minMatchCharLength: 2,
    });
};

loadIndex();

// Sleduj změnu query a vyhledávej
watch(query, (newQuery) => {
    if (newQuery && fuse.value && newQuery.trim()) {
        results.value = fuse.value.search(newQuery.trim()).slice(0, 10); // top 10 výsledků
    } else {
        results.value = [];
    }
});

const goTo = (path) => {
    emit("goTo", path);
    query.value = "";
    results.value = [];
};

const getSnippet = (result) => {
    const contentMatches = result.matches?.filter((m) => m.key === "content" && m.indices?.length);
    if (!contentMatches?.length) return null;

    const fullText = result.item.content;

    // Projdi všechny shody napříč všemi matches
    let bestIndex = null;

    contentMatches.forEach((match) => {
        match.indices.forEach(([start, end]) => {
            // Např. můžeš vybrat nejdelší shodu
            if (!bestIndex || end - start > bestIndex[1] - bestIndex[0]) {
                bestIndex = [start, end];
            }

            // Nebo místo nejdelší vezmi tu nejblíž začátku:
            // if (!bestIndex || start < bestIndex[0]) {
            //     bestIndex = [start, end];
            // }
        });
    });

    if (!bestIndex) return null;

    const [start, end] = bestIndex;

    const snippetStart = Math.max(0, start - 20);
    const snippetEnd = Math.min(fullText.length, end + 20);
    const before = fullText.slice(snippetStart, start);
    const matchText = fullText.slice(start, end + 1);
    const after = fullText.slice(end + 1, snippetEnd);

    return `...${before}<mark class="bg-yellow-200 text-black">${matchText}</mark>${after}...`;
};
</script>
