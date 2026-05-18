const tabEventHandlers = new Map()

export function emitTabEvent(tabId, event) {
  const handlers = tabEventHandlers.get(tabId)?.[event]
  if (handlers) {
    handlers.forEach(fn => fn())
  }
}

export function onTabEvent(tabId, event, handler) {
  if (!tabEventHandlers.has(tabId)) {
    tabEventHandlers.set(tabId, {})
  }

  const map = tabEventHandlers.get(tabId)
  if (!map[event]) {
    map[event] = new Set()
  }

  map[event].add(handler)

  // vrací funkci na odregistrování
  return () => {
    map[event]?.delete(handler)
  }
}
