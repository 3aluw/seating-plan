<template>
    <v-sheet width="1000" max-width="100%" class="mx-auto">
        <h1 class="text-center text-3xl my-2 my-10 font-bold uppercase">Check your plan</h1>
        <h2 class="text-2xl font-bold pt-4 pb-2">Plan info:</h2>
        <v-list lines="one" >
            <v-list-item title="plan name" :subtitle="planInfos.planName"></v-list-item>
            <v-list-item title="Description" :subtitle="planInfos.description"></v-list-item>
            <v-list-item title="plan Type" :subtitle="planInfos.seatType"></v-list-item>
            <v-list-item title="Number of attendants" :subtitle="namesTable.tableData.length"></v-list-item>
        </v-list>
        <div class="flex justify-center ">
            <v-btn class="mb-5" variant="outlined" color="orange-darken-3" @click="changeStep(1)">Modify</v-btn>
        </div>
        <v-divider :thickness="3"   class="border-opacity-75 my-4"></v-divider>
        <h2 class="text-2xl font-bold pt-4 pb-2 ">Your table:</h2>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Names</th>
                    <th class="text-left">{{ namesTable.criteriaOneTitle }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="student in  namesTable.tableData" :key="student.name">
                    <td>{{ student.name }}</td>
                    <td>{{ student.fieldOne }}</td>
                </tr>
            </tbody>
        </v-table>
        <div class="flex justify-center mb-8">
            <v-btn variant="outlined" color="orange-darken-3" @click="changeStep(2)">Modify</v-btn>
        </div>
    </v-sheet>
</template>
<script setup>
const props = defineProps(["planInfos", "namesTable"])
const emit = defineEmits(["changeStep"])

const changeStep = (step) => {
    emit("changeStep", step)
}
</script>
<style scoped>
.v-list-item {
    margin-block: 1rem;
    min-width: 30rem;
    display: inline-block;
}

.v-list-item-title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
}

.v-list-item-subtitle {
    font-size: 1rem;
    opacity: 0.8;
}
</style>