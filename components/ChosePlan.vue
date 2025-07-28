<template>
    <div class="text-center">
        <v-dialog v-model="showChangePlan" width="clamp(30rem,70%,1000px)" >
            <v-card>
                <div class="m-12 flex gap-5 flex-wrap ">
                    <v-card v-for=" (plan, index)  in  planStore.plans" @click="changePlanIndex(index)" 
                        :title="plan.planName" :subtitle="`number of attendants : ${plan.tableData.length}`"
                        :text="plan.description" variant="outlined" class="overflow-scroll w-1/3 h-48 cursor-pointer">
                        <div class=" flex justify-around pb-2">
                            <v-btn icon="mdi-trash-can" variant="outlined" color="red" @click="planStore.deletePlan(index)"
                                v-if="index !== 0"></v-btn>
                        </div>
                    </v-card>

                </div>
                <v-card-actions>
                    <v-btn color="primary" block @click="showChangePlan = false">Close Dialog</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();

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

// change the current plan & closes the dialog
const changePlanIndex = (index) => {
    planStore.currentPlanIndex = index;
    showChangePlan.value = false;
}
</script>