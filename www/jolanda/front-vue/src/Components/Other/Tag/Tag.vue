<script>
export const variants = ["primary", "red", "green", "default", "orange", "blue", "white", "gray"];
</script>

<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: "primary",
        validator(value) {
            return variants.includes(value);
        },
    },
    light: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div
        class="tag"
        :class="{
            ['color-' + props.variant]: true,
            light: props.light,
        }"
    >
        <span>
            <slot name="default" />
        </span>
    </div>
</template>

<style scoped>
.tag {
    font-size: 0.769rem;
    padding: 0.308rem 0.462rem;
    border-radius: 0.385rem;
    font-weight: 600;
    display: inline-block;
    line-height: 0.9rem;
    white-space: nowrap;

    &.color-primary {
        background: var(--color-primary);
        color: var(--color-white);

        &.light {
            background: color-mix(in srgb, var(--color-primary) 20%, transparent);
            color: var(--color-primary);
        }
    }

    &.color-red {
        background: var(--color-red);
        color: var(--color-white);

        &.light {
            background: color-mix(in srgb, var(--color-red) 20%, transparent);
            color: var(--color-red);
        }
    }

    &.color-green {
        background: var(--color-green);
        color: var(--color-white);

        &.light {
            background: color-mix(in srgb, var(--color-green) 20%, transparent);
            color: var(--color-green);
        }
    }

    &.color-default {
        background: var(--color-dark);
        color: var(--color-white);

        &.light {
            background: color-mix(in srgb, var(--color-dark) 20%, transparent);
            color: var(--color-dark);
        }
    }

    &.color-orange {
        background: var(--color-orange);
        color: var(--color-white);

        &.light {
            background: color-mix(in srgb, var(--color-orange) 20%, transparent);
            color: var(--color-orange);
        }
    }

    &.color-blue {
        background: var(--color-blue);
        color: var(--color-white);

        &.light {
            background: color-mix(in srgb, var(--color-blue) 20%, transparent);
            color: var(--color-blue);
        }
    }

    &.color-white {
        background: var(--color-white);
        color: var(--font-default);

        &.light {
            background: color-mix(in srgb, var(--color-white) 20%, transparent);
            color: var(--color-white);
        }
    }

    &.color-gray {
        background: var(--color-light);
        color: var(--color-white);

        &.light {
            background: color-mix(in srgb, var(--color-light) 20%, transparent);
            color: var(--color-light);
        }
    }
}
</style>
