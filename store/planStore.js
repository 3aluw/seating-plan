import { defineStore, acceptHMRUpdate } from "pinia";


export const usePlanStore = defineStore("PlanStore", () => {
const count = 0;
/*class plan {
  constructor(planName,description,number,students) {  
    this.planName = planName;
    this.description = description;
    this.number = number;
    this.students = students
  }
}*/

let plansNames = ref([]);
let plans = ref({})


const plansCreator = (planName,description,number,seatType,students)=>{

plansNames.value.push(planName);
plans.value[`${planName}`] = {
  description :  description,
  number: number,
  seatType:seatType,
  students:students,

}
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
