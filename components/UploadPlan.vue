<template>
    <v-card>
        <v-card-text>
            <p class="my-4">Upload a plan file (json) :</p>
            <v-file-input clearable accept="application/json" label="Drag your json file here"
                v-model="file"></v-file-input>
            <p id="status" v-if="!file.length">Please select a file</p>
        </v-card-text>
    </v-card>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
import { useAlertStore } from '~/store/alertStore'
const PlanStore = usePlanStore();
const alertStore = useAlertStore();
const emit = defineEmits(["closeDialog"])

const file = ref([]);

const uploadFile = () => {
    const uploadedFile = file.value[0]
// Check if the selected file is not a JSON file
    const isJson = uploadedFile?.type === "application/json" || uploadedFile.name.endsWith(".json");
    if (!isJson) {
        alertStore.createAlert('error', 'Please upload a JSON file')
        file.value = [];
        return;
    }
     // Read the file content and validate it then add it to the store
    const reader = new FileReader()
    reader.readAsText(uploadedFile, 'UTF-8')
    reader.onload = function (evt) {
        const jsonContent = evt.target.result

        if (PlanStore.uploadPlan(JSON.parse(jsonContent))) {
            alertStore.createAlert('success', 'Plan uploaded successfully')
            setTimeout(() => {
                emit('closeDialog');
                if (useRoute().fullPath !== "/playground") useRouter().push({ path: "/playground" })
            }, 1500);
        }
        else {
            alertStore.createAlert('error', 'Json file is not valid')
        }
    }
    reader.onerror = function (evt) {
        alertStore.createAlert('error', 'Error reading the file')
    }

}
watch(file, () => {
    uploadFile()
})

</script>