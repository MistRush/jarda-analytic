import {useAppStore} from "@/App/stores/appStore.js";

export function useApp() {
  const { app } = useAppStore(window.pinia);

  return {
    app,
    router: app?.router,
    layout: app?.layout,
    settings: app?.settings,
    user: app?.user,
    title: app?.title,
  }
}