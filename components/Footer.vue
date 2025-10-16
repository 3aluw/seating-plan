<template>
    <div class="cont border-t-2 border-slate-300 bg-stone-100 text-center p-5 mt-8">
        <i18n-t class="pt-5" keypath="footer.builtBy" tag="p">
            <a href="https://portfolio-3aluw.vercel.app/" rel="noopener" target="_blank"
                class="underline text-blue-600">{{
                    $t("footer.dev") }}</a>
        </i18n-t>
        <p class="pt-2" v-if="locale === 'en'">
            If you feel like it, buy me a <a href="https://buymeacoffee.com/3aluw" rel="noopener" target="_blank"
                class="underline text-blue-600">coffee</a> and make my day! ☕️💛
        </p>
    </div>
</template>
<script setup>
const { locale } = useI18n()
</script>
