<template>
    <v-sheet width="1000" max-width="100%" class="mx-auto mb-10">
        <h1 class="text-center text-3xl my-2 mb-10 font-bold uppercase">Set up your class</h1>
        <div class="add-names-cont">
            <div class="">
                <h2 class="text-xl py-4">Sorting criteria</h2>

                <div class="flex align-center">Enable sorting criteria
                    <v-tooltip text="You can add a criteria that can help you to sort...(ie: a
                    teacher can
                    use marks as an sorting criteria).">
                        <template  v-slot:activator="{ props }">
                            <v-icon icon="mdi-information-outline" variant="plain" color="grey" v-bind="props"></v-icon>
                        </template>

                    </v-tooltip> : <v-switch class="inline-grid ml-4" v-model="isSortingCriteriaAllowed"
                        @update:modelValue="updateCriteriaData" hide-details></v-switch>
                </div>
                <v-text-field :rules="criteriaTitleRule" v-if="isSortingCriteriaAllowed" hide-details maxlength="10"
                    :counter="10" variant="filled" placeholder="this will help you to sort. ie: marks"
                    label="Set a criteria title (optional)" v-model="namesTable.criteriaOneTitle"></v-text-field>
            </div>
            <h2 class="text-xl py-4">Add names</h2>
            Here you can set up a able of your attendants, Enter each name in new line; click add data after you
            complete.

            <data-table v-model="namesTable.tableData" :criteria-title="namesTable.criteriaOneTitle"
                :is-initial-table="true"></data-table>
        </div>
        <div class="insert-rows-cont" v-if="namesTable.tableData.length > 0">
            <h2 class="text-xl py-4 ">How many rows are there?</h2>
            <v-slider v-model="namesTable.numberOfRows" :max="maxNumberOfRows" :min="1" :step="1"
                thumb-label></v-slider>
        </div>
    </v-sheet>
</template>

<script setup>
import { useAlertStore } from '~/store/alertStore';
const alertStore = useAlertStore()
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
        namesTable.value.criteriaOneTitle = 'score';
        namesTable.value.tableData.forEach(student => student.fieldOne = 0)
    }

}


/*From rules */
const criteriaTitleRule = [
    value => {
        if (value && namesTable.value.criteriaOneTitle || !value) return true;
        return "Enter a criteria name"
    }
]


const namesRule = [
    value => {
        if (value && (namesTable.value.tableData.length + value?.split('\n').length < 10)) return "To proceed You need to add at least 10 names"
        if (value && /\n\s*\n/.test('\n' + value)) return "Empty rows will be deleted"
        if (value && value?.split('\n').some((name) => name.length > 30)) return "Long names will be cut to 30 characters"
        return true
    },
]
const criteriaRules = [
    value => {
        if (value && /\n\s*\n/.test('\n' + value)) return "Empty rows will be converted to 0"
        else if (value && (value.match(/^\s*\S.*$/gm)?.some((criteriaValue) => isNaN(Number(criteriaValue))))) { return "Non-numeric values will be converted to 0" }
        return true
    },
]

</script>