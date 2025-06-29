// Firebase SDK をインポート
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase設定（とりあえずダミーデータで動作確認）
const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "company-calendar-demo",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "dummy-app-id"
}

// Firebase アプリを初期化
const app = initializeApp(firebaseConfig)

// Firestore データベースを初期化
const db = getFirestore(app)

// 開発環境でのデバッグ用
if (import.meta.env.DEV) {
  console.log('🔥 Firebase接続準備完了!')
  console.log('📊 Firestore初期化完了')
}

// グローバルに使用できるようにエクスポート
export { db }

// Nuxtプラグインとして登録
export default defineNuxtPlugin(() => {
  return {
    provide: {
      db
    }
  }
})