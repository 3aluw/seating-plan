<template>
    <v-dialog v-model="showChangePlan" width="auto">
        <v-sheet width="1000" class="mx-auto p-4">
            <v-form @submit.prevent class="bg-white">
                <p class="bg-white my-6 text-2xl">Change plan infos:</p>
                <v-text-field v-model="currentPlan.planName" :counter="10" label="Plan name*" maxlength="10"></v-text-field>
                <v-text-field v-model="currentPlan.description" label="Description (optional)"></v-text-field>
                <p>change you seating type:</p>
                <v-select class="p-4" v-model="planStore.plans[planStore.currentPlanIndex].seatType" :items="seaTypes"
                    item-title="name" item-value="value" label="Select" variant="outlined" single-line></v-select>

            </v-form>


            <p class="bg-white my-6 text-2xl">Modify the table :</p>
            <div class=" flex justify-around mb-6">
                <v-btn variant="outlined" @click="planStore.sortItems('asc')" title="ascending sort">sort (asc)</v-btn>
                <v-btn variant="outlined" @click="planStore.sortItems('dec')" title="descending sort">sort (des)</v-btn>
            </div>
            <v-table class="mb-4 border-2 border-slate-500 bg-slate-500" height="700px" maxWidth="90vw">
                <thead>
                    <tr>
                        <th class="text-center ">Names</th>
                        <th class="text-center">{{ fieldOneTitle }}</th>


                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(student, index) in  planStore.plans[planStore.currentPlanIndex].tableData ">
                        <td><v-text-field class="md:w-80"
                                v-model="planStore.plans[planStore.currentPlanIndex].tableData[index].name"></v-text-field>
                        </td>
                        <td><v-text-field class="md:w-80"
                                v-model="planStore.plans[planStore.currentPlanIndex].tableData[index].fieldOne"></v-text-field>
                        </td>
                        <v-btn icon="mdi-trash-can" variant="text" color="red" @click="deleteItem(index)"></v-btn>
                    </tr>


                </tbody>

            </v-table>
            <div class="action-btns flex justify-around my-4">
                <v-btn color="blue-darken-2" variant="tonal" @click="planStore.undoChanges">Undo changes</v-btn>
                <v-btn color="blue-darken-2" variant="tonal" @click="showChangePlan = false">apply</v-btn>
            </div>
        </v-sheet>

    </v-dialog>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();
const currentPlan = planStore.plans[planStore.currentPlanIndex]
const fieldOneTitle = planStore.plans[planStore.currentPlanIndex].criteriaOneTitle

const seaTypes = [{ name: "pairs", value: "0" }, { name: "rows", value: "1" }, { name: "U-shape", value: "2" },
]


const deleteItem = (index) => {
    planStore.plans[planStore.currentPlanIndex].tableData.splice(index, 1)
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
<style>
.v-table {
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
}
</style>