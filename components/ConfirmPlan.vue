<template>
    <v-sheet width="1000" class="mx-auto">
        <v-list lines="one" theme="dark">
            <v-list-item title="plan name" :subtitle="planInfos.planName"></v-list-item>
            <v-list-item title="Description" :subtitle="planInfos.description"></v-list-item>
            <v-list-item title="plan Type" :subtitle="planTypes[planInfos.planType]"></v-list-item>
        </v-list>
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
    </v-sheet>
</template>
<script setup>
const props = defineProps(["planInfos", "namesTable"])

const planTypes = ["Pairs", "U-shape", "Rows"]
</script>
<style>
.v-list-item {
    margin-block: 1rem;
}

.v-list-item-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.v-list-item-subtitle {
    font-size: 1rem;
    opacity: 0.8;
}
</style>