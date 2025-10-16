    import { useLocale } from 'vuetify'
export default defineNuxtRouteMiddleware((to) => {
    const { current } = useLocale()
 const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const lang = to.query.lang as string | undefined
    current.value = 'en'

  if (lang == "ar") {
    i18n.setLocale(lang)
    current.value = 'ar'
  }

})
