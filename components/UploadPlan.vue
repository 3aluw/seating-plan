<template>
    <v-card>
        <v-card-text>
            <p class="my-4">Upload a plan file (json) :</p>
            <v-file-input accept="json/*" label="Drag your json file here" v-model="file"></v-file-input>
            <p id="status"></p>
        </v-card-text>
    </v-card>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
const PlanStore = usePlanStore();

const emit = defineEmits(["closeDialog"])

const file = ref([]);

const uploadFile = () => {
    const uploadedFile = file.value[0]

    if (uploadedFile) {
        const reader = new FileReader()
        reader.readAsText(uploadedFile, 'UTF-8')
        reader.onload = function (evt) {
            const jsonContent = evt.target.result


            if (PlanStore.uploadPlan(JSON.parse(jsonContent))) {
                document.getElementById(
                    'status'
                ).textContent = `DONE...`

                setTimeout(() => {
                    emit('closeDialog');
                    if (useRoute().fullPath !== "/playgroundOne") useRouter().push({ path: "/playgroundOne" })
                }, 1500);
                PlanStore.currentPlanIndex = PlanStore.plans.length - 1

            }
            else {
                document.getElementById(
                    'status'
                ).textContent = `Unsupported json file`
            }
        }
        reader.onerror = function (evt) {
            document.getElementById('status').textContent =
                'Error reading the file'
        }
    } else {
        document.getElementById('status').textContent = 'Please select a file'
    }
}
watch(file, () => {
    uploadFile()
})

</script>