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
const i18n = useI18n()
const { t } = i18n
useHead({
  title: t('head.title'),
  meta: [
    { name: 'description', content: t('head.description') },
    { property: 'og:title', content: t('head.title') },
    { property: 'og:description', content: t('head.description') },
    { property: 'og:image', content: 'https://seating-plan.vercel.app/ogImage.jpg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: 'https://seating-plan.vercel.app/' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }, // optional Twitter support
     { name: 'twitter:title', content: t('head.title') },
    { name: 'twitter:description', content: t('head.description') },
    { name: 'twitter:image', content: 'https://seating-plan.vercel.app/ogImage.jpg' },
  ],
  htmlAttrs: {
    lang: i18n.locale, // Dynamically set the lang attribute based on the current locale
    dir: i18n.localeProperties.value.dir, // Dynamically set the dir attribute based on the current locale
  },
});
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
