<template>
       <nav v-if="props.pageType ==='home'" class="flex justify-around  max-[600px]:flex-col max-[600px]:items-center">
            <NuxtLink :to="{ name: 'playground', query: route.query }"> <v-btn variant="text">{{ $t('basic.playground') }}</v-btn></NuxtLink>

            <v-dialog v-model="UploadDialog" width="auto" min-width="400px" scrim="#396638">
                <template v-slot:activator="{ props }">
                    <div class="flex justify-center"> <v-btn variant="text" v-bind="props">{{ $t('basic.uploadPlan')
                    }}</v-btn>
                    </div>
                </template>
                <UploadPlan @closeDialog="UploadDialog = false" />
            </v-dialog>

            <v-btn @click="emit('openDialog')" variant="text">{{ $t('basic.createPlan') }}</v-btn>
        </nav>

     <nav v-else-if="props.pageType ==='playground'" class="navbar flex justify-around py-8 flex-wrap">
            <NuxtLink to="/"> <v-btn variant="plain">{{ $t('basic.home') }}</v-btn></NuxtLink>

            <v-dialog v-model="UploadDialog" width="auto" min-width="400px">
                <template v-slot:activator="{ props }">
                    <v-btn variant="plain" v-bind="props">{{ $t('basic.uploadPlan') }}</v-btn>
                </template>
                <UploadPlan @closeDialog="UploadDialog = false" />
            </v-dialog>

            <v-btn variant="plain" @click="emit('openDialog')">{{ $t('playgroundPage.changePlan') }}</v-btn>
        </nav>
</template>
<script setup lang="ts">
const route = useRoute()
const props = defineProps<
{pageType:"home"|"playground"}>()


    const emit = defineEmits(['openDialog'])
    let UploadDialog = ref(false);
</script>