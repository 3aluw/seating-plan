export default defineNuxtRouteMiddleware((to) => {
 const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const lang = to.query.lang as string | undefined
  
  if (lang == "ar") {
    i18n.setLocale(lang)
  }
})
