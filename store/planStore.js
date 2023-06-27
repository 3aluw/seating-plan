import { defineStore, acceptHMRUpdate } from "pinia";


export const usePlanStore = defineStore("PlanStore", () => {

/*class plan {
  constructor(planName,description,number,students) {  
    this.planName = planName;
    this.description = description;
    this.number = number;
    this.students = students
  }
}*/



let plansNames = ref([]);
let plans = ref([],{deep: true})


const plansCreator = (planName,description,seatType,criteriaOneTitle,tableData)=>{

plansNames.value.push(planName);
plans.value.push({
  planName : planName,
  description :  description,
 number: tableData.length,
  seatType:seatType,
  criteriaOneTitle: criteriaOneTitle,
  tableData: tableData,

})
console.log(plans.value)
}
  return {
    plans,plansNames,plansCreator,
  };
},
/* Enable this to persist this store : more info : https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt-3.html
{
  persist: true}
*/
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlanStore, import.meta.hot));
}
