<script setup>
import { ref, watch, computed, onMounted, h } from "vue";
import { useAjax } from "@/Composables/useAjax.js";
import { useManager } from "@/Composables/useManager.js";
import { useTranslations } from "@/Composables/useTranslation.js";
import Help from "@/Components/Other/Help.vue";
import Checkbox from "@/Components/Inputs/Checkbox.vue";
import Icon from "@/Icons/Icon.vue";

const props = defineProps({
    parentID: { type: [Number, null, String], default: null },
    sourceManager: { type: [String, Object], required: true },
    relationManager: { type: [String, Object], required: true },
    parentColumn: { type: String, required: true },
    childColumn: { type: String, required: true },
    childNameColumn: { type: String, required: true },
    groupByColumn: { type: String, default: null },
    groupByNameColumn: { type: String, default: null },
    label: { type: [String, Function], required: true },
    help: String,
});

const sourceManager = useManager(props.sourceManager);
const relationManager = useManager(props.relationManager);
const { translations } = useTranslations();

const ajax = useAjax();

const emit = defineEmits(["change", "afterChange"]);

// Data
const sourceData = ref({});
const currentRelations = ref({});
const filterValue = ref("");

//collapsible
const expanded = ref(new Set()); // IDs otevřených uzlů
const parentMap = ref({}); // id -> parentId

// Funkce
const getSource = async () => {
    await ajax
        .get(sourceManager.urls.value.list, {
            params: sourceManager.getParams(),
        })
        .then(({ data }) => {
            const items = data.items ?? data;

            const grouped = {};
            const relations = {};

            const buildTree = (items, parentId = null, groupByColumn, childNameColumn, grouped = {}, relations = {}) => {
                const children = items.filter((item) => item[groupByColumn] === parentId);

                for (const item of children) {
                    const id = item.ID;
                    const name = item[childNameColumn];

                    grouped[id] = {
                        name: name,
                        child: {},
                    };

                    if (parentId !== null) {
                        parentMap.value[id] = parentId;
                    }

                    relations[id] = { ID: null, state: false };

                    buildTree(items, id, groupByColumn, childNameColumn, grouped[id].child, relations);
                }

                return { grouped, relations };
            };

            if (props.groupByColumn) {
                parentMap.value = {};
                expanded.value = new Set();

                const { grouped, relations } = buildTree(
                    items,
                    null, // výchozí parentId
                    props.groupByColumn, // např. "ParentID"
                    props.childNameColumn, // např. "name"
                );

                sourceData.value = grouped;
                currentRelations.value = relations;
            } else {
                items.forEach((item) => {
                    const name = item[props.childNameColumn];
                    const id = item.ID;

                    grouped[id] = name;
                    relations[id] = { ID: null, state: false };
                });

                sourceData.value = grouped;
                currentRelations.value = relations;
            }

            // items.forEach((item) => {
            //     const groupKey = props.groupByColumn ? item[props.groupByColumn] || 0 : null;
            //     const name = item[props.childNameColumn];
            //     const id = item.ID;
            //
            //     if (props.groupByColumn) {
            //         if (groupKey) {
            //             if (!grouped[groupKey])
            //                 grouped[groupKey] = {
            //                     name: null,
            //                     child: {},
            //                 };
            //
            //             grouped[groupKey]["child"][id] = name;
            //         } else {
            //             if (!grouped[id])
            //                 grouped[id] = {
            //                     child: {},
            //                 };
            //
            //             grouped[id]["name"] = name;
            //         }
            //     } else {
            //         grouped[id] = name;
            //     }
            //
            //     relations[id] = { ID: null, state: false };
            // });
            // sourceData.value = grouped;
            // currentRelations.value = relations;
        });
};

const reload = async () => {
    return await getSource();
};

const reloadRelations = async () => {
    return await getRelations();
};

const getRelations = () => {
    if (!props.parentID) return;
    const reqData = { [props.parentColumn]: props.parentID };

    Object.values(currentRelations.value).forEach((r) => (r.state = false));

    ajax.get(relationManager.urls.value.list, {
        params: reqData,
    }).then(({ data }) => {
        (data.items || []).forEach((rel) => {
            const childId = rel[props.childColumn];
            currentRelations.value[childId] = { ID: rel.ID, state: true };
            // otevřít cestu k vybranému
            expandAncestors(childId);
        });
    });
};

const createRelation = (id) => {
    const data = {
        [props.parentColumn]: props.parentID,
        [props.childColumn]: id,
    };

    emit("change", currentRelations.value);

    ajax.postForm(relationManager.urls.value.create, {
        data: JSON.stringify(data),
    }).then(({ data }) => {
        const item = typeof data === "string" ? JSON.parse(data).items[0] : data.items[0];
        currentRelations.value[id] = { ID: item.ID, state: true };

        emit("afterChange", currentRelations.value);
    });
};

const deleteRelation = (id) => {
    ajax.postForm(relationManager.urls.value.delete, {
        data: JSON.stringify({ ID: currentRelations.value[id].ID }),
    }).then(({ data }) => {
        currentRelations.value[id].state = false;

        emit("afterChange", currentRelations.value);
    });
};

const toggleAll = (checked) => {
    Object.keys(currentRelations.value).forEach((id) => {
        const relation = currentRelations.value[id];
        if (relation.state !== checked) {
            if (checked) createRelation(id);
            else deleteRelation(id);
        }
    });
};

const toggleGroup = (groupKey, checked) => {
    const items = sourceData.value[groupKey];
    for (const id in items) {
        if (currentRelations.value[id].state !== checked) {
            if (checked) createRelation(id);
            else deleteRelation(id);
        }
    }
};

const filteredItems = computed(() => {
    const text = filterValue.value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "");
    if (!text) return sourceData.value;

    const result = {};

    if (props.groupByColumn) {
        const filterGroup = (group, text) => {
            const normalizedText = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
            const label = group.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");

            const result = { ...group }; // kopie kvůli úpravám
            let hasMatch = false;

            if (label.includes(normalizedText)) {
                hasMatch = true;
            }

            if (group.child) {
                const filteredChildren = {};
                for (const childKey in group.child) {
                    const child = group.child[childKey];

                    if (typeof child === "string") {
                        const childLabel = child.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
                        if (childLabel.includes(normalizedText)) {
                            filteredChildren[childKey] = child;
                            hasMatch = true;
                        }
                    } else if (typeof child === "object") {
                        const filteredChild = filterGroup(child, text);
                        if (filteredChild) {
                            filteredChildren[childKey] = filteredChild;
                            hasMatch = true;
                        }
                    }
                }

                result.child = filteredChildren;
            }

            return hasMatch ? result : null;
        };

        for (const groupKey in sourceData.value) {
            const filtered = filterGroup(sourceData.value[groupKey], text);
            if (filtered) {
                result[groupKey] = filtered;
            }
        }

        // for (const groupKey in sourceData.value) {
        //     const childMatches = {};
        //
        //     for (const id in sourceData.value[groupKey]["child"]) {
        //         const childLabel = sourceData.value[groupKey]["child"][id].toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
        //         if (childLabel.includes(text)) {
        //             childMatches[id] = sourceData.value[groupKey]["child"][id];
        //         }
        //     }
        //
        //     const label = sourceData.value[groupKey]["name"].toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
        //     if (Object.keys(childMatches).length > 0 || label.includes(text)) {
        //         result[groupKey] = sourceData.value[groupKey];
        //         result[groupKey]["child"] = childMatches;
        //     }
        // }
    } else {
        for (const id in sourceData.value) {
            const label = sourceData.value[id].toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
            if (label.includes(text)) result[id] = sourceData.value[id];
        }
    }

    return result;
});

const selectedCount = computed(() => Object.values(currentRelations.value).filter((r) => r.state).length);
const totalCount = computed(() => {
    if (!props.groupByColumn) return Object.keys(sourceData.value).length;
    return Object.values(sourceData.value).reduce((sum, g) => sum + Object.keys(g).length, 0);
});

// Watch
watch(
    () => props.parentID,
    (newId) => {
        getRelations();
    },
);

// Lifecycle
onMounted(async () => {
    await getSource();
    if (props.parentID !== null) {
        getRelations();
    }
});

defineExpose({
    sourceData,
    currentRelations,
    reload,
    reloadRelations,
});

const renderGroup = (group, groupKey) => {
    const children = [];

    // Label group
    children.push(
        h("div", { class: ["rs-group-label flex gap-2 items-center", expanded.value.has(groupKey) || filterValue.value ? "" : "collapsed"] }, [
            h("div", { class: "w-[12px]" }, [
                group.child && Object.keys(group.child).length > 0
                    ? h(Icon, {
                          icon: "arrow",
                          onClick: (e) => {
                              e.stopPropagation();
                              toggleExpanded(groupKey);
                          },
                          direction: expanded.value.has(groupKey) || filterValue.value ? "bottom" : "right",
                          onKeydown: (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggleExpanded(groupKey);
                              }
                          },
                          class: ["w-[12px]"],
                      })
                    : null,
            ]),
            h("label", { class: "checkbox rs-group-checkbox" }, [
                h(Checkbox, {
                    label: group.name,
                    "onUpdate:modelValue": (val) => {
                        currentRelations.value[groupKey].state = val;

                        if (val) createRelation(groupKey);
                        else deleteRelation(groupKey);
                    },
                    modelValue: currentRelations.value[groupKey]?.state,
                }),
            ]),
        ]),
    );

    // Render child items
    const isOpen = expanded.value.has(groupKey) || filterValue.value;
    if (isOpen && group.child && Object.keys(group.child).length > 0) {
        const childElements = [];

        for (const [id, value] of Object.entries(group.child)) {
            if (typeof value === "string") {
            } else if (typeof value === "object") {
                // Recursive call
                childElements.push(renderGroup(value, id));
            }
        }

        children.push(h("div", { class: "rs-group mt-0.5 mb-2 pl-6", "data-group": groupKey }, childElements));
    }

    return h("div", { key: groupKey, class: "mt-1" }, children);
};

const expandAncestors = (id) => {
    let cur = parentMap.value[id];
    while (cur !== undefined && cur !== null) {
        expanded.value.add(cur);
        cur = parentMap.value[cur];
    }
};

const toggleExpanded = (id) => {
    if (expanded.value.has(id)) expanded.value.delete(id);
    else expanded.value.add(id);
};

// watch(filterValue, (val) => {
//     if (!props.groupByColumn) return;
//     if (!val) return; // bez filtru nic nehýbej
//     // jednoduché: otevři všechny skupiny – anebo sofistikovaně jen cesty s matchi
//     // tady zjednodušeně otevřeme vše
//     const openAll = (tree) => {
//         for (const id in tree) {
//             expanded.value.add(Number.isNaN(+id) ? id : +id);
//             const node = tree[id];
//             if (node?.child) openAll(node.child);
//         }
//     };
//     expanded.value = new Set();
//     openAll(filteredItems.value);
// });
</script>

<template>
    <div class="relation-switcher">
        <h4>
            <component v-if="typeof label === 'function' && label" :is="label" />
            <template v-else>
                {{ label }}
            </template>
            ({{ selectedCount }}/{{ totalCount }})
            <Help v-if="help" :help="help" />
        </h4>
        <div class="search mb-4 mt-2 w100 flex gap-2">
            <InputField v-model="filterValue" icon="search" class="w-[200px]!" />
            <Button @click="() => toggleAll(true)">
                {{ translations.SELECT_ALL }}
            </Button>
            <Button @click="() => toggleAll(false)">
                {{ translations.UNSELECT_ALL }}
            </Button>
        </div>
        <div class="data">
            <template v-if="props.groupByColumn">
                <component :is="renderGroup(group, groupKey)" v-for="(group, groupKey) in filteredItems" :key="groupKey" />
            </template>
            <template v-else>
                <Checkbox
                    v-for="(label, id) in filteredItems"
                    :key="id"
                    :label="label"
                    v-model="currentRelations[id].state"
                    @change="
                        (checked) => {
                            if (checked) createRelation(id);
                            else deleteRelation(id);
                        }
                    "
                    class="checkbox rs-checkbox flex mt-1.5"
                />
            </template>
        </div>
    </div>
</template>

<style scoped>
.relation-switcher,
.dataTable-rs {
    .btn {
        padding: 5px;
        min-height: 28px;
        margin-left: 4px;
    }

    .rs-group-label {
        display: flex;
        align-items: center;
        cursor: pointer;

        .rs-arrow {
            width: 16px;
            height: 16px;
            background-color: #c4cdd5;
            clip-path: polygon(33% 20%, 33% 80%, 66% 50%);
            transition: transform 300ms;
            margin-right: 4px;
        }

        &:not(.collapsed) {
            .rs-arrow {
                -webkit-transform: rotate(90deg);
                -ms-transform: rotate(90deg);
                transform: rotate(90deg);
            }
        }
    }

    .rs-group {
        .rs-checkbox {
            margin-left: 32px;
        }
    }
}
</style>
