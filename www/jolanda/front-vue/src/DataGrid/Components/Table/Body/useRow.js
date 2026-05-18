import { computed, h, reactive, ref, watch } from "vue";

// export function createRow({ row, key, cells}) {
export function createRow({ row, key, cells, old }) {
    const props = reactive({
        row,
        key,
        cells,
    });

    // const setProps = ({ row, key, cells}) => {
    //     props.row = row;
    //     props.key = key;
    //     props.cells = cells;
    // }

    const isLoaded = computed(() => props.row.isLoaded);
    // const rowData = computed(() => props.row.data());
    const isSelected = computed(() => props.row.isSelected());

    const defaultStyle = {
        height: props.row.dataGrid.settings.row.height + "px",
        maxHeight: props.row.dataGrid.settings.row.height + "px",
        minHeight: props.row.dataGrid.settings.row.height + "px",
    };

    const dynamicStyle = ref({ ...defaultStyle });

    const renderedProps = computed(() => {
        return {
            key: String(props.key),
            style: dynamicStyle.value,
            class: {
                odd: props.row.position % 2 === 0,
                even: props.row.position % 2 === 1,
                selected: isSelected.value,
                dataGridRow: true,
                [props.key]: true,
            },
            onClick: (event) => onClick(event),
            onDblclick: (event) => onDblclick(event),
            onContextmenu: (event) => onRightClick(event),
            onMousedown: (event) => {
                if (event.shiftKey) document.body.style.userSelect = "none";
            },
            onMouseup: (event) => {
                document.body.style.userSelect = "";
            },
            ref: "rowRef",
        };
    });

    const resetStyle = () => {
        // for (const key in dynamicStyle) {
        //     delete dynamicStyle[key];
        // }
        //
        // // Znovu přidá pouze defaultní styly
        // Object.assign(dynamicStyle, defaultStyle);

        dynamicStyle.value = { ...defaultStyle };
    };

    const onClick = (event) => {
        if (!isLoaded.value) {
            return;
        }

        try {
            if (props.row.dataGrid.settings.row.onBeforeClick?.(event, props.row) === false) {
                return;
            }
        } catch (e) {
            throw e;
        } finally {
            props.row.toggleSelect(event);
            props.row.dataGrid.settings.row.onClick?.(event, props.row);
        }
    };

    const onDblclick = (event) => {
        if (!isLoaded.value) {
            return;
        }

        try {
            if (props.row.dataGrid.settings.row.onBeforeDblclick?.(event, props.row) === false) {
                return;
            }
        } catch (e) {
            throw e;
        } finally {
            props.row.dataGrid.settings.row.onDblclick?.(event, props.row);
        }
    };

    const onRightClick = (event) => {
        event.preventDefault();

        props.row.select(true, event);

        if (props.row.dataGrid.contextMenu) {
            props.row.dataGrid.contextMenu.position = {
                x: event.pageX,
                y: event.pageY,
            };

            props.row.dataGrid.contextMenu.show(props.row.dataGrid.contextMenu.hasVisibleItems);
        }
    };

    // const rowComponent = markRaw(
    //     defineComponent({
    //         setup() {
    //             const rowRef = ref(null);
    //
    //             const executeRowCallback = async () => {
    //                 const { rowCallback } = props.row.dataGrid.settings.row;
    //                 if (typeof rowCallback === "function" && isLoaded.value) {
    //                     try {
    //                         rowCallback(rowRef.value, props.row.data(), { style });
    //                     } catch (e) {
    //                         console.error(e);
    //                     }
    //                 }
    //             };
    //
    //             console.log(props.row.dataGrid.settings.row?.rowCallback);
    //
    //             // watch([props.row.dataGrid.settings.row?.rowCallback], (newVal) => {
    //             //     debugger;
    //             //     if (newVal && typeof newVal === "function") {
    //             //         watch([rowRef, isLoaded, rowData], executeRowCallback, { deep: true });
    //             //     }
    //             // });
    //
    //             watch([rowRef, isLoaded, props.row.data()], async () => executeRowCallback(), { deep: true, immediate: true });
    //
    //             return { rowRef };
    //         },
    //         render() {
    //             return h("div", renderedProps.value, props.cells);
    //         },
    //     }),
    // );

    if (props.row.dataGrid.settings.row && !old) {
        const executeRowCallback = async () => {
            resetStyle();

            const { rowCallback } = props.row.dataGrid.settings.row;
            if (typeof rowCallback === "function" && isLoaded.value) {
                const tmpStyle = dynamicStyle.value;
                rowCallback(null, props.row.data(), { style: tmpStyle, class: {} });
                dynamicStyle.value = tmpStyle;
            }
        };

        watch(
            () => [isLoaded.value, props.row.data(), props.key],
            () => {
                executeRowCallback();
            },
            { deep: true, immediate: true },
        );
    }

    const a = computed(() => {
        // return h('div', { ...renderedProps }, props.cells);
        return h("div", renderedProps.value, props.cells);
    });

    const rowComponent = () => {
        return a.value;
        // return h("div", renderedProps.value, props.cells);
    };

    return {
        props,
        rowComponent,
        renderedProps,
    };
}
