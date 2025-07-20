<template>
    <v-sheet width="1000" max-width="100%" class="mx-auto mb-10">
        <h1 class="text-center text-3xl my-2 mb-10 font-bold">Set up your class</h1>
        <div class="add-names-cont">
            <div class="">
                <div class="flex align-center gap-4">add a sorting criteria : <v-switch class="inline-grid"
                        v-model="isSortingCriteriaAllowed" @update:modelValue="updateCriteriaData" hide-details></v-switch>
                </div>
                <v-text-field v-if="isSortingCriteriaAllowed" hide-details maxlength="10" :counter="10" variant="filled"
                    placeholder="this will help you to sort. ie: marks" label="Add a criteria title (optional)"
                    v-model="namesTable.criteriaOneTitle"></v-text-field>
            </div>
            <h2 class="text-xl py-4">Add names </h2>
            Here you can set up a able of your attendants, enter each name in new line; click add data after you
            complete.
            <br> you can add a criteria that can help you to sort...(ie: a
            teacher can
            use marks as an additional criteria).

            <v-table class="my-4">
                <thead>
                    <tr class="bg-blue-200 text-black">
                        <th class="text-left text-black ">Names</th>
                        <th class="text-left text-black" v-if="isSortingCriteriaAllowed">{{ namesTable.criteriaOneTitle ?? 'Criteria' }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student in namesTable.tableData" :key="student.name">
                        <td>{{ student.name }}</td>
                        <td v-if="isSortingCriteriaAllowed">{{ student.fieldOne }}</td>
                    </tr>
                    <tr>
                        <td class="px-0">
                            <v-textarea label="enter new students' names" v-model="newStudents" rows="2"
                                :rules="namesRule"></v-textarea>
                        </td>
                        <td class="px-0">
                            <v-textarea v-if="isSortingCriteriaAllowed" label="enter new values's list" v-model="newMarks" rows="2"></v-textarea>
                        </td>
                    </tr>

                </tbody>
            </v-table>
        </div>
        <div class="insert-rows-cont" v-if="namesTable.tableData.length > 0">
            <h2 class="text-xl py-4">How many rows are there?</h2>
            <v-slider v-model="namesTable.numberOfRows" :max="maxNumberOfRows" :min="1" :step="1"
                thumb-label></v-slider>
        </div>
        <div class="flex justify-center ">
            <v-btn class="mx-4" @click="addNewData" color="light-green-lighten-4"
                :disabled="!newStudents">Add data</v-btn>
            <v-btn class="mx-4" @click="clearTable" color="red-lighten-4">clear</v-btn>
        </div>
    </v-sheet>
</template>

<script setup>
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
    return Math.min(Math.ceil(namesTable.value.tableData.length / 4), 4)
})

let newStudents = ref('');
let newMarks = ref('')


const addNewData = () => {
    const newStudentsArray = newStudents.value.split('\n')
    const newMarksArray = newMarks.value.split('\n')

    newStudentsArray.forEach((el, i) => {
        if (el) {
            namesTable.value.tableData.push({
                name: el,
                fieldOne: newMarksArray[i] ?? "",
            })
        }
    })
    newStudents.value = newMarks.value = "";
}

const clearTable = () => {
    namesTable.value.tableData = []
}

const updateCriteriaData = () => {
    if (!isSortingCriteriaAllowed.value) {
        namesTable.value.criteriaOneTitle = "";
        namesTable.value.tableData.forEach(student => student.fieldOne = "")
    }
    console.log(namesTable.value.tableData);
}






/*From rules */
const fieldOneTitleRule = [
    value => {
        if (value && namesTable.value.criteriaOneTitle || !value) return true;
        return "Enter a criteria name"
    }
]


const namesRule = [
    value => {
        if (value && value?.match(/\n\n/)) return "you can't have empty row(s)"
        else if (value && value.match(/\n/g)?.length < 4 && namesTable.value.tableData?.length < 4) { return "you need to enter atleast 5 names" }
        return true
    },
]

</script>