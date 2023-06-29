<template>
    <div class="conatiner pt-12">
        <nav class="flex justify-around">
            <v-btn variant="text">Home</v-btn>
            <v-btn variant="text">Modify paln</v-btn>
            <v-btn variant="text">change plan</v-btn>
        </nav>
        <div class="playground-cont">
            {{ clonedTableData }}</div>
        <div class="action-btns flex justify-around">
            <v-btn color="blue-darken-2" variant="tonal">Undo changes</v-btn>
            <v-btn color="blue-darken-2" variant="tonal">download a screenshot</v-btn>
        </div>
    </div>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
const { plans, currentPlanIndex, clonedTableData } = usePlanStore();



</script>