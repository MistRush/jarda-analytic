import { toValue } from '@vueuse/core'
import { useTabsStore } from '@/App/stores/tabsStore'
import { usePageInstance } from '@/App/composables/internal/usePageInstance'
import { inject, computed } from "vue";

const pageCache = new Map()

export function usePage(options = {}) {
    const rawTab = toValue(options.tab)
    const tabInstanceId = rawTab?.instanceId ?? inject('jolanda_currentTabInstanceId', null)

    if (!tabInstanceId) {
        console.warn('❗usePage called without valid tabInstanceId')
        return {}
    }

    if (pageCache.has(tabInstanceId)) {
        return pageCache.get(tabInstanceId)
    }
    const tabsStore = useTabsStore(window.pinia)
    const tab = rawTab ?? tabsStore.tabs.find(t => t.instanceId === tabInstanceId)

    if (!tab) {
        console.warn(`❗No tab found for instanceId: ${tabInstanceId}`)
        return {}
    }

    // 4. Vytvoř page a ulož do cache
    const pageInstance = usePageInstance({ tab: computed(() => tab) })
    pageCache.set(tabInstanceId, pageInstance)
    return pageInstance
}

export function clearPageCache(tabInstanceId = null) {
    if (tabInstanceId) {
        pageCache.delete(tabInstanceId)
    } else {
        pageCache.clear()
    }
}
