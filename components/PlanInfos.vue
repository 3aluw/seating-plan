    <!-- Step 1 in plan modal -->
<template>
    <v-sheet width="1000" max-width="100%" class="mx-auto">
        <h1 class="text-center text-3xl my-2 mb-10 font-bold uppercase">{{ $t('planDialog.stepOneTitle') }}</h1>
        <v-form @submit.prevent>
            <v-text-field v-model="planInfos.planName" :rules="nameRule" :counter="10" :label="$t('planDialog.planName')"
                maxlength="10"></v-text-field>
            <v-text-field v-model="planInfos.description" :label="$t('planDialog.description')"></v-text-field>

           {{ $t('planDialog.seatingType') }}
            <v-container fluid class="types-cont">
                <v-row>
                    <v-col cols="6">

                        <v-checkbox v-model="planInfos.seatType" value="pairs" :rules="seatingTypeRule">
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

const { t } = useI18n()
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

const seatingTypeRule = [
  () => {
    return planInfos.value.seatType ? true : t('validation.checkType.missingType')
  }
]

const nameRule = [
  (value) => {
    if (!value) return t('validation.name.required')
    if (value?.length > 15) return t('validation.name.tooLong')
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