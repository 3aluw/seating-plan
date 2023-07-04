<template>
    <div class="text-center">
        <v-dialog v-model="showChangePlan" width="auto">
            <v-card>
                <v-sheet class="m-12 d.flex gap-5 flex-wrap " maxWidth="90vw">
                    <v-card v-for=" (plan, index)  in  plans " @click="changePlanIndex(index)" :title="plan.planName"
                        :subtitle="`number of attandents : ${plan.number}`" :text="plan.description" variant="outlined">
                    </v-card>

                </v-sheet>
                <v-card-actions>
                    <v-btn color="primary" block @click="showChangePlan = false">Close Dialog</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
let { plans } = usePlanStore()
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