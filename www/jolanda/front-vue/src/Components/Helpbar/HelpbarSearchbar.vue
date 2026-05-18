<script setup>
    import InputField from "@/Components/Inputs/InputField.vue";
    import { ref, watch } from "vue";
    import { debounce } from "lodash";
    import { useHelpbarStore } from "./stores/helpbarStore";

    const emit = defineEmits(['updateSearch'])

    const helpbarStore = useHelpbarStore(window.pinia);

    const searchText = ref('');
    // TODO udělat vyhledávání pomocí elasticu
    const searchResults = ref(null);
    const showResults = ref(true);

    // TODO zobrazit vyhledávací data pouze v elementu pod searchbarem?
    // Testovací data pro vyhledávání
    searchResults.value = {
        results: [
            {
                id: 1,
                parentdoc_id: 1,
                title: "Jak najít toto",
                tags: "find"
            },
            {
                id: 2,
                parentdoc_id: 1,
                title: 'Jak vytvořit objednávku',
                tags: 'create, order'
            }
        ]
    };

    const searchDocs = debounce((searchTerm) => {
        emit('updateSearch', searchTerm);
    }, 300);

    watch(searchText, (searchTerm) => {
        searchDocs(searchTerm);
    })

</script>

<template>
    <div class="helpbar-search">
        <div class="helpbar-search-input">
            <InputField v-model="searchText" size="large" variant="fancy" icon="search" placeholder="Vyhledat dle názvu/obsahu"/>
        </div>
    </div>
</template>

<style scoped>
    .helpbar-search {
        margin-top: 5px;
        padding: 0 1px;
        font-size: 14px;
        width: 100%;
        z-index: 1;

        .helpbar-search-input {
            position: relative;
            pointer-events: all;
            z-index: 999;
        }

        .helpbar-search-results-wrapper {
            position: relative;
            width: 100%;
            padding: 32px 0 0;
            top: -20px;
            border-radius: 20px;
            box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;

            .helpbar-search-results {
                font-weight: 500;
                display: flex;
                flex-direction: column;
                gap: 2px;
                background: lightgray;

                .helpbar-search-results-title {
                    background: #fff;
                    padding: 0 10px 10px;
                    font-size: 16px;
                }

                .helpbar-search-result {
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;

                    z-index: 0;
                    padding: 12px 15px;
                    background-color: #f4f3f3;
                    &:hover {
                        background-color: lightgray
                    }

                    .result-title {

                    }

                    .result-tags {
                        opacity: 0.7;
                    }
                }
            }


            .helpbar-search-results-empty {
                font-size: 16px;
                text-align: center;
                padding: 0 15px;
            }

        }
    }
</style>