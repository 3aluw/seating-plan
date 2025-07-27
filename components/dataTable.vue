<template>
    <div class="table-cont">
        <v-table class="my-4">

            <thead>
                <tr class="bg-blue-200 text-black">
                    <th class="text-left text-black ">Names</th>
                    <th class="text-left text-black w-1/2" v-if="isSortingCriteriaAllowed">{{ criteriaTitle
                        ?? 'Criteria' }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(student, index) in tableData">

                    <td class="flex gap-4"><v-btn @click="deleteStudent(index)" icon="mdi:mdi-delete-outline" color="red" variant="text">
                            
                        </v-btn><v-text-field maxlength="30" @update:focused="student.name.trim() === '' ? deleteStudent(index): undefined"
                            hide-details class="px-0" v-model="student.name" variant="plain"></v-text-field></td>
                    <td class="w-1/2" v-if="isSortingCriteriaAllowed"><v-text-field hide-details class="px-0"
                            v-model="student.fieldOne" variant="plain"></v-text-field></td>
                </tr>
                <tr>
                    <td class="px-0">
                        <v-textarea class="h-full" label="Enter each name on a new line" v-model="newNames" rows="2"
                            auto-grow :rules="namesRule"></v-textarea>
                    </td>
                    <td class="px-0 w-1/2" v-if="isSortingCriteriaAllowed">
                        <v-textarea class="h-full" :rules="criteriaRules" label="enter new values's list" auto-grow
                            v-model="newCriteriaValues" rows="2"></v-textarea>
                    </td>
                </tr>
            </tbody>
        </v-table>


        <div class="flex justify-center ">
            <v-btn class="mx-4" @click="addNewData" color="teal-lighten-2" :disabled="!allowAddNewData">Add data</v-btn>
            <!--    <v-btn class="mx-4" @click="clearTable" color="red-lighten-2">clear</v-btn> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAlertStore } from '~/store/alertStore';
import type { IStudent} from "~/data/types.ts"
const alertStore = useAlertStore()

const props = defineProps({
    modelValue: Array<IStudent>,
    criteriaTitle: String || undefined
})
const isSortingCriteriaAllowed = computed(() => props.criteriaTitle === undefined ? false : true)
const emit = defineEmits(['update:modelValue'])

const tableData = computed({
    get() {
        return props.modelValue || []
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

let newNames = ref('');
let newCriteriaValues = ref('')

const allowAddNewData = computed(() => {
    let namesArray = newNames.value.match(/^\s*\S.*$/gm) || []
    let criteriaArray = newCriteriaValues.value.match(/^\s*\S.*$/gm) || []
    const isListLongEnough = tableData.value.length + namesArray.length >= 10
    const isNotEmpty = namesArray.length > 0 && (isSortingCriteriaAllowed.value || criteriaArray.length > 0);
    const isCriteriaValid = isSortingCriteriaAllowed.value ? true : namesArray.length - criteriaArray.length < 3 ? true : false;
    return isListLongEnough && isCriteriaValid && isNotEmpty
})


const addNewData = () => {
    if (!allowAddNewData.value) return;
    let namesArray = newNames.value.split('\n')
    let criteriaArray = newCriteriaValues.value.split('\n')
    //delete empty rows in names and their corresponding criteria
    const filtered = namesArray.reduce<{ names: string[]; criteria: string[] }>((acc, name, index) => {
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
        namesArray = namesArray.map(name => name.trim().slice(0, 30));
    }
    //add data
    namesArray.forEach((el, i) => {
        if (el) {
            tableData.value.push({
                name: el,
                fieldOne: isSortingCriteriaAllowed.value ? (Number(criteriaArray[i]) || 0) : undefined,
            })
        }
    })
    newNames.value = newCriteriaValues.value = "";
}

const deleteStudent = ( index: number) => {
    if (tableData.value.length <= 10) {
        alertStore.createAlert("warning", "You need to have at least 10 names in the table")
        return
    }
    tableData.value.splice(index, 1)
}
//form rules
const namesRule = [
    (value: string) => {
        if (value && (tableData.value.length + value?.split('\n').length < 10)) return "To proceed You need to add at least 10 names"
        if (value && /\n\s*\n/.test('\n' + value)) return "Empty rows will be deleted"
        if (value && value?.split('\n').some((name) => name.length > 30)) return "Long names will be cut to 30 characters"
        return true
    },
]
const criteriaRules = [
    (value: string) => {
        if (value && /\n\s*\n/.test('\n' + value)) return "Empty rows will be converted to 0"
        else if (value && (value.match(/^\s*\S.*$/gm)?.some((criteriaValue) => isNaN(Number(criteriaValue))))) { return "Non-numeric values will be converted to 0" }
        return true
    },
]
</script>
<style scoped></style>