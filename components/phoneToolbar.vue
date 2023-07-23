<template>
    <v-toolbar density="compact" color="blue-darken-1" class="">
        <v-slider v-model="zoom" append-icon="mdi-magnify-plus-outline" prepend-icon="mdi-magnify-minus-outline" step="10"
            @click:append="zoom += 10" @click:prepend="zoom -= 10"></v-slider>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{ planStore.plans[planStore.currentPlanIndex].planName }}</v-toolbar-title>
    </v-toolbar>
</template>
<script setup>
import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])


const zoom = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

</script>