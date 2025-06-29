// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // 既存のモジュールに @nuxtjs/tailwindcss を追加
  modules: [
    '@nuxt/eslint', 
    '@nuxt/icon', 
    '@nuxt/ui',
    '@nuxtjs/tailwindcss'  // ← この行を追加
  ],
  
  // CSS設定を追加
  css: ['~/assets/css/main.css'],
  
  // アプリケーション設定を追加
  app: {
    head: {
      title: '社内予定表',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '社内向けの予定表アプリケーション' }
      ]
    }
  }
})