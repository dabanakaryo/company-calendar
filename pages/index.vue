<template>
    <div class="space-y-8">
      <!-- ページタイトル -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">
          社内予定表へようこそ！
        </h2>
        <p class="text-lg text-gray-600">
          チームの予定を簡単に管理できます
        </p>
      </div>
  
      <!-- クイックアクション -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- カレンダーを見る -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="text-4xl mb-4">📅</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              カレンダーを見る
            </h3>
            <p class="text-gray-600 mb-4">
              月・週・日単位で予定を確認できます
            </p>
            <NuxtLink 
              to="/calendar"
              class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              カレンダーを開く
            </NuxtLink>
          </div>
        </div>
  
        <!-- 新規予定を作成 -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="text-4xl mb-4">➕</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              新規予定を作成
            </h3>
            <p class="text-gray-600 mb-4">
              会議や打ち合わせの予定を登録できます
            </p>
            <NuxtLink 
              to="/schedule/new"
              class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              予定を作成
            </NuxtLink>
          </div>
        </div>
  
        <!-- 今日の予定 -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="text-center">
            <div class="text-4xl mb-4">📋</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              今日の予定
            </h3>
            <p class="text-gray-600 mb-4">
              本日予定されている会議やイベント
            </p>
            <!-- 後でここに今日の予定一覧を表示します -->
            <div class="text-sm text-gray-500">
              {{ todayDate }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- 最近の予定（将来的に実装） -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          📌 機能について
        </h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 class="font-semibold text-gray-800 mb-2">✅ 実装済み機能</h4>
            <ul class="space-y-1">
              <li>• 基本レイアウト</li>
              <li>• ページ間のナビゲーション</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-2">🚧 実装予定機能</h4>
            <ul class="space-y-1">
              <li>• カレンダー表示</li>
              <li>• 予定の登録・編集・削除</li>
              <li>• 予定の検索・フィルター</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // ページのメタ情報を設定
  useHead({
    title: 'ホーム | 社内予定表',
    meta: [
      { name: 'description', content: '社内予定表アプリのホームページです' }
    ]
  })
  
  // 今日の日付を取得して表示
  const todayDate = computed(() => {
    const today = new Date()
    return today.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  })
  </script>