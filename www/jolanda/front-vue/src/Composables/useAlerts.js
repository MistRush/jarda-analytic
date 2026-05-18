import { useAlertStore } from "@/Components/Alerts/stores/alertStore.js";

export function useAlerts(){
  const store = useAlertStore(window.pinia);

  return {
    ...store,
  }
}