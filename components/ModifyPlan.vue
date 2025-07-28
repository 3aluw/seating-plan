<template>
    <v-dialog width="auto" v-model="showModifyPlan">
        <v-sheet width="1000" class="mx-auto p-4">
            <v-form @submit.prevent class="bg-white">
                <p class="bg-white my-6 text-2xl">Change plan infos:</p>
                <v-text-field v-model="clonedPlan.planName" :counter="10" label="Plan name*"
                    maxlength="10"></v-text-field>
                <v-text-field v-model="clonedPlan.description" label="Description (optional)"></v-text-field>
                <p>change you seating type:</p>
                <v-select class="p-4" v-model="clonedPlan.seatType" :items="seaTypes" item-title="name" label="Select"
                    variant="outlined" single-line></v-select>

                <p class="text-xl py-4 ">How many rows are there?</p>
                <v-slider v-model="clonedPlan.numberOfRows" :max="maxNumberOfRows" :min="1" :step="1"
                    thumb-label></v-slider>

            </v-form>


            <p class="bg-white my-6 text-2xl">Modify the table :</p>
            <data-table v-model="clonedPlan.tableData" :criteria-title="fieldOneTitle"></data-table>
            <div class="action-btns flex justify-around my-4">
                <v-btn color="blue-darken-2" variant="tonal" @click="showModifyPlan = false">Undo changes</v-btn>
                <v-btn color="blue-darken-2" variant="tonal" @click="applyChanges">apply</v-btn>
            </div>
        </v-sheet>
    </v-dialog>

</template>
<script setup lang="ts">
import type { IPlan } from "~/data/types.ts"
import { usePlanStore } from '~/store/planStore'
import { useCloned, useArrayDifference } from '@vueuse/core'
const planStore = usePlanStore();
const currentPlan: IPlan = planStore.plans[planStore.currentPlanIndex]
const { cloned: clonedPlan } = useCloned(currentPlan)
const fieldOneTitle = clonedPlan.value.criteriaOneTitle


const seaTypes = ["pairs", "rows"]
const maxNumberOfRows = computed(() => {
    return Math.min(Math.ceil(clonedPlan.value.tableData.length / 6), 6)
})



//dialog logic
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])


const showModifyPlan = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const applyChanges = () => {
    //manage modifications on the cloned plan tableData and planScheme
    manageModifications()
    //if the seatType or number of rows has changed, we need to regenerate the plan scheme
    const isSeatTypeChanged = currentPlan.seatType !== clonedPlan.value.seatType
    const IsNumberOfRowsChanged = currentPlan.numberOfRows !== clonedPlan.value.numberOfRows
    if (isSeatTypeChanged || IsNumberOfRowsChanged) regeneratePlanScheme()
    planStore.plans[planStore.currentPlanIndex] = clonedPlan.value
    showModifyPlan.value = false
}
// a function to sync the cloned plan tableData with the planScheme
const syncTables = () => {
    clonedPlan.value.tableData.forEach((student) => {
        const schemeStudent = clonedPlan.value.planScheme.flat().find(s => s.id === student.id)
        if (schemeStudent && useArrayDifference(Object.values(student), Object.values(schemeStudent))) {
            schemeStudent.name = student.name
            schemeStudent.fieldOne = student.fieldOne
        }
    })
}
// a function to manage modifications on the cloned plan tableData and planScheme
const manageModifications = () => {
    syncTables()
    //count new students (the new ones are without an id)
    const newStudents = clonedPlan.value.tableData.filter((student) => !student.id)
    //count deleted student
    const deletedStudents = useArrayDifference(currentPlan.tableData, clonedPlan.value.tableData, (value, othVal) => value.id === othVal.id)
    if (newStudents.length === 0 && deletedStudents.value.length === 0) return; // no changes to tableData
    //make deleted students similar to blank object name:''
    deletedStudents.value.forEach((student) => {
        const studentToDelete = clonedPlan.value.planScheme.flat().find((s) => s.id === student.id)
        if (studentToDelete) {
            studentToDelete.name = ''
            studentToDelete.fieldOne = clonedPlan.value.criteriaOneTitle ? 0 : undefined
        }
    })
    //count empty places (deleted + blank object)
    const emptyPlaces = clonedPlan.value.planScheme.flat().filter((student) => student.name.trim() === '')
    //if new students < empty places : places them in empty places
    if (newStudents.length <= emptyPlaces.length) {
        //place new students in empty places
        newStudents.forEach((student, index) => {
            student.id = emptyPlaces[index].id,
                replaceInPlanScheme(student.id!, student.name, student.fieldOne)
        })
        //since new empty places number is larger, we need to check if the number of empty places is still acceptable,
        //  if not, we regenerate the plan scheme
        const endingEmptyPlaces = emptyPlaces.length - newStudents.length
        const maxEmptyPlaces = clonedPlan.value.seatType === 'pairs' ? clonedPlan.value.numberOfRows * 2 : clonedPlan.value.numberOfRows
        checkEmptyPlaces(endingEmptyPlaces, maxEmptyPlaces)

    }
    else if (newStudents.length > emptyPlaces.length) {
        // if new students > empty places : re-generate a new sitting scheme/
        regeneratePlanScheme()
    }

}

const replaceInPlanScheme = (id: number, name: string, fieldOne: number | undefined) => {
    const planScheme = clonedPlan.value.planScheme
    const oldStudent = planScheme.flat().find((student) => student.id === id)
    if (oldStudent) {
        oldStudent.name = name;
        oldStudent.fieldOne = fieldOne
    }
}

const checkEmptyPlaces = (emptyPlaces: number, maxEmptyPlaces: number) => {
    if (emptyPlaces >= maxEmptyPlaces) {
        regeneratePlanScheme()
    }
}

const regeneratePlanScheme = () => {
    const newTableData = planStore.addIdToStudents(clonedPlan.value.tableData)
    clonedPlan.value.tableData = newTableData
    const newPlanScheme = planStore.generatePlanScheme(clonedPlan.value.tableData, clonedPlan.value.seatType, clonedPlan.value.numberOfRows)
    clonedPlan.value.planScheme = newPlanScheme
}
</script>
<style>
.v-table {
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
}
</style>