<template>
  <div>

    <div class="flex justify-center mt-4" v-if="phoneBreakpoint">
      <v-chip prepend-icon="mdi-eye-outline" variant="outlined"> View mode
        <v-tooltip activator="parent" location="bottom">You can't use all features on a small screen</v-tooltip>
      </v-chip>
    </div>
    <NuxtPage />
  </div>
</template>
<script setup>
import { useBreakpoints } from '@vueuse/core'
const breakpoints = useBreakpoints({

  tablet: 640,
})
const phoneBreakpoint = breakpoints.smallerOrEqual('tablet')


import { usePlanStore } from '~/store/planStore'
const planStore = usePlanStore();

watch(phoneBreakpoint, () => {
  planStore.viewMode = phoneBreakpoint
})

</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media screen and (max-width: 900px) {
  html {
    font-size: 14px;
  }
}
</style>
