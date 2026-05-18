import { h, computed, ref, reactive } from "vue";
import InlineEditor from "./InlineEditor/InlineEditor.vue";
import { useAlerts } from "@/Composables/useAlerts.js";
import { useTranslations } from "@/Composables/useTranslation.js";

export function createCell({ cell, left, overflowPreview }) {
    const props = reactive({
        left: left,
        cell: cell,
    });

    const isLoaded = computed(() => {
        return props.cell.isLoaded;
    });
    const isEditing = ref(false);

    const content = computed(() => {
        return isEditing.value
            ? h(InlineEditor, {
                  cell: props.cell,
                  type: props.cell.column.format ? props.cell.column.format.editor : "text",
                  onConfirm: (value) => {
                      setTimeout(() => {
                          isEditing.value = false;
                      });
                  },
                  onCancel: () => {
                      setTimeout(() => {
                          isEditing.value = false;
                      });
                  },
              })
            : isLoaded.value
              ? props.cell.render()
              : '<div class="dataGridPlaceholder"></div>';
    });

    const cellRef = ref(null);
    const isOverflowingX = ref(false);
    const isOverflowingY = ref(false);
    const isCopied = ref(false);

    const currentWidth = computed(() => {
        return `${props.cell.column.currentWidth}px`;
    });

    const renderedProps = computed(() => {
        return {
            key: `${props.cell.column.id}`,
            style: {
                left: `${props.left}px`,
                width: currentWidth.value,
                minWidth: currentWidth.value,
                maxWidth: currentWidth.value,
            },
            class: {
                dataGridCell: true,
                dataGridPlaceholderWrapper: !isLoaded.value,
                [props.cell.column.className]: true,
                isCopied: isCopied.value,
            },
            innerHTML: typeof content.value === "string" ? content.value : null,
            onMouseenter: (event) => {
                onMouseenter(event);
            },
            onMouseleave: (event) => {
                onMouseleave(event);
            },
            onClick: (event) => onClick(event),
            ref: cellRef,
        };
    });

    const onClick = (event) => {
        if (!isLoaded.value || isEditing.value) {
            return;
        }

        if (event.altKey && event.button === 0) {
            const onAfterClipboardCopy = (text) => {
                const { info } = useAlerts();
                const { translations } = useTranslations();

                info(translations.COPY_TO_CLIPBOARD, text);

                isCopied.value = true;

                setTimeout(() => {
                    isCopied.value = false;
                }, 650);
            };

            const text = event.target.innerText;
            if (!navigator.clipboard) {
                const textArea = document.createElement("textarea");
                textArea.value = text;

                // Avoid scrolling to bottom
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    const successful = document.execCommand("copy");

                    if (successful) {
                        onAfterClipboardCopy(text);
                    }
                } catch (err) {
                    console.warn("Fallback: Oops, unable to copy", err);
                }

                document.body.removeChild(textArea);
                return;
            } else {
                navigator.clipboard.writeText(text).then(
                    function () {
                        onAfterClipboardCopy(text);
                    },
                    function (err) {
                        console.warn("Async: Could not copy text: ", err);
                    },
                );
            }
        }

        if (props.cell.column.className && props.cell.column.className.includes("select-checkbox")) {
            event._ctrlKey = true;
        }

        if (props.cell.column.editable && event.target.classList.contains("dataGridCell-editIcon")) {
            isEditing.value = true;
        }

        onMouseleave();
    };

    const onMouseleave = (event) => {
        if (!isLoaded.value) {
            return;
        }

        if (overflowPreview.isOverflowingTimeout) {
            clearTimeout(overflowPreview.isOverflowingTimeout);
            overflowPreview.isOverflowingTimeout = false;

            overflowPreview.value.hide();
        }
    };

    const onMouseenter = (event) => {
        if (!isLoaded.value || isEditing.value) {
            return;
        }

        if (cell.column.overflowPreview) {
            checkOverflow();
        }

        if (isOverflowingX.value || isOverflowingY.value) {
            overflowPreview.isOverflowingTimeout = setTimeout(() => {
                const { x, y } = event.target.getBoundingClientRect();
                const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
                const scrollTop = window.scrollY || document.documentElement.scrollTop;

                overflowPreview.value.show(content.value, {
                    x: x + scrollLeft + event.target.clientWidth / 2,
                    y: y + scrollTop + event.target.clientHeight / 2,
                });
            }, 400);
        }
    };

    const checkOverflow = () => {
        if (!isLoaded.value) {
            return;
        }

        if (cellRef.value) {
            const element = cellRef.value.querySelector(".dataGridCell-dataWrapper");
            const contentHeight = element.scrollHeight;
            const containerHeight = element.clientHeight;
            const contentWidth = element.scrollWidth;
            const containerWidth = element.clientWidth;

            isOverflowingX.value = contentWidth > containerWidth;
            isOverflowingY.value = contentHeight > containerHeight;
        }
    };

    const renderedCell = computed(() => {
        // if (typeof content.value === 'string') {
        //     return h('div', { ...renderedProps.value, ref: cellRef });
        // } else {
        //     return h('div', { ...renderedProps.value, ref: cellRef }, content.value);
        // }
        if (typeof content.value === "string") {
            return h("div", renderedProps.value);
        } else {
            return h("div", renderedProps.value, content.value);
        }
    });

    const cellComponent = () => {
        return renderedCell.value;
    };

    return {
        cellComponent,
        props,
        isOverflowingX,
        isOverflowingY,
    };
}
