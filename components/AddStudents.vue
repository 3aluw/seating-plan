<template >
    <v-sheet width="1000" class="mx-auto">
        <h1 class="text-center text-3xl my-2 mb-10 text-blue-500">Set up your table</h1>
        Here you can set up a able of your attendents, you can add a criteria that can help you to sort...(ie: a teacher can
        use marks as an additional criteria)
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">Names</th>
                    <th class="text-left"><v-text-field :rules="nameCriteriaRule" maxlength="10" :counter="10"
                            placeholder="this will help you to sort. ie: marks" label="Add a criteria title ..."
                            v-model="namesTable.criteriaOneTitle"></v-text-field></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="student in  namesTable.tableData" :key="student.name">
                    <td>{{ student.name }}</td>
                    <td>{{ student.fieldOne }}</td>
                </tr>
                <tr>
                    <td>
                        <v-textarea label="enter new students' list" v-model="newStudents" rows="2"></v-textarea>
                    </td>
                    <td>
                        <v-textarea label="enter new data's list" v-model="newMarks" rows="2"></v-textarea>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-btn @click="addNewData">Add data</v-btn>
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

let students = ref([])
let newStudents = ref('');
let newMarks = ref('')


const addNewData = () => {
    const newStudentsArray = newStudents.value.split('\n')
    const newMarksArray = newMarks.value.split('\n')
    newStudentsArray.forEach((el, i) => {
        namesTable.value.tableData.push({
            name: el,
            fieldOne: newMarksArray[i],
        })
    })
    newStudents.value = newMarks.value = "";
}









/*From rule */
const nameCriteriaRule = [
    value => {
        if (value?.length <= 10) return true

        return 'Name must be less than 10 characters.'
    },
]

const fieldOneTitleRule = [
    value => {
        if (value && fieldOneTitle.value || !value) return true;
        return "Enter a criteria name"
    }
]

</script>