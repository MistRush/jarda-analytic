<script setup>
import { inject, onMounted } from "vue";
import { cloneDeep } from "lodash";
import { Filter } from "@/Filter/js/Filter";
import NewSelect from "@/Components/Inputs/NewSelect.vue";
import InputField from "@/Components/Inputs/InputField.vue";
import Button from "@/Components/Inputs/Button.vue";

const emit = defineEmits(["change"]);

const props = defineProps({
    filter: Object,
    viewOnly: {
        type: Boolean,
        default: false,
    },
});

const localFilter = inject("filterObj", props.filter ? cloneDeep(props.filter) : new Filter(null));

onMounted(() => {
    Object.entries(localFilter.items).forEach(([key, val]) => {
        if (!val.filters.length) {
            val.addNoneOperation();
        }
    });
});

const operations = {
    none: "-",
    equal: "=",
    not_equal: "!=",
    like: "obsahuje",
    not_like: "neobsahuje",
    bool: "ano/ne",
    range: "od - do",
    in: "v seznamu",
    not_in: "není v seznamu",
    less: "<",
    less_equal: "<=",
    more: ">",
    more_equal: ">=",
};

const onChange = () => {
    emit("change", localFilter);
};
</script>

<template>
    <div>
        <div v-if="Object.entries(localFilter.items).length" class="grid grid-cols-2 gap-4">
            <div v-for="(item, key) in localFilter.items" :key="key" class="col-span-1">
                <div>
                    <div>{{ item.name }}</div>
                    <div class="pl-6">
                        <div v-for="(filter, index) in item.filters" :key="index" class="flex">
                            <NewSelect
                                v-model="filter.operation"
                                label="Operátor"
                                :options="
                                    Object.entries(operations).map((operation, index) => {
                                        return { text: operation[1], value: operation[0] };
                                    })
                                "
                                class="mr-2 max-w-[180px]"
                                @change="onChange"
                                :disabled="props.viewOnly"
                            ></NewSelect>
                            <InputField v-model="filter.value" label="Hodnota" class="mr-2 flex-grow-1" @change="onChange" :readonly="props.viewOnly" />
                            <Button
                                class="m-0 mt-7"
                                v-if="index === item.filters.length - 1 && !props.viewOnly"
                                @click="
                                    () => {
                                        item.addNoneOperation();
                                    }
                                "
                                >+</Button
                            >
                            <Button class="m-0 mt-7" v-else-if="!props.viewOnly" @click="item.removeFilter(index)" variant="red">-</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center">
            <h3>Nelze filtrovat podle žádné hodnoty</h3>
        </div>
    </div>
</template>
