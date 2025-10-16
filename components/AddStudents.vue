    <!-- Step 2 in plan modal -->
<template>
    <v-sheet width="1000" max-width="100%" class="mx-auto mb-10">
        <h1 class="text-center text-3xl my-2 mb-10 font-bold uppercase">{{ $t('planDialog.stepTwoTitle') }}</h1>
        <div class="add-names-cont">
            <div class="">
                <h2 class="text-xl py-4">{{ $t('planDialog.sortingCriteria') }}</h2>

                <div class="flex align-center">{{ $t('planDialog.enableSortingCriteria') }}
                    <v-tooltip :text="$t('planDialog.sortingCriteriaTooltip')" :location="'top'">
                        <template v-slot:activator="{ props }">
                            <v-icon icon="mdi-information-outline" variant="plain" color="grey" v-bind="props"></v-icon>
                        </template>

                    </v-tooltip> : <v-switch class="inline-grid ml-4" v-model="isSortingCriteriaAllowed"
                        @update:modelValue="updateCriteriaData" hide-details></v-switch>
                </div>
                <v-text-field :rules="criteriaTitleRule" v-if="isSortingCriteriaAllowed" hide-details maxlength="10"
                    :counter="10" variant="filled" placeholder="this will help you to sort. ie: marks"
                    :label="$t('planDialog.setCriteriaTitle')" v-model="namesTable.criteriaOneTitle"></v-text-field>
            </div>
            <h2 class="text-xl py-4">{{ $t('planDialog.addNames') }}</h2>
            {{ $t('planDialog.addNamesDescription') }}

            <data-table v-model="namesTable.tableData" :criteria-title="namesTable.criteriaOneTitle"
                :is-initial-table="true"></data-table>
        </div>
        <div class="insert-rows-cont" v-if="namesTable.tableData.length > 0">
            <h2 class="text-xl py-4 "> {{ $t('planDialog.numOfRows') }}</h2>
            <v-slider v-model="namesTable.numberOfRows" :max="maxNumberOfRows" thumb-label="always" :min="1"
                :step="1"></v-slider>
        </div>
    </v-sheet>
</template>

<script setup>
import { useAlertStore } from '~/store/alertStore';
const alertStore = useAlertStore()
const { t } = useI18n()
// emit and update planInfos
const props = defineProps({
    modelValue: Object,
})
const emit = defineEmits(['update:modelValue'])
const namesTable = computed({
    get() { return props.modelValue },
    set(newValue) { emit("update:modelValue", newValue) }
}
)
const isSortingCriteriaAllowed = ref(false);
const maxNumberOfRows = computed(() => {
    return Math.min(Math.ceil(namesTable.value.tableData.length / 6), 6)
})


const updateCriteriaData = () => {
    if (!isSortingCriteriaAllowed.value) {
        namesTable.value.criteriaOneTitle = undefined;
        namesTable.value.tableData.forEach(student => student.fieldOne = undefined)
    }
    else {
        namesTable.value.criteriaOneTitle = t('basic.defaultCriteriaTitle');
        namesTable.value.tableData.forEach(student => student.fieldOne = 0)
    }

}


/*From rules */
const criteriaTitleRule = [
  (value) => {
    if ((value && namesTable.value.criteriaOneTitle) || !value) return true
    return t('validation.criteriaTitle.missing')
  },
]
</script>