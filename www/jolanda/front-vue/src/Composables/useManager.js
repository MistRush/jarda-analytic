import { computed, ref, unref } from "vue";
import { useAjax } from "@/Composables/useAjax.js";

const useManager = (manager, useSchema = true) => {
    const ajax = useAjax();
    const schema = ref(null);

    const urls = computed(() => {
        let url;
        let result;

        if (typeof manager === "string") {
            url = manager;
            if (!manager.endsWith("/")) {
                url += "/";
            }
        } else if (typeof manager === "object") {
            if (typeof manager.store === "string") {
                url = manager.store;
                if (!manager.store.endsWith("/")) {
                    url += "/";
                }
            } else if (typeof manager.store === "object") {
                url = "/";

                if (manager.store.module) {
                    url += manager.store.module;
                } else {
                    url += "admin";
                }

                if (manager.store.controller) {
                    url += "/" + manager.store.controller;
                } else {
                    console.error("Controller is not set in manager store");
                    return;
                }

                // if(manager.store.action){
                //     url += '/' + manager.store.action;
                // }else{
                //     url += '/data-list';
                // }
            }
        }

        if (url) {
            if (!url.startsWith("/")) {
                url = "/" + url;
            }

            if (!url.endsWith("/")) {
                url += "/";
            }
        }

        result = {
            list: url + "data-list",
            update: url + "data-update",
            create: url + "data-create",
            delete: url + "data-delete",
            grid: url + "data-grid",
            editor: url + "data-editor",
            schema: url + "data-schema",
            preview: url + "data-preview",
        };

        return result;
    });

    const getURLs = () => {
        return urls.value;
    };

    const getParams = () => {
        if (typeof manager?.params === "object") {
            return manager.params;
        }
    };

    const fetchSchema = async () => {
        if (!urls.value.schema) {
            console.error("URLs not specified");
            return false;
        }

        try {
            const { data } = await ajax.get(urls.value.schema, null, null);

            if (!data?.schema) {
                console.error("Cannot find schema");
            }

            schema.value = data.schema;

            return schema.value;
        } catch ({ error }) {
            console.error(error);
        }

        return false;
    };

    const createPlainRecord = async () => {
        if (!schema.value && useSchema) {
            await fetchSchema();
        }

        if (useSchema && schema.value) {
            return applySchemaToRecords({});
        } else if (useSchema && !schema.value) {
            console.error("Schema not specified");
            return {};
        }

        return {};
    };

    const applySchemaToRecords = (records, clear = false) => {
        let resolvedRecords = records;
        if (!Array.isArray(resolvedRecords)) {
            resolvedRecords = applySchemaToRecord(resolvedRecords, clear);
        } else {
            resolvedRecords.forEach((row, index) => {
                resolvedRecords[index] = applySchemaToRecord(row, clear);
            });
        }

        return resolvedRecords;
    };

    const applySchemaToRecord = (record, clear = false) => {
        return applySchemaToObject(record, schema.value, clear);
    };

    const applySchemaToObject = (object, schema, clear = false) => {
        const modifiedObj = { ...object } ?? {};
        schema.children?.forEach((child) => {
            if (child.type !== 1) return;

            //Relation ONE
            if (child.relation.type === 2) {
                if (modifiedObj.hasOwnProperty(child.relation.local) && modifiedObj[child.relation.local] === null) {
                    if (!clear) {
                        if (!modifiedObj.hasOwnProperty(child.aliasAs) || modifiedObj[child.aliasAs] === null) {
                            modifiedObj[child.aliasAs] = {};
                        }
                    } else {
                    }
                } else if (modifiedObj.hasOwnProperty(child.relation.local) && modifiedObj[child.relation.local] !== null) {
                    if (!clear) {
                        if (!modifiedObj.hasOwnProperty(child.aliasAs) || modifiedObj[child.aliasAs] === null) {
                            console.error("Record has local key " + child.relation.local + "=" + modifiedObj[child.relation.local] + " but relation [" + child.aliasAs + "] is not set or is null");
                            return;
                        }
                    } else {
                        if (modifiedObj.hasOwnProperty(child.aliasAs) && typeof modifiedObj[child.aliasAs] === "object") {
                            const isEmpty = Object.keys(modifiedObj[child.aliasAs]).length === 0;

                            if (isEmpty) {
                                delete modifiedObj[child.aliasAs];
                            }
                        }
                    }
                } else if (!modifiedObj.hasOwnProperty(child.relation.local)) {
                    if (!clear) {
                        if (!modifiedObj.hasOwnProperty(child.aliasAs) || modifiedObj[child.aliasAs] === null) {
                            modifiedObj[child.aliasAs] = {};
                        }
                    }
                }

                if (clear) {
                    if (modifiedObj.hasOwnProperty(child.aliasAs)) {
                        modifiedObj[child.aliasAs] = applySchemaToObject(modifiedObj[child.aliasAs], child);
                    }
                } else {
                    modifiedObj[child.aliasAs] = applySchemaToObject(modifiedObj[child.aliasAs], child);
                }

                return;
            }

            //Relation MANY
            if (child.relation.type === 1) {
                if (!clear) {
                    if (!modifiedObj.hasOwnProperty(child.aliasAs)) {
                        modifiedObj[child.aliasAs] = [];
                    } else if (!Array.isArray(modifiedObj[child.aliasAs])) {
                        console.error("MANY relation [" + child.aliasAs + "] is not array");
                        return;
                    }
                } else {
                    if (modifiedObj.hasOwnProperty(child.aliasAs) && (modifiedObj[child.aliasAs] === null || (Array.isArray(modifiedObj[child.aliasAs]) && modifiedObj[child.aliasAs].length === 0))) {
                        delete modifiedObj[child.aliasAs];
                    }
                }

                if (modifiedObj.hasOwnProperty(child.aliasAs)) {
                    const raw = unref(modifiedObj[child.aliasAs]);
                    const items = Array.isArray(raw) ? raw
                        : Array.isArray(raw?.new) ? raw.new
                            : [];
                    items.forEach((item, index) => {
                        if (clear) {
                            if (modifiedObj.hasOwnProperty(child.aliasAs)) {
                                modifiedObj[child.aliasAs][index] = applySchemaToObject(item, child);
                            }
                        } else {
                            modifiedObj[child.aliasAs][index] = applySchemaToObject(item, child);
                        }
                    });
                }
                return;
            }
        });

        return modifiedObj;
    };

    const getData = async (params = null) => {
        const result = {
            data: null,
            originalData: null,
            error: false,
            schema: null,
        };

        try {
            const { data } = await ajax.get(urls.value.list, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    ...params,
                    ...(useSchema ? { _getSchema: 1 } : {}),
                },
            });

            if (useSchema && !data?.schema) {
                console.error("Schema not specified");
                result.error = true;
                return result;
            } else if (useSchema && data?.schema) {
                schema.value = data.schema;
                result.schema = data.schema;
            }

            if (!data?.items) {
                result.error = true;
                console.error("No items found");
                return result;
            }

            if (data?.items?.length) {
                if (useSchema) {
                    result.originalData = data.items;
                    result.data = applySchemaToRecords(data.items);
                } else {
                    result.data = data.items;
                }
            }

            return result;
        } catch ({ error }) {
            console.error(error);
            result.error = true;
            return result;
        }
    };

    return {
        getURLs,
        getParams,
        urls,
        schema,
        fetchSchema,
        createPlainRecord,
        applySchemaToObject,
        applySchemaToRecord,
        applySchemaToRecords,
        getData,
    };
};

export { useManager };
