import { defineStore, acceptHMRUpdate } from "pinia";
import { useCloned } from '@vueuse/core'

export const usePlanStore = defineStore("PlanStore", () => {

    const viewMode = ref(false)
    const seatTypes = ["pairs", "rows"]
    
    let plans = ref([
        {
            "planName": "Demo",
            "description": "Try Me",
            "seatType": "pairs",
            "numberOfRows": 3,
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
                    "name": "two ", "fieldOne": ""
                },
                {
                    "name": "three", "fieldOne": ""
                },
                {
                    "name": "four", "fieldOne": ""
                },
                {
                    "name": "five", "fieldOne": ""
                },
                {
                    "name": "one",
                    "fieldOne": ""
                },
                {
                    "name": "two ", "fieldOne": ""
                },
                {
                    "name": "three", "fieldOne": ""
                },
                {
                    "name": "four", "fieldOne": ""
                },
                {
                    "name": "five", "fieldOne": ""
                },
            ],
            planScheme: []

        }, {
            "planName": "sad",
            "description": "sda",
            "seatType": 1,
            "numberOfRows": 3,
            "criteriaOneTitle": "A criteria",
            "tableData": [
                {
                    "name": "one",
                    "fieldOne": ""
                },
                {
                    "name": "two ", "fieldOne": ""
                },
                {
                    "name": "two ", "fieldOne": ""
                },
                {
                    "name": "three", "fieldOne": ""
                },
                {
                    "name": "four", "fieldOne": ""
                },
                {
                    "name": "five", "fieldOne": ""
                },
                {
                    "name": "one",
                    "fieldOne": ""
                },
                {
                    "name": "two ", "fieldOne": ""
                },
                {
                    "name": "three", "fieldOne": ""
                },
                {
                    "name": "four", "fieldOne": ""
                },
                {
                    "name": "five", "fieldOne": ""
                },
            ],
            planScheme: []
        },], { deep: true })


    //create a clone of the current table -will use it to undo changes-
    let currentPlanIndex = ref(0);

    const generatePlanScheme = (tableData, seatType, numberOfRows) => {
        const currentPlan = plans.value[currentPlanIndex.value];
        if (currentPlan.tableData.length === currentPlan.numberOfRows) return
        const students = tableData
        const rows = numberOfRows
        const total = students.length;

        if (total === rows) return [[...students]];

        const base = Math.floor(total / rows);
        let extra = total % rows;

        // Compute how many students per row
        const studentsPerRow = Array.from({ length: rows }, (_, i) =>
            i < extra ? base + 1 : base
        );

        // Now split students based on that
        const result = [];
        let start = 0;

        for (const count of studentsPerRow) {
            result.push(students.slice(start, start + count));
            start += count;
        }

        const planScheme = addBlankStudents(seatType, result)
        return planScheme;

    }
    //INTERNAL : adds blank students to the planScheme to ensure rows has equal number of students
    const addBlankStudents = (seatType, planScheme) => {
        const isPairType = seatType === "pairs";
        const blankStudent = () => ({ name: "", fieldOne: undefined, id: (planScheme.reduce((acc, row) => acc + row.length, 0) + 1) });
        const firstRow = planScheme[0];

        // Make first row even if seatType is 'pairs' and it's odd
        if (isPairType && firstRow.length % 2 !== 0) {
            firstRow.push(blankStudent());
        }

        const targetLength = firstRow.length;

        planScheme.forEach((row, index) => {
            if (index === 0) return;
            const missing = targetLength - row.length;
            for (let i = 0; i < missing; i++) {
                row.push(blankStudent());
            }
        });

        return planScheme;
    };
    // adds ID to each student in the DataTable
    const addIdToStudents = (tableData) => {
        return tableData.map((student, index) => {
            return { ...student, id: index + 1 };
        });
    }

    const plansCreator = (planName, description, seatType, criteriaOneTitle, tableData, numberOfRows) => {
        tableData = addIdToStudents(tableData);
        const planScheme = generatePlanScheme(tableData, seatType, numberOfRows);
        plans.value.push({
            planName: planName,
            description: description,
            seatType: seatType,
            criteriaOneTitle: criteriaOneTitle,
            tableData: tableData,
            numberOfRows: numberOfRows,
            planScheme: planScheme,
        })
        //switch to the new created plan & update the cloned plan
        currentPlanIndex.value = plans.value.length - 1
        updateClonedPlan();
    }
    const deletePlan = (index) => { plans.value.splice(index, 1) }

    const shufflePlan = () => {
        const { tableData, seatType, numberOfRows } = plans.value[currentPlanIndex.value]
        // clone the tableData then shuffle the clone then create new planScheme
        let deck = useCloned(tableData).cloned.value;
        for (var i = deck.length - 1; i > 0; i--) {
            const swapIndex = Math.floor(Math.random() * (i + 1))
            const currentCard = deck[i]
            const cardToSwap = deck[swapIndex]
            deck[i] = cardToSwap
            deck[swapIndex] = currentCard
        }
        plans.value[currentPlanIndex.value].planScheme = generatePlanScheme(deck, seatType, numberOfRows);
    }
    // copy of the plan -used to undo changes-
    let clonedPlan = ref()

    const updateClonedPlan = () => {
        const { cloned } = useCloned(plans.value[currentPlanIndex.value])
        clonedPlan.value = cloned.value
    }


    //state functions
    const undoChanges = () => {
        plans.value[currentPlanIndex.value] = useCloned(clonedPlan.value).cloned.value;

    }

    const sortItems = (sortType) => {
        let tableData = plans.value[currentPlanIndex.value].tableData;
        const asc = sortType === "asc";

        tableData.sort(function (a, b) {
            //check if it is a number
            const isNumeric = (n) => {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            const itemA = isNumeric(a.fieldOne) ? Number(a.fieldOne) : a.fieldOne
            const itemB = isNumeric(b.fieldOne) ? Number(b.fieldOne) : b.fieldOne
            if (itemA < itemB) {
                return asc ? -1 : 1;
            }
            else if (itemA > itemB) {
                return asc ? 1 : -1;
            }
            // items must be equal
            return 0;
        });
    }

    const downloadPlan = () => {
        const filename = `${plans.value[currentPlanIndex.value].planName}.json`
        const data = plans.value[currentPlanIndex.value]

        const blob = new Blob([JSON.stringify(data)]);
        const link = document.createElement("a");
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        link.click()

    }

    const uploadPlan = (upObject) => {

        if (ValidateUpload(upObject)) {
            plans.value.push(upObject);
            currentPlanIndex.value = plans.value.length - 1;
            return true
        }
        return false
    }  
      const checkStudentValidity = (student, allowEmptyNames) => {
        //empty names are allowed in planScheme and not in tableData
        const checkEmptyNames = allowEmptyNames || student.name.trim() !== ""
        return student.hasOwnProperty("name") && student.hasOwnProperty("id") && checkEmptyNames
    }
   const checkPropertiesValidity = (upObject) => {
        const checkNameLength =  upObject.planName.length > 0 && upObject.planName.length < 10;
        const checkSeatType = seatTypes.includes(upObject.seatType);
        const checkNumberOfRows = upObject.numberOfRows > 0 && upObject.numberOfRows <= 6;
        return checkNameLength && checkSeatType && checkNumberOfRows;
    }
    const ValidateUpload = (upObject) => {
        const checkKeys = Object.keys(plans.value[0]).every(k => upObject.hasOwnProperty(k))
        const checkProperties = checkPropertiesValidity(upObject);
        const checkTableDataLength = upObject.tableData.length > 10
        const checkTableDataStudents = upObject.tableData.every(student => checkStudentValidity(student,false)) //
        const checkPlanSchemeLength = upObject.planScheme.length === upObject.numberOfRows //
        const checkPlanSchemeStudents = upObject.planScheme.flat().every(student => checkStudentValidity(student,true))
        return checkKeys && checkProperties && checkTableDataLength && checkTableDataStudents && checkPlanSchemeLength && checkPlanSchemeStudents;
    }
    

    return {
        plans, currentPlanIndex, plansCreator, generatePlanScheme, addIdToStudents, undoChanges, sortItems, deletePlan, shufflePlan, downloadPlan, uploadPlan, ValidateUpload, viewMode
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
