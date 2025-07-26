import { defineStore, acceptHMRUpdate } from "pinia";


export const usePlanStore = defineStore("PlanStore", () => {
    const viewMode = ref(false)


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
        const blankStudent = () => ({ name: "", fieldOne: "", id: (planScheme.reduce((acc, row) => acc + row.length, 0) + 1) });
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
    //INTERNAL: adds ID to each student in the DataTable
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
        //switch to the new created plan
        currentPlanIndex.value = plans.value.length - 1
    }
    const deletePlan = (index) => { plans.value.splice(index, 1) }

    const shufflePlan = () => {
        let deck = plans.value[currentPlanIndex.value].tableData;
        for (var i = deck.length - 1; i > 0; i--) {
            const swapIndex = Math.floor(Math.random() * (i + 1))
            const currentCard = deck[i]
            const cardToSwap = deck[swapIndex]
            deck[i] = cardToSwap
            deck[swapIndex] = currentCard
        }
    }
    /* to delete after checking reactivity 
        const clonedTableData = ref(plans.value[currentPlanIndex.value].tableData.map(a => { return { ...a } }))
        watch(currentPlanIndex, () => {
            if (currentPlanIndex.value) clonedTableData.value = plans.value[currentPlanIndex.value].tableData.map(a => { return { ...a } })
        }) */
    const clonedTableData = computed(() =>
        plans.value[currentPlanIndex.value].tableData.map(a => ({ ...a }))
    );
    //state functions
    const undoChanges = () => {
        plans.value[currentPlanIndex.value].tableData = clonedTableData.value.map(a => { return { ...a } })

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

        if (ValidateUplaod(upObject)) {
            plans.value.push(upObject);
            currentPlanIndex.value = plans.value.length - 1;
            return true
        }
        return false
    }
    const ValidateUplaod = (upObject) => {
        return Object.keys(plans.value[0]).length === Object.keys(upObject).length
            && Object.keys(plans.value[0]).every(k => upObject.hasOwnProperty(k)) && upObject.tableData.length > 6

    }


    return {
        plans, currentPlanIndex, plansCreator, clonedTableData, undoChanges, sortItems, deletePlan, shufflePlan, downloadPlan, uploadPlan, viewMode
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
