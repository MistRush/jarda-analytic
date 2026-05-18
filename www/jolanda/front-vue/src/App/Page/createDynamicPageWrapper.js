import { defineComponent, h, provide, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useTabsStore } from '@/App/stores/tabsStore'
import { useTab } from '@/App/composables/useTab'
import { usePage } from '@/App/composables/usePage'

export function createDynamicPageWrapper({ tabInstanceId, tabId, pageComponent }) {
  return markRaw(defineComponent({
    name: 'PageWrapper_' + tabInstanceId,
    setup() {
      const tabsStore = useTabsStore(window.pinia)
      const route = useRoute()

      const currentTab = tabsStore.tabs.find(tab => tab.instanceId === tabInstanceId)

      if (!currentTab) {
        console.warn('Tab nenalezen pro instanceId:', tabInstanceId)
        return () => null
      }

      provide('jolanda_currentTabId', currentTab.id)
      provide('jolanda_currentTabInstanceId', currentTab.instanceId)

      const { tab } = useTab({
        tabId: currentTab.id,
        onActivate: () => {
          const gridIds = tab.value.gridRefreshQueue || []
          const { getGrid } = usePage({ tab })

          gridIds.forEach(gridId => {
            const grid = getGrid(gridId)
            if (grid) grid.refresh()
          })

          tab.value.gridRefreshQueue = []
        }
      })

      return () => h(pageComponent)
    }
  }))
}

