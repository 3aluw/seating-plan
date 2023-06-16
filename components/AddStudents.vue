<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">Names</th>
                <th class="text-left"><v-text-field :rules="nameCriteriaRule" :counter="10" max="5"
                        label="Add a criteria ie: Marks ..." v-model="fieldOne"></v-text-field> </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="student in students" :key="student.name">
                <td>{{ student.name }}</td>
                <td>{{ student.fieldOne }}</td>
            </tr>
            <tr>
                <td>
                    <v-textarea label="enter new students' list" v-model="newStudents"></v-textarea>
                </td>
                <td>
                    <v-textarea label="enter new marks'list" v-model="newMarks"></v-textarea>
                </td>
            </tr>
        </tbody>
    </v-table>
    <v-btn @click="addNewData">Add data</v-btn>
</template>

<script setup>

let students = ref([])
let newStudents = ref('');
let newMarks = ref('')
let fieldOne = ref('')

const addNewData = () => {
    const newStudentsArray = newStudents.value.split('\n')
    const newMarksArray = newMarks.value.split('\n')
    newStudentsArray.forEach((el, i) => {
        students.value.push({
            name: el,
            fieldOne: newMarksArray[i],
        })
    })
}


/*From rule */
const nameCriteriaRule = [
    value => {
        if (value?.length <= 10) return true

        return 'Name must be less than 10 characters.'
    },
]
console.log(nameCriteriaRule[0]())
</script>