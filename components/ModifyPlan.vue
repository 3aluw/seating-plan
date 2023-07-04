<template>
    <v-dialog v-model="showChangePlan" width="auto">
        <v-sheet width="1000" class="mx-auto p-4">
            <v-form @submit.prevent class="bg-white">
                <v-text-field v-model="currentPlan.planName" :counter="10" label="Plan name*" maxlength="10"></v-text-field>
                <v-text-field v-model="currentPlan.description" label="Description (optional)"></v-text-field>
            </v-form>

            <p class="bg-white mt-6 text-xl">Modify the table :</p>
            <v-table class="mb-4" height="500px" maxWidth="90vw">
                <thead>
                    <tr>
                        <th class="text-center">Names</th>
                        <th class="text-center"><v-text-field maxlength="10" :counter="10"
                                v-model="fieldOneTitle"></v-text-field>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(student, index) in  tableData" :key="student.name">
                        <td><v-text-field class="md:w-80" v-model="tableData[index].name"></v-text-field> </td>
                        <td><v-text-field class="md:w-80" v-model="tableData[index].fieldOne"></v-text-field> </td>
                        <v-btn icon="mdi-trash-can" variant="text" color="red" @click="deleteItem(index)"></v-btn>
                    </tr>

                </tbody>

            </v-table>

        </v-sheet>

    </v-dialog>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();
const currentPlan = planStore.plans[planStore.currentPlanIndex]
const tableData = planStore.plans[planStore.currentPlanIndex].tableData;
const fieldOneTitle = planStore.plans[planStore.currentPlanIndex].criteriaOneTitle
const deleteItem = (index) => {
    tableData.splice(index, 1)
}

//dialog logic
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])


const showChangePlan = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

</script>