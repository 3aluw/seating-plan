<template >
    <v-sheet width="1000" class="mx-auto mb-10">
        <h1 class="text-center text-3xl my-2 mb-10 text-blue-500">Set up your table</h1>
        Here you can set up a able of your attendents, you can add a criteria that can help you to sort...(ie: a teacher can
        use marks as an additional criteria). <br>
        click add data after you complete entering data in the text field
        <v-table class="my-4">
            <thead class="bg-gray-800">
                <tr>
                    <th class="text-left">Names</th>
                    <th class="text-left"><v-text-field maxlength="10" :counter="10"
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
                        <v-textarea label="enter new students' list" v-model="newStudents" rows="2"
                            :rules="namesRule"></v-textarea>
                    </td>
                    <td>
                        <v-textarea label="enter new data's list" v-model="newMarks" rows="2"></v-textarea>
                    </td>
                </tr>

            </tbody>

        </v-table>
        <div class="flex justify-center ">
            <v-btn class="mx-4" @click="addNewData" variant="tonal" color="light-green-lighten-4"
                :disabled="!newStudents">Add data</v-btn>
            <v-btn class="mx-4" @click="clearTable" variant="tonal" color="red-lighten-4">clear</v-btn>
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



let newStudents = ref('');
let newMarks = ref('')


const addNewData = () => {
    const newStudentsArray = newStudents.value.split('\n')
    const newMarksArray = newMarks.value.split('\n')

    newStudentsArray.forEach((el, i) => {
        if (el) {
            namesTable.value.tableData.push({
                name: el,
                fieldOne: newMarksArray[i],
            })
        }
    })
    newStudents.value = newMarks.value = "";
}

const clearTable = () => {
    namesTable.value.tableData = []
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