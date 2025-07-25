<template>
    <v-sheet width="1000" max-width="100%" class="mx-auto mb-10">
        <h1 class="text-center text-3xl my-2 mb-10 font-bold uppercase">Set up your class</h1>
        <div class="add-names-cont">
            <div class="">
                <div class="flex align-center gap-4">add a sorting criteria : <v-switch class="inline-grid"
                        v-model="isSortingCriteriaAllowed" @update:modelValue="updateCriteriaData"
                        hide-details></v-switch>
                </div>
                <v-text-field :rules="criteriaTitleRule" v-if="isSortingCriteriaAllowed" hide-details maxlength="10"
                    :counter="10" variant="filled" placeholder="this will help you to sort. ie: marks"
                    label="Add a criteria title (optional)" v-model="namesTable.criteriaOneTitle"></v-text-field>
            </div>
            <h2 class="text-xl py-4">Add names</h2>
            Here you can set up a able of your attendants, enter each name in new line; click add data after you
            complete.
            <br> you can add a criteria that can help you to sort...(ie: a
            teacher can
            use marks as an additional criteria).

            <v-table class="my-4">
                <thead>
                    <tr class="bg-blue-200 text-black">
                        <th class="text-left text-black ">Names</th>
                        <th class="text-left text-black w-1/2" v-if="isSortingCriteriaAllowed">{{ namesTable.criteriaOneTitle
                            ?? 'Criteria' }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(student, index) in namesTable.tableData">
                        <td><v-text-field maxlength="30" @update:focused="deleteEmptyStudent(student.name, index)" hide-details
                                class="px-0" v-model="student.name" variant="plain"></v-text-field></td>
                        <td class="w-1/2" v-if="isSortingCriteriaAllowed"><v-text-field hide-details class="px-0"
                                v-model="student.fieldOne" variant="plain"></v-text-field></td>
                    </tr>
                    <tr>
                        <td class="px-0">
                            <v-textarea class="h-full" label="Enter each name on a new line" v-model="newStudents"
                                rows="2" auto-grow :rules="namesRule"></v-textarea>
                        </td>
                        <td class="px-0 w-1/2" v-if="isSortingCriteriaAllowed">
                            <v-textarea class="h-full" :rules="criteriaRules"
                                label="enter new values's list" auto-grow v-model="newMarks" rows="2"></v-textarea>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>


        <div class="flex justify-center ">
            <v-btn class="mx-4" @click="addNewData" color="teal-lighten-2" :disabled="!allowAddNewData">Add data</v-btn>
            <v-btn class="mx-4" @click="clearTable" color="red-lighten-2">clear</v-btn>
        </div>
        <div class="insert-rows-cont" v-if="namesTable.tableData.length > 0">
            <h2 class="text-xl py-4 ">How many rows are there?</h2>
            <v-slider  v-model="namesTable.numberOfRows" :max="maxNumberOfRows" :min="1" :step="1"
                thumb-label></v-slider>
        </div>
    </v-sheet>
</template>

<script setup>
import { useAlertStore } from '~/store/alertStore';
const alertStore = useAlertStore()
// emit and update planInfos
const props = defineProps({
    modelValue: Object,
})
const emit = defineEmits(['update:modelValue'])
const namesTable = computed({
    get() { return props.modelValue },
    set(newValue) { emit("update:modelValue", newValue) }
}
)
const isSortingCriteriaAllowed = ref(true);
const maxNumberOfRows = computed(() => {
    return Math.min(Math.ceil(namesTable.value.tableData.length / 6), 6)
})

let newStudents = ref('');
let newMarks = ref('')

const deleteEmptyStudent = (studentName, index) => {
    if (studentName.length !== 0) return
    namesTable.value.tableData.splice(index, 1)
}
const allowAddNewData = computed(() => {
    let namesArray = newStudents.value.match(/^\s*\S.*$/gm) || []
    let criteriaArray = newMarks.value.match(/^\s*\S.*$/gm) || []
    const isListLongEnough = namesTable.value.tableData.length + namesArray.length >= 10
    const isNotEmpty = namesArray.length > 0 && (!isSortingCriteriaAllowed.value || criteriaArray.length > 0);
    const isCriteriaValid = !isSortingCriteriaAllowed.value ? true : namesArray.length - criteriaArray.length < 3 ? true : false;
    return isListLongEnough && isCriteriaValid && isNotEmpty
})
const addNewData = () => {
    let namesArray = newStudents.value.split('\n')
    let criteriaArray = newMarks.value.split('\n')
    //delete empty rows in names and their corresponding criteria
    const filtered = namesArray.reduce((acc, name, index) => {
        if (name.trim() !== '') {
            acc.names.push(name);
            acc.criteria.push(criteriaArray[index]);
        }
        return acc;
    }, { names: [], criteria: [] });

    namesArray = filtered.names;
    criteriaArray = filtered.criteria;

    //cut names to 30 characters
    if (namesArray.some(name => name.length > 30)) {
        alertStore.createAlert("warning", "Long names are cut to 30 characters"
        )
        namesArray = namesArray.map(name =>name.trim().slice(0, 30));
    }
    //add data
    namesArray.forEach((el, i) => {
        if (el) {
            namesTable.value.tableData.push({
                name: el,
                fieldOne: isSortingCriteriaAllowed.value ? (Number(criteriaArray[i]) || 0) : undefined,
            })
        }
    })
    newStudents.value = newMarks.value = "";
}

const clearTable = () => {
    namesTable.value.tableData = []
}

const updateCriteriaData = () => {
    if (!isSortingCriteriaAllowed.value) {
        namesTable.value.criteriaOneTitle = undefined;
       // namesTable.value.tableData.forEach(student => student.fieldOne = undefined)
    }
    else {
        namesTable.value.criteriaOneTitle = '';
       // namesTable.value.tableData.forEach(student => student.fieldOne = 0)
    }
   
}






/*From rules */
const criteriaTitleRule = [
    value => {
        if (value && namesTable.value.criteriaOneTitle || !value) return true;
        return "Enter a criteria name"
    }
]


const namesRule = [
    value => {
        if (value && (namesTable.value.tableData.length + value?.split('\n').length < 10)) return "To proceed You need to add at least 10 names"
        if (value && /\n\s*\n/.test('\n' + value)) return "Empty rows will be deleted"
        if (value && value?.split('\n').some((name) => name.length > 30)) return "Long names will be cut to 30 characters"
        return true
    },
]
const criteriaRules = [
    value => {
        if (value && /\n\s*\n/.test('\n' + value)) return "Empty rows will be converted to 0"
        else if (value && (value.match(/^\s*\S.*$/gm)?.some((criteriaValue) =>  isNaN(Number(criteriaValue))))) { return "Non-numeric values will be converted to 0" }
        return true
    },
]

</script>