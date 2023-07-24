
<template>
    <v-dialog v-model="showPrintDialog" width="auto" maxWidth="90vw" minWidth="19rem">
        <v-card class="px-4 py-4">

            <p class="mb-4 text-center">chose a zoom value before printing</p>
            <v-slider v-model="zoom" append-icon="mdi-magnify-plus-outline" prepend-icon="mdi-magnify-minus-outline"
                @click:append="zoom += 5" @click:prepend="zoom -= 5" hide-details :max="100" :min="30"></v-slider>
            <span class="text-h4 font-weight-light text-center" v-text="usedZoom"></span>
            <v-card-actions>
                <v-btn color="blue-darken-4" block variant="tonal" @click="PrintEmit">print</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'printEmit'])

const showPrintDialog = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const zoom = ref(70)
const usedZoom = computed(() => `${zoom.value.toFixed(0)}%`)

const PrintEmit = () => {
    showPrintDialog.value = false
    emit('printEmit', usedZoom.value)
}

</script>