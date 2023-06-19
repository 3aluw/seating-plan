<template>
    <v-sheet width="1000" class="mx-auto">
        <h1 class="text-center text-3xl my-2 mb-10 text-blue-500">Fill plan infos</h1>
        <v-form @submit.prevent v-model="form">
            <v-text-field v-model="planName" :rules="nameRule" :counter="10" label="Plan name*"></v-text-field>
            <v-text-field v-model="description" label="Description (optional)"></v-text-field>
            <v-text-field v-model="studentsNumber" type="number" :rules="reqiuiredRule"
                label="Number of students (enter a number)*"></v-text-field>

            chose a sitting plan model :

            <v-container fluid class="types-cont">
                <v-row>
                    <v-col cols="4">

                        <v-checkbox v-model="planType" value="1" :rules="checkTypeRule">
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
                        <v-checkbox v-model="planType" value="2">
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
                        <v-checkbox v-model="planType" value="3">
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
            <div class="flex justify-center">
                <v-btn append-icon="$next" variant="outlined" type="submit" @click='submitPlan'>NEXT</v-btn>
            </div>
        </v-form>
    </v-sheet>
</template>

<script setup>
import { usePlanStore } from '@/store/planStore'
const planStore = usePlanStore()


/*form inputs */
let planName = ref('')
let description = ref('')
let studentsNumber = ref()
let planType = ref('')
const form = ref()

const submitPlan = () => {

    if (form.value == true) { planStore.plansCreator(planName, description, studentsNumber, "pairs", ["Ali", "moh"]) }
}




/*form rules */
const reqiuiredRule = [
    value => {
        if (value) return true

        return 'This field is required'
    }]
const checkTypeRule = [
    () => {
        return planType.value ? true : "Chose a type"
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