<template>
    <v-table class="my-4">
        <thead>
            <tr>
                <th class="text-left">Names</th>
                <th class="text-left"><v-text-field maxlength="10" :counter="10" v-model="fieldOneTitle"></v-text-field>
                </th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(student, index) in  tableData" :key="student.name">
                <td><v-text-field v-model="tableData[index].name"></v-text-field> </td>
                <td><v-text-field v-model="tableData[index].fieldOne"></v-text-field> </td>
                <v-btn icon="mdi-trash-can" @click="deleteItem(index)"></v-btn>
            </tr>

        </tbody>

    </v-table>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();

const tableData = planStore.plans[planStore.currentPlanIndex].tableData;
const fieldOneTitle = planStore.plans[planStore.currentPlanIndex].criteriaOneTitle


const deleteItem = (index) => {
    tableData.splice(index, 1)
}
</script>