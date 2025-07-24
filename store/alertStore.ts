
import { defineStore, acceptHMRUpdate } from "pinia";




export const useAlertStore = defineStore("AlertStore", () => {
  type alertsTypes = "success" | "info" | "warning" | "error" 

  interface alertObj {
    text: string,
    type: alertsTypes
  }
  const defaultAlerts: alertObj[] = [
    {
      text: "done successfully",
      type: "success",
    },
    {
      text: "please wait for a moment",  
      type: "info",
    },
    {
      text: "something went wrong",
      type: "error",
    },
    {
      text: "be cautious",
      type: "warning",
    },

  ] as const

  const alert = ref<alertObj>()


  const createAlert = (type: alertsTypes, text?: string) => {
    alert.value = text ? { text, type } : defaultAlerts.find((alertObj) => alertObj.type === type)
    setTimeout(() => { alert.value = undefined }, 5000)
  }



  return {
    alert, createAlert
  };
},
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertStore, import.meta.hot));
}