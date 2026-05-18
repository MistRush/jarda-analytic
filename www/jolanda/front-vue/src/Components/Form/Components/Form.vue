<template>
    <form :id="formId" @submit.prevent="onSubmit">
        <slot v-bind="{ errors }" />
    </form>
</template>

<script>
import { provide, ref, defineComponent, onUnmounted, onMounted, readonly } from "vue";
import { useEventBus } from "@vueuse/core";
import { useId } from "vue";

class FormException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, FormException.prototype);
    }
}

export default defineComponent({
    props: {
        schema: {
            type: [Object, Function],
            default: undefined,
        },
        state: {
            type: Object,
            required: true,
        },
        validate: {
            type: Function,
            default: () => [],
        },
        validateOn: {
            type: Array,
            default: () => ["blur", "input", "change", "submit"],
        },
        id: {
            type: [String, Number],
            default: null,
        },
    },
    emits: ["submit", "error"],
    setup(props, { expose, emit }) {
        const formId = props.id ?? useId();
        const bus = useEventBus(`form-${formId}`);

        const parsedValue = ref(null);

        async function getRequiredFields() {
            requiredFields.value = {};

            if (!props.schema?.describe) {
                return;
            }

            const description = props.schema.describe({ value: props.state });

            if (description) {
                const resolveFields = (fields, chain = "") => {
                    Object.entries(fields).forEach((item) => {
                        if (item[1].tests?.findIndex(({ name }) => name === "required") >= 0 || item[1].tests?.findIndex(({ name }) => name === "nonNullable") >= 0) {
                            requiredFields.value[chain + item[0]] = true;
                        }

                        if (item[1].hasOwnProperty("fields") && item[1].fields) {
                            resolveFields(item[1].fields, chain + item[0] + ".");
                        }
                    });
                };

                resolveFields(description.fields);
            }
        }

        let _writeQueue = Promise.resolve();
        function withWriteLock(fn) {
            const run = _writeQueue.then(fn, fn);
            // neblokuj řetěz při chybě, aby se fronta "nezasekla"
            _writeQueue = run.catch(() => {});
            return run;
        }

        const errors = ref([]);

        provide("form-errors", errors);
        provide("form-events", bus);
        const inputs = ref({});
        provide("form-inputs", inputs);
        const requiredFields = ref({});
        provide("form-requiredFields", requiredFields);

        onMounted(() => {
            getRequiredFields();
            bus.on(async (event) => {
                if (event.type !== "submit" && props.validateOn?.includes(event.type)) {
                    await validate(event.path, { silent: true });
                }

                getRequiredFields();
            });
        });

        onUnmounted(() => {
            bus.reset();
        });

        async function getErrors() {
            let errs = await props.validate(props.state);

            if (props.schema) {
                const { errors, result } = await parseSchema(props.state, props.schema);
                if (errors) {
                    errs = errs.concat(errors);
                } else {
                    parsedValue.value = result;
                }
            }

            return errs;
        }

        async function validate(path, opts = { silent: false }) {
            let paths = path;

            if (path && !Array.isArray(path)) {
                paths = [path];
            }

            if (paths) {
                const allErrors = await getErrors(); // získám nejdřív výsledky

                // Zápis do errors.value provedu atomicky v locku,
                // takže se zápisy nebudou křížit.
                await withWriteLock(() => {
                    const otherErrors = errors.value.filter(e => !paths.includes(e.path));
                    const pathErrors  = allErrors.filter(e => paths.includes(e.path));
                    errors.value = otherErrors.concat(pathErrors);
                });
            } else {
                const allErrors = await getErrors();
                await withWriteLock(() => {
                    errors.value = allErrors;
                });
            }

            if (errors.value.length > 0) {
                if (opts.silent) return false;

                throw new FormException(`Form validation failed: ${JSON.stringify(errors.value, null, 2)}`);
            }

            return props.state;
        }

        async function onSubmit(payload) {
            const event = payload;
            try {
                if (props.validateOn?.includes("submit")) {
                    await validate();
                }
                event.data = props.schema ? parsedValue.value : props.state;
                emit("submit", event);
            } catch (error) {
                if (!(error instanceof FormException)) {
                    throw error;
                }

                const errorEvent = {
                    ...event,
                    errors: errors.value.map((err) => ({
                        ...err,
                        id: inputs.value[err.path],
                    })),
                };
                emit("error", errorEvent);
            }
        }

        async function validateAllInputs(opts = { silent: false }) {
            const paths = Object.keys(inputs.value || {});
            if (paths.length === 0) return props.state; // nic k validaci

            // využiješ existující optimalizaci ve validate(paths)
            return await validate(paths, opts);
        }

        expose({
            validate,
            validateAllInputs,
            errors,
            setErrors(errs, path) {
                if (path) {
                    errors.value = errors.value.filter((error) => error.path !== path).concat(errs);
                } else {
                    errors.value = errs;
                }
            },
            async submit() {
                await onSubmit(new Event("submit"));
            },
            getErrors(path) {
                if (path) {
                    return errors.value.filter((err) => err.path === path);
                }
                return errors.value;
            },
            clear(path) {
                if (path) {
                    errors.value = errors.value.filter((err) => err.path !== path);
                } else {
                    errors.value = [];
                }
            },
        });

        return {
            onSubmit,
            errors: readonly(errors),
            formId,
        };
    },
});

function isYupSchema(schema) {
    return schema.validate && schema.__isYupSchema__;
}

function isYupError(error) {
    return error.inner !== undefined;
}

function isSuperStructSchema(schema) {
    return "schema" in schema && typeof schema.coercer === "function" && typeof schema.validator === "function" && typeof schema.refiner === "function";
}

function isJoiSchema(schema) {
    return schema.validateAsync !== undefined && schema.id !== undefined;
}

function isJoiError(error) {
    return error.isJoi === true;
}

function isValibotSchema(schema) {
    return "_parse" in schema || "_run" in schema || (typeof schema === "function" && "schema" in schema);
}

function isZodSchema(schema) {
    return schema.parse !== undefined;
}

async function validateValibotSchema(state, schema) {
    const result = await ("_parse" in schema ? schema._parse(state) : "_run" in schema ? schema._run({ typed: false, value: state }, {}) : schema(state));

    if (!result.issues || result.issues.length === 0) {
        const output = "output" in result ? result.output : "value" in result ? result.value : null;
        return {
            errors: null,
            result: output,
        };
    }

    const errors = result.issues.map((issue) => ({
        path: issue.path?.map((item) => item.key).join(".") || "",
        message: issue.message,
    }));

    return {
        errors,
        result: null,
    };
}

async function validateJoiSchema(state, schema) {
    try {
        const result = await schema.validateAsync(state, { abortEarly: false });
        return {
            errors: null,
            result,
        };
    } catch (error) {
        if (isJoiError(error)) {
            const errors = error.details.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }));

            return {
                errors,
                result: null,
            };
        } else {
            throw error;
        }
    }
}

async function validateZodSchema(state, schema) {
    const result = await schema.safeParseAsync(state);
    if (result.success === false) {
        const errors = result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));

        return {
            errors,
            result: null,
        };
    }
    return {
        result: result.data,
        errors: null,
    };
}

async function validateSuperstructSchema(state, schema) {
    const [err, result] = schema.validate(state);
    if (err) {
        const errors = err.failures().map((error) => ({
            message: error.message,
            path: error.path.join("."),
        }));

        return {
            errors,
            result: null,
        };
    }

    return {
        errors: null,
        result,
    };
}

async function validateYupSchema(state, schema) {
    try {
        const result = await schema.validate(state, { abortEarly: false });
        return {
            errors: null,
            result,
        };
    } catch (error) {
        if (isYupError(error)) {
            const errors = error.inner.map((issue, index, arr) => {
                let path = issue.path ?? "";
                let message = issue.message;

                if (issue.type === "fileType" && path) {
                    const match = issue.path.match(/^([a-zA-Z_]+)\[(\d+)\]$/);
                    if (match) {
                        path = match[1]; // Část před [ ]
                        const index = parseInt(match[2], 10); // Číslo uvnitř [ ]

                        const fileName = issue.params?.originalValue?.name;

                        if (fileName) {
                            message = "[" + fileName + "] " + message;
                        }
                    }
                }

                return {
                    path: path,
                    message: message,
                };
            });

            return {
                errors,
                result: null,
            };
        } else {
            throw error;
        }
    }
}

function parseSchema(state, schema) {
    if (isZodSchema(schema)) {
        return validateZodSchema(state, schema);
    } else if (isJoiSchema(schema)) {
        return validateJoiSchema(state, schema);
    } else if (isValibotSchema(schema)) {
        return validateValibotSchema(state, schema);
    } else if (isYupSchema(schema)) {
        return validateYupSchema(state, schema);
    } else if (isSuperStructSchema(schema)) {
        return validateSuperstructSchema(state, schema);
    } else {
        throw new Error("Form validation failed: Unsupported form schema");
    }
}
</script>
