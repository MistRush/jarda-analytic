import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import html2canvas from "html2canvas-pro";
import { emitTabEvent } from "@/App/events/tabEvents";
import { clearPageCache } from "@/App/composables/usePage";

let screenshotTimeout = null;
export const useTabsStore = defineStore("jolanda_tabs", () => {
    const tabs = ref([]);
    const activeTabId = ref(null);
    let instanceCounter = 0;

    const router = useRouter();

    const openTab = (tab) => {
        const alreadyOpen = tabs.value.find((t) => t.id === tab.id);

        if (!alreadyOpen) {
            const sourceTab = tabs.value.find((t) => t.id === activeTabId.value);

            tabs.value.push({
                fromGridId: null,
                gridParentId: null,
                gridParentCol: null,
                description: null,
                ...tab,
                previewImg: null,
                instanceId: "tab-" + ++instanceCounter,
                sourceTabInstanceId: sourceTab?.instanceId ?? null,
                gridRefreshQueue: [],
                modalStack: [],
            });
        }

        setActiveTab(tab.id);
    };

    const closeTab = (tabId) => {
        if (tabs.value.length <= 1) {
            return;
        }

        const index = tabs.value.findIndex((t) => t.id === tabId);
        const closeTabInstanceId = tabs.value.find((t) => t.id === tabId)?.instanceId;

        if (index !== -1) {
            const isActive = activeTabId.value === tabId;
            tabs.value.splice(index, 1);

            emitTabEvent(tabId, "close");

            if (isActive) {
                if (tabs.value.length > 0) {
                    const nextTab = tabs.value[Math.min(index, tabs.value.length - 1)];

                    setActiveTab(nextTab.id);
                    router.push(nextTab.route);
                } else {
                    activeTabId.value = null;
                }
            }

            if (closeTabInstanceId) {
                setTimeout(async () => {
                    clearPageCache(closeTabInstanceId);
                }, 200);
            }
        }
    };

    const setActiveTab = async (newTabId) => {
        // clearTimeout(screenshotTimeout);
        //
        // screenshotTimeout = setTimeout(async () => {
        //   requestIdleCallback(async () => {
        //     const tab = tabs.value.find(t => t.id === activeTabId.value)
        //     const el = document.getElementById('jolanda-page-wrapper');
        //
        //     createScreenshotForTab(tab, el);
        //   });
        // }, 2000);

        if (activeTabId.value !== newTabId) {
            const previous = activeTabId.value;
            activeTabId.value = newTabId;

            if (previous) {
                emitTabEvent(previous, "deactivate");
            }
            if (newTabId) {
                emitTabEvent(newTabId, "activate");
            }

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    const createScreenshotForTab = async (tab, el) => {
        if (!tab || !el) return;

        // Necháme vykreslit DOM naplno (pro jistotu)
        // await nextTick()

        // const contentEl = document.getElementById('jolanda-page-wrapper') // ⚡ ID hlavního obsahového divu
        const contentEl = el;
        if (el) {
            try {
                const screenWidth = contentEl.clientWidth;
                let screenHeight = screenWidth / (16 / 9); // výška pro 16:9 poměr

                const maxHeightAvailable = contentEl.scrollHeight - window.scrollY;

                // Pokud by 16:9 výška byla větší než dostupné místo, ořízneme výšku
                if (screenHeight > maxHeightAvailable) {
                    screenHeight = maxHeightAvailable;
                }

                // const screenWidth = window.innerWidth
                // let screenHeight = window.innerHeight // výška pro 16:9 poměr

                const canvas = await html2canvas(contentEl, {
                    backgroundColor: null,
                    scale: 0.35,
                    width: screenWidth,
                    height: screenHeight,
                    x: window.scrollX,
                    y: window.scrollY,
                    onclone: (clonedDoc) => {
                        const grids = clonedDoc.querySelectorAll(".new-data-grid");

                        grids.forEach((grid) => {
                            const bodyWrapper = grid.querySelector(".v-vl-items");
                            if (bodyWrapper) {
                                bodyWrapper.style.display = "none";
                            }

                            const dataGridBody = grid.querySelector(".v-vl--show-scrollbar");
                            if (dataGridBody) {
                                dataGridBody.style.backgroundColor = "lightgray";
                            }
                        });
                    },
                });

                tab.previewImg = canvas.toDataURL("image/webp");
            } catch (err) {
                console.error("Chyba při snímání obrazovky tab:", err);
            }
        }
    };

    const closeAllExceptActiveTab = () => {
        const activeId = activeTabId.value;

        // Získáme instanceId všech tabů, které chceme zavřít
        const tabsToClose = tabs.value.filter((tab) => tab.id !== activeId);

        for (const tab of tabsToClose) {
            emitTabEvent(tab.id, "close");
            if (tab.instanceId) {
                clearPageCache(tab.instanceId);
            }
        }

        // Necháme v poli jen aktivní tab
        tabs.value = tabs.value.filter((tab) => tab.id === activeId);
    };

    return {
        openTab,
        closeTab,
        setActiveTab,
        closeAllExceptActiveTab,

        tabs,
        activeTabId,
    };
});
