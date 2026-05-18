<script setup>
import { ref, useId, provide, onUnmounted, onMounted, computed, watchEffect, watch } from "vue";
import { useAjax } from "@/Composables/useAjax.js";
import Loader from "@/Components/Other/Loading/Loader.vue";
import { useTranslations } from "@/Composables/useTranslation.js";
import { useTab } from "@/App/composables/useTab.js";
import { useEventListener, useMouse, useMousePressed, useResizeObserver } from "@vueuse/core";
import { useDraggable, useWindowSize } from "@vueuse/core";
import { useApp } from "@/App/composables/useApp.js";

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: true,
    },
    size: {
        type: String,
        default: "medium",
        validator: (value) => ["extraSmall", "small", "medium", "large", "fullscreen", "exact"].includes(value),
    },
    sizeExact: {
        type: Number,
    },
    position: {
        type: String,
        default: "center",
        validator: (value) => ["right", "center"].includes(value),
    },
    blockPage: {
        type: Boolean,
        default: true,
    },
    fullHeight: {
        type: Boolean,
        default: false,
    },
    zIndex: {
        type: Number,
        default: 1000,
    },
    useVShow: {
        type: Boolean,
        default: false,
    },
    dataURL: {
        type: String,
        default: "",
    },
    closeButton: {
        type: Boolean,
        default: false,
    },
});

//instanceId
const { tab, tabStore, pushModal, removeModal, isModalOnTop } = useTab();
const isInActiveTab = computed(() => {
    if (!tab.value) {
        return true;
    }

    return tabStore.activeTabId === tab.value.id;
});

const emit = defineEmits(["update:isVisible", "close"]);
const ajax = useAjax();
const { layout } = useApp();
const { translations } = useTranslations();

const id = useId();
const footerComponent = ref(null);
const headerComponent = ref(null);
const fetchedData = ref({
    data: null,
    isLoaded: false,
});

const fetchData = async () => {
    if (!props.dataURL) {
        return;
    }

    ajax.get(props.dataURL)
        .then(({ data }) => {
            fetchedData.value.data = data;
            fetchedData.value.isLoaded = true;
        })
        .catch(({ error }) => {
            console.error(error.message);
        });
};

useEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!props.isVisible) return;
    if (!isInActiveTab.value) return;

    if (!isModalOnTop(id)) return;

    closeModal();
});

//draggable
const modalWrapperRef = ref(null);
const modalHandleRef = ref(null); // ← nový ref
const wasDragged = ref(false);

const { x, y, style, isDragging } = useDraggable(modalWrapperRef, {
    handle: modalHandleRef,
    initialValue: { x: 0, y: 0 },
});

watch(isDragging, (newVal) => {
    if (!wasDragged.value && newVal) {
        wasDragged.value = true;
    }
});

useResizeObserver(modalWrapperRef, () => {
    if (!wasDragged.value) {
        const el = modalWrapperRef.value;
        if (el) {
            centerModal();
        }
    }
});

//resizable
const { width: screenWidth, height: screenHeight } = useWindowSize();
const widths = computed(() => {
    return {
        extraSmall: 468 > screenWidth.value ? screenWidth.value : 468,
        small: 624 > screenWidth.value ? screenWidth.value : 624,
        medium: 864 > screenWidth.value ? screenWidth.value : 864,
        large: 1500 > screenWidth.value ? screenWidth.value : 1500,
        fullscreen: screenWidth.value,
        exact: props.sizeExact > screenWidth.value ? screenWidth.value : props.sizeExact,
    };
});

const rightResizerRef = ref(null);
const bottomResizerRef = ref(null);
const cornerResizerRef = ref(null);

const { x: mouseX, y: mouseY } = useMouse();

const width = ref(widths.value[props.size] ?? null);
const height = ref(null);

const rightPressed = useMousePressed({ target: rightResizerRef });
const bottomPressed = useMousePressed({ target: bottomResizerRef });
const cornerPressed = useMousePressed({ target: cornerResizerRef });

const isResizing = ref("none");

watchEffect(() => {
    if (rightPressed.pressed.value) isResizing.value = "x";
    else if (bottomPressed.pressed.value) isResizing.value = "y";
    else if (cornerPressed.pressed.value) isResizing.value = "both";
    else if (isResizing.value !== "none") isResizing.value = "none";

    if (modalWrapperRef.value) {
        const rect = modalWrapperRef.value.getBoundingClientRect();

        if (isResizing.value === "x" || isResizing.value === "both") {
            width.value = mouseX.value - rect.left + 16;
        }

        if (isResizing.value === "y" || isResizing.value === "both") {
            height.value = mouseY.value - rect.top + 16;
        }
    }
});

watch(
    () => ({
        screenHeight: screenHeight.value,
        screenWidth: screenWidth.value,
    }),
    (newVal) => {
        if (layout?.state?.isMobile) {
            if (height.value > newVal.screenHeight - 61) {
                height.value = newVal.screenHeight - 61;
            }
        } else {
            if (height.value > newVal.screenHeight) {
                height.value = newVal.screenHeight;
            }
        }

        if (width.value > newVal.screenWidth) {
            width.value = newVal.screenWidth;
        }
    },
    { immediate: true },
);

onMounted(async () => {
    await fetchData();

    centerModal();
});

const centerModal = () => {
    if (modalWrapperRef.value) {
        const elWidth = modalWrapperRef.value.offsetWidth;
        const elHeight = modalWrapperRef.value.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (props.position === "right") {
            x.value = viewportWidth - elWidth;
            y.value = (viewportHeight - elHeight) / 2;
        } else {
            x.value = (viewportWidth - elWidth) / 2;
            y.value = (viewportHeight - elHeight) / 2;
        }
    }
};

onUnmounted(() => {
    removeModal(id);
    if (props.isVisible) {
        closeModal();
    }
});

provide("modal", {
    id: id,
    setFooter(component) {
        footerComponent.value = component;
    },
    clearFooter() {
        footerComponent.value = null;
    },
    setHeader(component) {
        headerComponent.value = component;
    },
    clearHeader() {
        headerComponent.value = null;
    },
    centerModal,
});

defineExpose({
    id: id,
    centerModal,
});

const closeModal = () => {
    removeModal(id);
    emit("update:isVisible", false);
    emit("close");
};

watch(
    () => props.isVisible,
    (newVal) => {
        if (newVal) pushModal(id);
        else removeModal(id);
    },
    { immediate: true }
);
</script>

<template>
    <Teleport to="#vue_teleport">
        <div class="tailwind">
            <div v-if="useVShow || isVisible" v-show="isVisible && isInActiveTab" :id="id" tabindex="-1" aria-hidden="true" class="modal" :class="[{ 'no-block': !blockPage, 'full-height': fullHeight, mobile: layout?.state?.isMobile }]">
                <div v-if="isVisible && isInActiveTab" ref="modalWrapperRef" class="modal-wrapper" :style="[style, { width: width + 'px', height: height === null ? (props.fullHeight ? '100%' : 'auto') : height + 'px', position: 'fixed' }]">
                    <div class="content-wrapper bg-white dark:bg-dark dark:border dark:border-light/20">
                        <!-- Modal header -->
                        <div class="header" ref="modalHandleRef">
                            <h3>
                                <component v-if="headerComponent" :is="headerComponent" />
                                <slot v-else name="header"></slot>
                            </h3>
                            <div class="close-icon-holder">
                                <Icon class="icon" icon="close" @click="closeModal" color="gray" :width="15" :height="15" />
                            </div>
                        </div>
                        <!-- Modal body -->
                        <div class="body grow">
                            <div class="content">
                                <template v-if="!props.dataURL">
                                    <slot name="body">
                                        <!--                                        <p class="default-content">Default body content.</p>-->
                                    </slot>
                                </template>
                                <template v-else>
                                    <slot name="body" :data="fetchedData.data" v-if="fetchedData.isLoaded">
                                        <!--                                        <p class="default-content">Default body content.</p>-->
                                    </slot>
                                    <Loader v-else size="8px" />
                                </template>
                            </div>
                        </div>
                        <!-- Modal footer -->
                        <div class="footer flex-row-reverse border-t border-outline dark:border-light/20 gap-2" v-if="footerComponent || $slots.footer || props.closeButton">
                            <component v-if="footerComponent" :is="footerComponent" />
                            <slot v-else name="footer">
                                <!--                                <button @click="closeModal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Default action</button>-->
                            </slot>
                            <Button v-if="props.closeButton" variant="red" @click="closeModal">{{ translations.CLOSE }}</Button>
                        </div>

                        <!-- Resizery -->
                        <div ref="rightResizerRef" class="resizer right" />
                        <div ref="bottomResizerRef" class="resizer bottom" />
                        <div ref="cornerResizerRef" class="resizer corner" />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal {
    overflow-y: auto;
    overflow-x: hidden;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: v-bind("zIndex");
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    max-height: 100%;
    background-color: rgba(31, 41, 55, 0.7); /* bg-gray-900/50 */

    &.no-block {
        background-color: transparent;
        margin-top: auto;
        margin-bottom: auto;
        width: 0px;
        height: 0px;

        &:not(.full-height) {
            height: fit-content;
        }

        &.size-extraSmall {
            max-width: 36rem;
        }

        &.size-small {
            max-width: 48rem;
        }

        &.size-medium {
            max-width: 72rem;
        }

        &.size-large {
            max-width: 1500px;
        }

        &.size-fullscreen {
            max-width: 100%;
        }

        &.size-exact {
            max-width: v-bind("props.sizeExact");
        }

        &.position-right {
            margin-left: auto;
        }

        &.position-center {
            margin-left: auto;
            margin-right: auto;
        }

        .modal-wrapper {
            .content-wrapper {
                box-shadow: 0 0 4px 4px rgba(9, 19, 37, 0.1);
            }
        }
    }

    &:not(.no-block) {
        &.position-right {
            .modal-wrapper {
                margin-left: auto;
            }
        }

        &.position-center {
            .modal-wrapper {
                margin-left: auto;
                margin-right: auto;
            }
        }
    }

    &.mobile {
        .modal-wrapper {
            .content-wrapper {
                max-height: calc(96dvh - 122px);
            }
        }
    }
}

.modal-wrapper {
    position: relative;
    padding: 16px;
    width: 100%;
    max-height: 100dvh;
    z-index: 100;
    overflow: hidden;
    height: auto;

    .content-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        border-radius: 10px;
        max-height: 96dvh;
        margin: auto 0;
        box-shadow: 0px 0px 44px 0px rgba(14, 11, 48, 0.14);

        .header {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 20px 6px 20px;

            h3 {
                font-size: 16px;
                font-weight: 600;
                margin: 0;
                width: calc(100% - 20px);
            }

            .close-icon-holder {
                position: absolute;
                top: 14px;
                right: 18px;
                width: 20px;
                height: 20px;

                .icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translateY(-50%) translateX(-50%);

                    &:hover {
                        cursor: pointer;
                        filter: drop-shadow(0px 1px 1px rgb(0 0 0 / 0.36));
                        opacity: 0.8;
                    }
                }
            }
        }

        .body {
            overflow: auto;

            .content {
                padding: 10px 25px 12px 25px;
            }

            .default-content {
                font-size: 16px;
                line-height: 1.625;
                color: #6b7280;
            }
        }

        .footer {
            display: flex;
            align-items: center;
            padding: 14px 20px 12px 20px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }
}

html.prefer-dark {
    .modal-wrapper {
        .content-wrapper {
            background: #333;
            box-shadow: none;
        }
    }
}

.resizer {
    position: absolute;
    z-index: 10;
    background: transparent;
}

.resizer.right {
    width: 8px;
    height: 100%;
    right: -8px;
    top: 0;
    cursor: ew-resize;
}

.resizer.bottom {
    width: 100%;
    height: 8px;
    bottom: -8px;
    left: 0;
    cursor: ns-resize;
}

.resizer.corner {
    width: 16px;
    height: 16px;
    right: -12px;
    bottom: -12px;
    cursor: nwse-resize;
}

/* Media query for md:inset-0 */
@media (min-width: 768px) {
    .modal {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
}
</style>
