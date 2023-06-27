<template>
    <v-sheet width="1000" class="mx-auto">
        <h1 class="text-center text-3xl my-2 mb-10 text-blue-300">Fill plan infos</h1>
        <v-form @submit.prevent>
            <v-text-field v-model="planInfos.planName" :rules="nameRule" :counter="10" label="Plan name*"
                maxlength="10"></v-text-field>
            <v-text-field v-model="planInfos.description" label="Description (optional)"></v-text-field>


            chose a sitting plan model :

            <v-container fluid class="types-cont">
                <v-row>
                    <v-col cols="4">

                        <v-checkbox v-model="planInfos.planType" value="0" :rules="checkTypeRule">
                            <template v-slot:label>
                                <div>
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <img src="pairs.png" />
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-checkbox>
                    </v-col>


                    <v-col>
                        <v-checkbox v-model="planInfos.planType" value="1">
                            <template v-slot:label>
                                <div>
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <img src="U-shape.png" />
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-checkbox> </v-col>

                    <v-col>
                        <v-checkbox v-model="planInfos.planType" value="2">
                            <template v-slot:label>
                                <div>
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <img src="rows.png" />
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-checkbox>
                    </v-col>
                </v-row>
            </v-container>


        </v-form>
    </v-sheet>
</template>

<script setup>
import { usePlanStore } from '@/store/planStore'
const planStore = usePlanStore()


// emit and update planInfos
const props = defineProps({
    modelValue: Object,
})
const emit = defineEmits(['update:modelValue'])
const planInfos = computed({
    get() { return props.modelValue },
    set(newValue) { emit("update:modelValue", newValue) }
}
)






/*form rules */
const reqiuiredRule = [
    value => {
        if (value) return true

        return 'This field is required'
    }]
const checkTypeRule = [
    () => {
        return planInfos.value.planType ? true : "Chose a type"
    }
]
const nameRule = [
    value => {
        if (value) return true

        return 'Name is requred.'
    },
    value => {
        if (value?.length <= 10) return true

        return 'Name must be less than 10 characters.'
    },
]

</script>
<style>
.v-form {
    background: #1B1C24;
}

.v-selection-control {
    flex-direction: column;
}

.types-cont .v-label {
    opacity: 100;
}
</style>