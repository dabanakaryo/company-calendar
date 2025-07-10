// Firebase SDK をインポート
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Nuxtプラグインとして登録
export default defineNuxtPlugin(() => {
  // プラグイン内で環境変数を取得
  const config = useRuntimeConfig()
  
  // 環境変数からFirebase設定を取得
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }

  // Firebase アプリを初期化
  const app = initializeApp(firebaseConfig)

  // Firestore データベースを初期化
  const db = getFirestore(app)

  // 開発環境でのデバッグ用
  if (import.meta.env.DEV) {
    console.log('🔥 Firebase接続完了!')
    console.log('📊 Firestore準備完了')
    console.log('🌍 プロジェクトID:', firebaseConfig.projectId)
  }

  // グローバルに使用できるように提供
  return {
    provide: {
      db
    }
  }
})