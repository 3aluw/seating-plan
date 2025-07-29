<template>
  <div>
<!--  Unused viewMode option   
      <div class="flex justify-center mt-4" v-if="phoneBreakpoint">
      <v-chip prepend-icon="mdi-eye-outline" variant="outlined"> View mode
        <v-tooltip activator="parent" location="bottom">You can't use all features on a small screen</v-tooltip>
      </v-chip>
    </div> -->
    <NuxtPage />
      <div class="alert-cont" v-if="alertStore.alert">
        <v-alert max-width="30rem" :title="alertStore.alert.text" :type="alertStore.alert.type" />
      </div>
  </div>
</template>
<script setup>
import { useAlertStore } from '~/store/alertStore';
const alertStore = useAlertStore()

/* Unused viewMode option logic
 import { useBreakpoints } from '@vueuse/core'
import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();

const breakpoints = useBreakpoints({

  tablet: 640,
})
const phoneBreakpoint = breakpoints.smallerOrEqual('tablet')

watch(phoneBreakpoint, () => {
  planStore.viewMode = phoneBreakpoint.value

}) */



</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.alert-cont {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    z-index: 5000;
}

@media screen and (max-width: 640px) {
  html {
    font-size: 14px;
  }
}
</style>
