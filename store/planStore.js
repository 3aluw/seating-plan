import { defineStore, acceptHMRUpdate } from "pinia";


export const usePlanStore = defineStore("PlanStore", () => {

let plans = ref([{
  "planName": "sad",
  "description": "sda",
  "number": 5,
  "seatType": "1",
  "criteriaOneTitle": "A criteria",
  "tableData": [
      {
          "name": "one",
          "fieldOne": ""
      },
      {
          "name": "two ","fieldOne": ""
      },
      {
          "name": "three","fieldOne": ""
      },
      {
          "name": "four","fieldOne": ""
      },
      {
          "name": "five","fieldOne": ""
      },
      {
          "name": "one",
          "fieldOne": ""
      },
      {
          "name": "two ","fieldOne": ""
      },
      {
          "name": "three","fieldOne": ""
      },
      {
          "name": "four","fieldOne": ""
      },
      {
          "name": "five","fieldOne": ""
      },
  ]
}],{deep: true})

let currentPlanIndex = ref(0);
const clonedTableData = computed(()=>plans.value[currentPlanIndex.value].tableData.map(a => {return {...a}})) 




const plansCreator = (planName,description,seatType,criteriaOneTitle,tableData)=>{


plans.value.push({
  planName : planName,
  description :  description,
 number: tableData.length,
  seatType:seatType,
  criteriaOneTitle: criteriaOneTitle,
  tableData: tableData,

})
}
  return {
    plans,currentPlanIndex,plansCreator,clonedTableData};
},
/* Enable this to persist this store : more info : https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt-3.html
{
  persist: true}
*/
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlanStore, import.meta.hot));
}
