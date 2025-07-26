<template>
    <v-sheet width="1000" max-width="100%" class="mx-auto">
        <h1 class="text-center text-3xl my-2 mb-10 font-bold uppercase">Fill plan info</h1>
        <v-form @submit.prevent>
            <v-text-field v-model="planInfos.planName" :rules="nameRule" :counter="10" label="Plan name*"
                maxlength="10"></v-text-field>
            <v-text-field v-model="planInfos.description" label="Description (optional)"></v-text-field>

            chose a sitting plan model :
            <v-container fluid class="types-cont">
                <v-row>
                    <v-col cols="6">

                        <v-checkbox v-model="planInfos.seatType" value="pairs" :rules="checkTypeRule">
                            <template v-slot:label>
                                <div class="border-2">
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <img src="/pairs.png" />
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-checkbox>
                    </v-col>
                    <v-col cols="6">
                        <v-checkbox v-model="planInfos.seatType" value="rows">
                            <template v-slot:label>
                                <div class="border-2">
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <img src="/rows.png" />
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-checkbox>
                    </v-col>
                    <!-- <v-col>
                        <v-checkbox v-model="planInfos.seatType" value="u-shape">
                            <template v-slot:label>
                                <div>
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <img src="/U-shape.png" />
                                        </template>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-checkbox> </v-col> -->
                </v-row>
            </v-container>


        </v-form>
    </v-sheet>
</template>

<script setup>


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
const requiredRule = [
    value => {
        if (value) return true

        return 'This field is required'
    }]
const checkTypeRule = [
    () => {
        return planInfos.value.seatType ? true : "Chose a type"
    }
]
const nameRule = [
    value => {
        if (!value) return 'Name is required.'
        if (value?.length > 15) return "name should be shorter"
        return true
    },
]

</script>
<style scoped>
.v-selection-control {
    flex-direction: column;
}

.types-cont .v-label {
    opacity: 100;
}
</style>