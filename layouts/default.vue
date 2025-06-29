<template>
    <div class="min-h-screen bg-gray-50">
      <!-- ヘッダー部分 -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <!-- アプリタイトル -->
            <h1 class="text-2xl font-bold text-gray-800">
              📅 社内予定表
            </h1>
            
            <!-- ナビゲーションメニュー -->
            <nav class="flex space-x-4">
              <NuxtLink 
                to="/" 
                class="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                :class="$route.path === '/' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
              >
                ホーム
              </NuxtLink>
              <NuxtLink 
                to="/calendar" 
                class="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                :class="$route.path === '/calendar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
              >
                カレンダー
              </NuxtLink>
              <NuxtLink 
                to="/schedules" 
                class="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                :class="$route.path === '/schedules' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
              >
                予定一覧
              </NuxtLink>
              <NuxtLink 
                to="/schedule/new" 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + 新規予定
              </NuxtLink>
            </nav>
          </div>
        </div>
      </header>
  
      <!-- メインコンテンツ部分 -->
      <main class="max-w-6xl mx-auto px-4 py-6">
        <!-- ここに各ページの内容が表示される -->
        <slot />
      </main>
  
      <!-- フッター部分 -->
      <footer class="bg-white border-t mt-12">
        <div class="max-w-6xl mx-auto px-4 py-4 text-center text-gray-600">
          <p>&copy; 2025 社内予定表アプリ</p>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  // このファイルには特別なJavaScriptは必要ありません
  // Nuxt3が自動的にレイアウトとして認識します
  </script>
  
  <style scoped>
  /* このファイル専用のスタイル */
  /* 現在は特別なスタイルは不要です */
  </style>