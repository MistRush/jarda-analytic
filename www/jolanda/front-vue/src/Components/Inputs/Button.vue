<script>
export const variants = ['primary', 'red', 'green', 'default', 'orange', 'blue', 'white', 'gray'];
export const sizes = ['small', 'base', 'large'];
</script>

<script setup>
import { computed, useSlots, ref, watch} from 'vue';
import Tooltip from "../Other/Tooltip.vue";

const props = defineProps({
    type: {
        type: String,
        default: 'button', // např. 'button', 'submit', ...
    },
    variant: {
        type: String,
        default: 'default', // např. 'default', 'alternative', 'dark', ...
        validator(value) {
          return variants.includes(value)
        }
    },
    outline: {
        type: Boolean,
        default: false,
    },
    size: {
      type: String,
      default: 'base',
      validator(value) {
        return sizes.includes(value)
      }
    },
    icon: {
        type: [String, Object],
    },
    iconColor: {
        type: String,
    },
    iconDirection: {
        type: String,
        default: 'right',
    },
    iconProps: {
        type: Object,
        default: {},
    },
    disabled: Boolean,
    hoverClass: {
        type: [String, Object],
    },
    tooltip: {
        type: String,
    },
    iconOnly: {
        type: Boolean,
        default: false,
    },
    form: {
        type: String,
        default: null,
    }
});

const slots = useSlots();

const emit = defineEmits(['click']);

const buttonClass = computed(() => {
    const variants = {
        primary: 'bg-primary hover:bg-primary/80 text-white',
        red: 'bg-error hover:bg-error/80 text-white',
        green: 'bg-green hover:bg-green/80 text-white',
        default: 'bg-dark dark:bg-nav hover:bg-dark/80 dark:hover:bg-dark-bg-800 text-white',
        orange: 'bg-warning hover:bg-warning/80 text-white',
        blue: 'bg-blue hover:bg-blue/80 text-white',
        white: 'bg-white hover:bg-icon-light-gray/80 text-dark',
        gray: 'bg-light dark:bg-medium hover:bg-light/80 dark:hover:bg-medium/80 text-white',
    }

    const outlineVariants = {
        primary: 'border border-primary text-dark dark:text-white hover:border-primary/80 hover:bg-primary/80 hover:text-white',
        red: 'border border-error text-dark dark:text-white hover:border-error/80 hover:bg-error/80 hover:text-white',
        green: 'border border-green text-dark dark:text-white hover:border-green/80 hover:bg-green/80 hover:text-white',
        default: 'border border-dark dark:border-nav text-dark dark:text-white hover:border-dark/80 dark:hover:border-nav/80 hover:bg-dark/80 hover:text-white',
        orange: 'border border-warning text-dark dark:text-white hover:border-warning/80 hover:bg-warning/80 hover:text-white',
        blue: 'border border-blue text-dark dark:text-white hover:border-blue/80 hover:bg-blue/80 hover:text-white',
        white: 'border border-outline bg-white dark:bg-light/8 dark:border-light/20 text-dark dark:text-white hover:bg-outline dark:hover:bg-light/20 dark:hover:bg-light/20',
        gray: 'border border-light dark:border-medium text-dark dark:text-white hover:border-light/80 hover:bg-light/80 dark:hover:border-medium/80 dark:hover:bg-medium/80 hover:text-white',
    }

    if(!props.outline){
        return variants[props.variant];
    }else{
        return outlineVariants[props.variant];
    }
});

const iconClass = computed(() => {
    if(!props.icon){
        return {};
    }
    const classes = {
        'w-[1.15rem] max-h-[1.15rem]': props.size === 'base' || props.size === 'large' || !(props.size === 'small' && hasSlotContent.value && !props.iconOnly),
        'w-[1rem] max-h-[1rem]': props.size === 'small' && hasSlotContent.value && !props.iconOnly,
    };

    if(hasSlotContent.value && !props.iconOnly){
        if(props.iconDirection === 'left'){
            classes['mr-[0.385rem]'] = true;
        }else if(props.iconDirection === 'right'){
            classes['ml-[0.385rem]'] = true;
        }
    }

    return classes;
});

const onClick = (e) => {
    if (!props.disabled) {
        emit('click', e);
    }
};

const hasSlotContent = ref(false);
const hoover = ref(false);

watch(
    () => slots.default && slots.default(),
    (newVal) => {
        hasSlotContent.value = newVal && newVal.length > 0;
    },
    { immediate: true, deep: true }
);
</script>

<template>
    <Tooltip v-if="props.tooltip" :text="props.tooltip">
        <button
            :class="{
            [buttonClass]: true,
            'with-icon': props.icon,
            ['icon-color-'+props.iconColor]: props.iconColor && !props.iconColor.startsWith('#'),
            'icon-left': props.iconDirection === 'left',
            'icon-right': props.iconDirection === 'right',
            'empty-slot': !hasSlotContent,
            'icon-only': (!hasSlotContent || props.iconOnly) && props.icon,
            ['size-' + props.size]: true,
            'vue-button': true,
        }"
            :disabled="disabled"
            @click="onClick"
            :type="type"
            @mouseenter="hoover = true"
            @mouseleave="hoover = false"
            :form="form"
        >
            <div class="b-content-wrapper">
                <Icon v-if="props.icon && props.iconDirection === 'left'" :icon="props.icon" :class="iconClass" v-bind="props.iconProps" :color="props.iconColor" />
                <slot></slot> <!-- umožňuje vložení vlastního obsahu do tlačítka -->
                <Icon v-if="props.icon && props.iconDirection === 'right'" :icon="props.icon" :class="iconClass" v-bind="props.iconProps" :color="props.iconColor" />
            </div>
        </button>
    </Tooltip>
    <button
        v-else
        :class="{
            [buttonClass]: true,
            'with-icon': props.icon,
            ['icon-color-'+props.iconColor]: props.iconColor && !props.iconColor.startsWith('#'),
            'icon-left': props.iconDirection === 'left',
            'icon-right': props.iconDirection === 'right',
            'empty-slot': !hasSlotContent,
            'icon-only': (!hasSlotContent || props.iconOnly) && props.icon,
            ['size-' + props.size]: true,
            'vue-button': true,
        }"
        :disabled="disabled"
        @click="onClick"
        :type="type"
        @mouseenter="hoover = true"
        @mouseleave="hoover = false"
        :form="form"
    >
        <div class="b-content-wrapper">
            <Icon v-if="props.icon && props.iconDirection === 'left'" :icon="props.icon" :class="iconClass" v-bind="props.iconProps" :color="props.iconColor" />
            <slot></slot> <!-- umožňuje vložení vlastního obsahu do tlačítka -->
            <Icon v-if="props.icon && props.iconDirection === 'right'" :icon="props.icon" :class="iconClass" v-bind="props.iconProps" :color="props.iconColor" />
        </div>
    </button>
</template>

<style scoped>
    .vue-button{
        font-size: var(--button-font-size);
        font-style: normal;
        font-weight: var(--button-font-weigh);
        line-height: var(--button-line-height);
        padding: 0.5rem 1rem;
        justify-content: center;
        align-items: center;
        border-radius: 0.462rem;
        display: flex;
        line-height: 14px;


        &.size-small{
            padding: 0.3rem 0.72rem;
        }

        &.size-large{
            padding: 0.77rem 1.6rem;
        }

        &:hover{
            cursor: pointer;
        }

        &.with-icon{
            &.icon-only{
                padding: 0.577rem;

                &.size-small{
                    padding: 0.385rem 0.46rem;
                }

                &.size-large{
                    padding: 0.75rem;
                }
            }
        }

        .b-content-wrapper{
            display: flex;
            align-items: center;
        }
    }
</style>
