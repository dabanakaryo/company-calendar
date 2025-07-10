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

  // 環境変数の設定を追加
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
    }
  },
  
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