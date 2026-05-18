import { computed, inject, ref, useId } from "vue";
import { useDebounceFn } from "@vueuse/core";

export const useForm = (inputProps) => {
    const formBus = inject("form-events", undefined);
    const formInputs = inject("form-inputs", undefined);
    const formErrors = inject("form-errors", null);
    const formRequiredFields = inject("form-requiredFields", undefined);

    const tabInputs = inject("tab-inputs", undefined);

    const inputId = computed(() => {
        return inputProps.id ?? useId();
    });

    const error = computed(() => {
        if (inputProps.error && (typeof inputProps.error === "string" || typeof inputProps.error === "boolean")) {
            return inputProps.error;
        }

        const errors = formErrors?.value?.filter((error) => error.path === inputProps.name);

        if (errors?.length > 1) {
            return errors.map((error) => error.message).join(", ");
        }

        return errors?.[0]?.message;
    });

    const required = computed(() => {
        return typeof inputProps.required !== "undefined" ? inputProps.required : !formRequiredFields || !inputProps.name ? false : formRequiredFields.value.hasOwnProperty(inputProps.name);
    });

    const blurred = ref(false);

    if (formInputs && inputProps.name) {
        formInputs.value[inputProps.name] = inputId.value;
    }

    if (tabInputs && inputProps.name) {
        tabInputs.value[inputProps.name] = inputId.value;
    }

    function emitFormEvent(type, path) {
        if (formBus) {
            formBus.emit({ type, path });
        }
    }

    function emitFormBlur() {
        emitFormEvent("blur", inputProps.name);
        blurred.value = true;
    }

    function emitFormChange() {
        emitFormEvent("change", inputProps.name);
    }

    const emitFormInput = useDebounceFn(() => {
        // if (blurred.value || formGroup?.eagerValidation.value) {
        if (blurred.value) {
            emitFormEvent("input", inputProps.name);
        }
    }, 300);

    return {
        inputId: inputId,
        name: inputProps.name,
        // size: computed(() => {
        //     const formGroupSize = config.size[formGroup?.size.value as string] ? formGroup?.size.value : null
        //     return inputProps?.size ?? formGroupSize ?? config.default?.size
        // }),
        error: error,
        emitFormBlur,
        emitFormInput,
        emitFormChange,
        required,
    };
};
