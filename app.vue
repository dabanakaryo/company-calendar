<template>
  <div>
    <!-- アクセシビリティ用（画面読み上げソフト対応） -->
    <NuxtRouteAnnouncer />
    
    <!-- 全ページで共通のレイアウトを適用 -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// アプリ全体の設定
useHead({
  htmlAttrs: {
    lang: 'ja'
  }
})
</script>