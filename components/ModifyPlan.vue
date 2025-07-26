<template>
    <v-dialog width="auto" v-model="showModifyPlan">
        <v-sheet width="1000" class="mx-auto p-4">
            <v-form @submit.prevent class="bg-white">
                <p class="bg-white my-6 text-2xl">Change plan infos:</p>
                <v-text-field v-model="currentPlan.planName" :counter="10" label="Plan name*"
                    maxlength="10"></v-text-field>
                <v-text-field v-model="currentPlan.description" label="Description (optional)"></v-text-field>
                <p>change you seating type:</p>
                <v-select class="p-4" v-model="planStore.plans[planStore.currentPlanIndex].seatType" :items="seaTypes"
                    item-title="name" label="Select" variant="outlined" single-line></v-select>

            </v-form>


            <p class="bg-white my-6 text-2xl">Modify the table :</p>
            <div class=" flex justify-around mb-6">
                <v-btn variant="outlined" @click="planStore.sortItems('asc')" title="ascending sort">sort (asc)</v-btn>
                <v-btn variant="outlined" @click="planStore.sortItems('dec')" title="descending sort">sort (des)</v-btn>
            </div>
            <data-table v-model="clonedPlan.tableData" :criteria-title="fieldOneTitle"></data-table>
            <div class="action-btns flex justify-around my-4">
                <v-btn color="blue-darken-2" variant="tonal" @click="showModifyPlan = false">Undo changes</v-btn>
                <v-btn color="blue-darken-2" variant="tonal" @click="comparePlans">apply</v-btn>
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
    planStore.plans[planStore.currentPlanIndex] = clonedPlan.value
    showModifyPlan.value = false
}

const comparePlans = () => {
    //count new students (the new ones are without an id)
    const newStudents = clonedPlan.value.tableData.filter((student) => !student.id)
    //count deleted student
    const deletedStudents = useArrayDifference(currentPlan.tableData, clonedPlan.value.tableData, (value, othVal) => value.id === othVal.id)
    //count empty places (deleted + blank object)
    const emptyPlaces = [...currentPlan.planScheme.flat().filter((student) => student.name.trim() === ''), ...deletedStudents.value]

    //if new students < empty places : places them
    if (newStudents.length <= emptyPlaces.length) {
        //place new students in empty places
        newStudents.forEach((student, index) => {
            student.id =  emptyPlaces[index].id,
            replaceInPlanScheme(student.id!, student.name, student.fieldOne)
        })

    } else {
           // if new students > empty places : re generate a new sitting scheme
        alert("There are not enough empty places for the new students. Please remove some students or add more empty places.")
    }

    //if deletedStudents is too big : re generate a new sitting scheme
}

const replaceInPlanScheme = (id: number, name: string, fieldOne: number | undefined) => {
    const planScheme = clonedPlan.value.planScheme
    const oldStudent = planScheme.flat().find((student) => student.id === id)
    if (oldStudent) {
        oldStudent.name = name;
        oldStudent.fieldOne = fieldOne
    }
}
</script>
<style>
.v-table {
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
}
</style>