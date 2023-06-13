<template>
    <v-sheet width="300" class="mx-auto">
        <v-form @submit.prevent>
            <v-text-field v-model="planName" :rules="reqiuiredRule" :counter="10" label="Plan name*"></v-text-field>
            <v-text-field v-model="description" label="Description (optional)"></v-text-field>
            <v-text-field v-model="studentsNumber" type="number" :rules="reqiuiredRule"
                label="Number of students*"></v-text-field>

        </v-form>
    </v-sheet>
</template>

<script setup>
import { usePlanStore } from '@/store/planStore'
const planStore = usePlanStore()


let planName = ref('')
let description = ref('')
let studentsNumber = ref()



const reqiuiredRule = [
    value => {
        if (value) return true

        return 'This field is required'
    }]
console.log(planStore.count)


</script>