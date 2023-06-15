<template>
    <v-sheet width="1000" class="mx-auto">
        <h1 class="text-center text-3xl my-2 mb-10 text-blue-500">Fill plan infos</h1>
        <v-form @submit.prevent>
            <v-text-field v-model="planName" :rules="reqiuiredRule" :counter="10" label="Plan name*"></v-text-field>
            <v-text-field v-model="description" label="Description (optional)"></v-text-field>
            <v-text-field v-model="studentsNumber" type="number" :rules="reqiuiredRule"
                label="Number of students*"></v-text-field>
            <div>chose a sitting plan model :


            </div>
            <v-btn
                @click='planStore.plansCreator(planName, description, studentsNumber, "pairs", ["Ali", "moh"])'>send</v-btn>
        </v-form>
    </v-sheet>
</template>

<script setup>
import { usePlanStore } from '@/store/planStore'
const planStore = usePlanStore()

console.log(planStore.plans)
let planName = ref('')
let description = ref('')
let studentsNumber = ref()



const reqiuiredRule = [
    value => {
        if (value) return true

        return 'This field is required'
    }]



</script>
<style>
.v-form {
    background: #1B1C24;
}
</style>