import { onMounted, onBeforeUnmount } from 'vue'
import { useTabsStore } from '@/App/stores/tabsStore'
import html2canvas from 'html2canvas-pro'

let loopTimeout = null

export function useTabScreenshotLoop() {
  const tabsStore = useTabsStore(window.pinia);

  const createScreenshot = async (tab, el) => {
    if (!tab || !el) return

    // Necháme vykreslit DOM naplno (pro jistotu)
    // await nextTick()

    // const contentEl = document.getElementById('jolanda-page-wrapper') // ⚡ ID hlavního obsahového divu
    const contentEl = el;
    if (el) {
      try {
        const screenWidth = contentEl.clientWidth
        let screenHeight = screenWidth / (16 / 9) // výška pro 16:9 poměr

        const maxHeightAvailable = contentEl.scrollHeight - window.scrollY

// Pokud by 16:9 výška byla větší než dostupné místo, ořízneme výšku
        if (screenHeight > maxHeightAvailable) {
          screenHeight = maxHeightAvailable
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
            const grids = clonedDoc.querySelectorAll('.new-data-grid')

            grids.forEach(grid => {
              const bodyWrapper = grid.querySelector('.v-vl-items')
              if (bodyWrapper) {
                bodyWrapper.style.display = 'none';
              }

              const dataGridBody = grid.querySelector('.v-vl--show-scrollbar');
              if(dataGridBody) {
                dataGridBody.style.backgroundColor = 'lightgray'
              }
            })
          }
        })

        tab.previewImg = canvas.toDataURL('image/webp')
      } catch (err) {
        console.error('Chyba při snímání obrazovky tab:', err)
      }
    }
  }

  const loop = () => {
    loopTimeout = window.setInterval(() => {
      requestIdleCallback(async () => {
        const tab = tabsStore.tabs.find(t => t.id === tabsStore.activeTabId)
        if (!tab) return

        // Nemusíš, ale můžeš přidat kontrolu stáří/snapshottu:
        // if (tab.lastScreenshot && Date.now() - tab.lastScreenshot < 10000) return

        // const el = document.documentElement;
        const el = document.getElementById('jolanda-page-wrapper');
        if (el) {
          // await createScreenshot(tab, el)
          createScreenshot(tab, el);
          // tab.lastScreenshot = Date.now()
        }

        // loop() // spustí další kolo
      })
    }, 5000) // každých 5 sekund
  }

  onMounted(() => {
    loop()
  })

  onBeforeUnmount(() => {
    if (loopTimeout) clearTimeout(loopTimeout)
  })
}
