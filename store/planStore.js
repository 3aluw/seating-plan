import { defineStore, acceptHMRUpdate } from "pinia";


export const usePlanStore = defineStore("PlanStore", () => {

let plans = ref([
    {
  "planName": "Demo",
  "description": "Try Me",
  "number": 5,
  "seatType": "2",
  "criteriaOneTitle": "Math marks",
  "tableData": [
      {
          "name": "one",
          "fieldOne": ""
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
}, {
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
  },],{deep: true})


  //create a clone of the current table -will use it to undo changes-
let currentPlanIndex = ref(0);
const clonedTableData = ref(plans.value[currentPlanIndex.value].tableData.map(a => {return {...a}}))
watch(currentPlanIndex,()=>{
if(currentPlanIndex.value) clonedTableData.value = plans.value[currentPlanIndex.value].tableData.map(a => {return {...a}})
})


//state functions
const undoChanges = ()=>{
   plans.value[currentPlanIndex.value].tableData = clonedTableData.value.map(a => { return { ...a } })

}

const sortItems =(sortType)=>{
    let tableData =  plans.value[currentPlanIndex.value].tableData;
    const asc = sortType === "asc";

    tableData.sort(function(a, b) {   
        //check if it is a number
        const isNumeric= (n)=> {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        const itemA =  isNumeric(a.fieldOne) ? Number(a.fieldOne) : a.fieldOne
        const itemB =  isNumeric(b.fieldOne) ? Number(b.fieldOne) : b.fieldOne 
        if (itemA < itemB) {
          return asc ? -1 : 1;
        }
        else if (itemA > itemB) {
          return asc?  1: -1;
        }
        // items must be equal
        return 0;
      }); 
}


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
const deletePlan= (index)=>{plans.value.splice(index, 1)}

const shufflePlan = () => {
    let deck =  plans.value[currentPlanIndex.value].tableData;
    for (var i = deck.length - 1; i > 0; i--) {
      const swapIndex = Math.floor(Math.random() * (i + 1))
      const currentCard = deck[i]
      const cardToSwap = deck[swapIndex]
      deck[i] = cardToSwap
      deck[swapIndex] = currentCard
    }
  }
  const downloadPlan = ()=>{
    const filename = `${plans.value[currentPlanIndex.value].planName}.json`
    const data = plans.value[currentPlanIndex.value]

    const blob = new Blob([JSON.stringify(data)]);
    const link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.click()

  }
  
  const uploadPlan=(upObject)=>{
    
    if (ValidateUplaod(upObject)) {
        plans.value.push(upObject);
    currentPlanIndex.value = plans.value.length -1;
    return true
}
return false
  }
const ValidateUplaod =(upObject)=>{
      
        return Object.keys(plans.value[0]).length === Object.keys(upObject).length
        && Object.keys(plans.value[0]).every(k => upObject.hasOwnProperty(k)) && upObject.tableData.length > 6
    
}


  return {
    plans,currentPlanIndex,plansCreator,clonedTableData,undoChanges, sortItems,deletePlan, shufflePlan, downloadPlan, uploadPlan};
},
/* Enable this to persist this store : more info : https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt-3.html
{
  persist: true}
*/
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlanStore, import.meta.hot));
}
