<template>
    <div class="space-y-6">
      <!-- ページヘッダー -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">
          📅 カレンダー
        </h2>
        
        <!-- 表示切り替えボタン -->
        <div class="flex rounded-lg border border-gray-300 overflow-hidden">
          <button 
            @click="currentView = 'month'"
            :class="currentView === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
            class="px-4 py-2 hover:bg-blue-50 transition-colors"
          >
            月
          </button>
          <button 
            @click="currentView = 'week'"
            :class="currentView === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
            class="px-4 py-2 hover:bg-blue-50 transition-colors border-l border-gray-300"
          >
            週
          </button>
          <button 
            @click="currentView = 'day'"
            :class="currentView === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
            class="px-4 py-2 hover:bg-blue-50 transition-colors border-l border-gray-300"
          >
            日
          </button>
        </div>
      </div>
  
      <!-- 月・年の表示と移動ボタン -->
      <div class="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <button 
          @click="goToPreviousPeriod"
          class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span class="mr-2">←</span>
          前の{{ getViewLabel }}
        </button>
        
        <h3 class="text-xl font-semibold text-gray-800">
          {{ currentDateDisplay }}
        </h3>
        
        <button 
          @click="goToNextPeriod"
          class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          次の{{ getViewLabel }}
          <span class="ml-2">→</span>
        </button>
      </div>
  
      <!-- 今日に戻るボタン -->
      <div class="flex justify-center">
        <button 
          @click="goToToday"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          📍 今日に戻る
        </button>
      </div>
  
      <!-- カレンダー表示エリア -->
      <div class="min-h-96">
        <!-- 月表示 -->
        <MonthView 
          v-if="currentView === 'month'" 
          :current-date="currentDate"
          @date-click="onDateClick"
          @schedule-click="onScheduleClick"
          @add-schedule-click="onAddScheduleClick"
        />
  
        <!-- 週表示 -->
        <WeekView 
          v-else-if="currentView === 'week'" 
          :current-date="currentDate"
          @time-slot-click="onTimeSlotClick"
        />
  
        <!-- 日表示 -->
        <DayView 
          v-else 
          :current-date="currentDate"
          @time-slot-click="onTimeSlotClick"
          @add-event-click="onAddEventClick"
          @schedule-click="onScheduleClick"
        />
      </div>
  
      <!-- 新規予定作成ボタン -->
      <div class="text-center">
        <NuxtLink 
          to="/schedule/new"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <span class="mr-2">➕</span>
          新しい予定を作成
        </NuxtLink>
      </div>
  
      <!-- 操作ヒント -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-semibold text-blue-800 mb-2">💡 操作ヒント</h4>
        <div class="text-sm text-blue-700 space-y-1">
          <p v-if="currentView === 'month'">
            • 日付をクリックすると、その日の詳細予定を確認できます
          </p>
          <p v-else-if="currentView === 'week'">
            • 時間枠をクリックすると、その時間帯に予定を作成できます
          </p>
          <p v-else>
            • 時間枠をクリックして予定を作成、または「この日に予定を追加」ボタンを使用してください
          </p>
          <p>• 表示形式は上部のボタンで切り替えできます</p>
          <p>• 矢印ボタンで前後の期間に移動できます</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // ページのメタ情報を設定
  useHead({
    title: 'カレンダー | 社内予定表',
    meta: [
      { name: 'description', content: '予定をカレンダー形式で確認できます' }
    ]
  })
  
  // コンポーネントのインポート
  import MonthView from '~/components/calendar/MonthView.vue'
  import WeekView from '~/components/calendar/WeekView.vue'
  import DayView from '~/components/calendar/DayView.vue'
  
  // リアクティブなデータ
  const currentView = ref('month') // 'month', 'week', 'day'
  const currentDate = ref(new Date())
  
  // 計算されたプロパティ
  const getViewLabel = computed(() => {
    switch (currentView.value) {
      case 'month': return '月'
      case 'week': return '週'
      case 'day': return '日'
      default: return '月'
    }
  })
  
  const currentDateDisplay = computed(() => {
    const date = currentDate.value
    
    if (currentView.value === 'month') {
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long' 
      })
    } else if (currentView.value === 'week') {
      // 週の開始日と終了日を計算
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      return `${startOfWeek.getMonth() + 1}月${startOfWeek.getDate()}日 〜 ${endOfWeek.getMonth() + 1}月${endOfWeek.getDate()}日`
    } else {
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      })
    }
  })
  
  // メソッド
  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate.value)
    
    if (currentView.value === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (currentView.value === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    
    currentDate.value = newDate
  }
  
  const goToNextPeriod = () => {
    const newDate = new Date(currentDate.value)
    
    if (currentView.value === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (currentView.value === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    
    currentDate.value = newDate
  }
  
  const goToToday = () => {
    currentDate.value = new Date()
  }
  
  // イベントハンドラー
  const onDateClick = (dateInfo) => {
    // 月表示で日付をクリックした時の処理
    currentDate.value = dateInfo.date
    currentView.value = 'day' // 日表示に切り替え
  }
  
  const onTimeSlotClick = (timeInfo) => {
    // 時間枠をクリックした時の処理
    console.log('時間枠がクリックされました:', timeInfo)
    
    // 将来的にここで新規予定作成ページに移動
    // 選択した日時の情報を渡す
    navigateTo({
      path: '/schedule/new',
      query: {
        date: timeInfo.date.toISOString().split('T')[0],
        time: `${timeInfo.hour}:00`
      }
    })
  }
  
  const onAddEventClick = (date) => {
    // 予定追加ボタンをクリックした時の処理
    console.log('予定追加がクリックされました:', date)
    
    navigateTo({
      path: '/schedule/new',
      query: {
        date: date.toISOString().split('T')[0]
      }
    })
  }
  
  const onScheduleClick = (schedule) => {
    // 予定をクリックした時の処理 - 編集ページに移動
    console.log('予定がクリックされました:', schedule)
    
    navigateTo(`/schedule/${schedule.id}`)
  }
  
  const onAddScheduleClick = (date) => {
    // 月表示でプラスボタンをクリックした時の処理
    onAddEventClick(date.date)
  }
  </script>