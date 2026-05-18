<template>
    <HPopover ref="popover" v-slot="{ open, close }" :class="['relative inline-flex']" v-bind="attrs" @mouseleave="onMouseLeave">
        <HPopoverButton ref="trigger" as="div" :disabled="disabled" class="inline-flex w-full" role="button" @mouseenter="onMouseEnter" @touchstart.passive="onTouchStart">
            <slot :open="open" :close="close">
                <button :disabled="disabled">Open</button>
            </slot>
        </HPopoverButton>

        <Transition v-if="overlay" appear v-bind="overlayClass.transition">
            <div v-if="open" :class="[overlayClass.base, overlayClass.background]" />
        </Transition>

        <div v-if="open" ref="container" :style="containerStyle" @mouseenter="onMouseEnter" class="z-50 group">
            <Transition appear v-bind="transition">
                <div>
                    <div v-if="popper.arrow" data-popper-arrow class="popper-arrow" :class="Object.values(arrow)" />

                    <HPopoverPanel static class="popover-panel overflow-hidden focus:outline-none relative bg-white dark:bg-nav ring-1 ring-outline dark:ring-medium rounded-md shadow-lg">
                        <slot name="panel" :open="open" :close="close" />
                    </HPopoverPanel>
                </div>
            </Transition>
        </div>
    </HPopover>
</template>

<script>
import { computed, ref, onMounted, defineComponent, watch, useId } from "vue";
import { usePopper } from "@/Composables/usePopper";
import { Popover as HPopover, PopoverButton as HPopoverButton, PopoverPanel as HPopoverPanel, provideUseId } from "@headlessui/vue";

export default defineComponent({
    components: {
        HPopover,
        HPopoverButton,
        HPopoverPanel,
    },
    inheritAttrs: false,
    props: {
        mode: {
            type: String,
            default: "click",
            validator: (value) => ["click", "hover"].includes(value),
        },
        open: {
            type: Boolean,
            default: undefined,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        openDelay: {
            type: Number,
            default: 250,
        },
        closeDelay: {
            type: Number,
            default: 250,
        },
        overlay: {
            type: Boolean,
            default: false,
        },
        popper: {
            type: Object,
            default: () => ({}),
        },
        class: {
            type: [String, Object, Array],
            default: () => "",
        },
        ui: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ["update:open"],
    setup(props, { emit }) {
        const arrow = {
            base: "invisible before:visible before:block before:rotate-45 before:z-[-1] before:w-4 before:h-4",
            ring: "before:ring-1 before:ring-outline dark:before:ring-medium",
            // rounded: 'before:rounded-sm',
            background: "before:bg-outline dark:before:bg-medium",
            shadow: "before:shadow",
            placement: props.mode === "hover" ? `group-data-[popper-placement*='right']:-left-2 group-data-[popper-placement*='left']:-right-2 group-data-[popper-placement*='top']:-bottom-2 group-data-[popper-placement*='bottom']:-top-2` : `group-data-[popper-placement*='right']:-left-2 group-data-[popper-placement*='left']:-right-2 group-data-[popper-placement*='top']:-bottom-2 group-data-[popper-placement*='bottom']:-top-2`,
        };

        const transition = {
            enterActiveClass: "transition ease-out duration-200",
            enterFromClass: "opacity-0 translate-y-1",
            enterToClass: "opacity-100 translate-y-0",
            leaveActiveClass: "transition ease-in duration-150",
            leaveFromClass: "opacity-100 translate-y-0",
            leaveToClass: "opacity-0 translate-y-1",
        };

        const overlayClass = {
            base: "fixed inset-0 transition-opacity z-50",
            background: "bg-gray-200/75 dark:bg-gray-800/75",
            transition: {
                enterActiveClass: "ease-out duration-200",
                enterFromClass: "opacity-0",
                enterToClass: "opacity-100",
                leaveActiveClass: "ease-in duration-150",
                leaveFromClass: "opacity-100",
                leaveToClass: "opacity-0",
            },
        };

        const attrs = {
            class: props.class,
        };

        const popper = computed(() => {
            return {
                ...(props.mode === "hover" ? { offsetDistance: 0 } : {}),
                ...(props.popper ?? {}),
                strategy: "fixed",
                arrow: true,
            };
        });

        const [trigger, container] = usePopper(popper.value);

        const popover = ref(null);
        const popoverApi = ref(null);

        let openTimeout = null;
        let closeTimeout = null;

        onMounted(() => {
            const popoverProvides = popover.value?.$.provides;
            if (!popoverProvides) {
                return;
            }
            const popoverProvidesSymbols = Object.getOwnPropertySymbols(popoverProvides);
            popoverApi.value = popoverProvidesSymbols.length && popoverProvides[popoverProvidesSymbols[0]];

            if (props.open) {
                popoverApi.value?.togglePopover();
            }
        });

        const containerStyle = computed(() => {
            if (props.mode !== "hover") {
                return {};
            }

            const offsetDistance = 0;
            const placement = popper.value.placement?.split("-")[0];
            const padding = `${offsetDistance}px`;

            if (placement === "top" || placement === "bottom") {
                return {
                    paddingTop: padding,
                    paddingBottom: padding,
                };
            } else if (placement === "left" || placement === "right") {
                return {
                    paddingLeft: padding,
                    paddingRight: padding,
                };
            } else {
                return {
                    paddingTop: padding,
                    paddingBottom: padding,
                    paddingLeft: padding,
                    paddingRight: padding,
                };
            }
        });

        function onTouchStart(event) {
            if (!event.cancelable || !popoverApi.value || props.mode === "click") {
                return;
            }

            if (popoverApi.value.popoverState === 0) {
                popoverApi.value.closePopover();
            } else {
                popoverApi.value.togglePopover();
            }
        }

        function onMouseEnter() {
            if (props.mode !== "hover" || !popoverApi.value) {
                return;
            }

            // cancel programmed closing
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            // dropdown already open
            if (popoverApi.value.popoverState === 0) {
                return;
            }
            openTimeout =
                openTimeout ||
                setTimeout(() => {
                    if (popoverApi.value.togglePopover) {
                        popoverApi.value.togglePopover();
                    }
                    openTimeout = null;
                }, props.openDelay);
        }

        function onMouseLeave() {
            if (props.mode !== "hover" || !popoverApi.value) {
                return;
            }

            // cancel programmed opening
            if (openTimeout) {
                clearTimeout(openTimeout);
                openTimeout = null;
            }
            // dropdown already closed
            if (popoverApi.value.popoverState === 1) {
                return;
            }
            closeTimeout =
                closeTimeout ||
                setTimeout(() => {
                    if (popoverApi.value.closePopover) {
                        popoverApi.value.closePopover();
                    }
                    closeTimeout = null;
                }, props.closeDelay);
        }

        watch(
            () => props.open,
            (newValue, oldValue) => {
                if (!popoverApi.value) return;
                if (oldValue === undefined || newValue === oldValue) return;

                if (newValue) {
                    // No `openPopover` method and `popoverApi.value.togglePopover` won't work because of the `watch` below
                    popoverApi.value.popoverState = 0;
                } else {
                    popoverApi.value.closePopover();
                }
            },
        );

        watch(
            () => popoverApi.value?.popoverState,
            (newValue, oldValue) => {
                if (oldValue === undefined || newValue === oldValue) return;

                emit("update:open", newValue === 0);
            },
        );

        provideUseId(() => useId());
        return {
            // eslint-disable-next-line vue/no-dupe-keys
            attrs,
            popover,
            // eslint-disable-next-line vue/no-dupe-keys
            popper,
            trigger,
            container,
            containerStyle,
            onTouchStart,
            onMouseEnter,
            onMouseLeave,
            arrow,
            transition,
            overlayClass,
        };
    },
});
</script>
