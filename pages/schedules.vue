<template>
    <div class="space-y-6">
      <!-- ページヘッダー -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">
          📋 予定一覧
        </h2>
        
        <div class="flex space-x-4">
          <!-- 新規作成ボタン -->
          <NuxtLink 
            to="/schedule/new"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 新規予定
          </NuxtLink>
          
          <!-- カレンダーに戻る -->
          <NuxtLink 
            to="/calendar"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            📅 カレンダー
          </NuxtLink>
        </div>
      </div>
  
      <!-- 統計情報 -->
      <div class="grid md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="text-2xl font-bold text-blue-600">{{ totalSchedules }}</div>
          <div class="text-sm text-gray-600">総予定数</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="text-2xl font-bold text-green-600">{{ todaySchedules }}</div>
          <div class="text-sm text-gray-600">今日の予定</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="text-2xl font-bold text-orange-600">{{ upcomingSchedules }}</div>
          <div class="text-sm text-gray-600">今後の予定</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="text-2xl font-bold text-purple-600">{{ thisMonthSchedules }}</div>
          <div class="text-sm text-gray-600">今月の予定</div>
        </div>
      </div>
  
      <!-- フィルター -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex flex-wrap gap-4 items-center">
          <div>
            <label class="text-sm font-medium text-gray-700 mr-2">表示期間:</label>
            <select 
              v-model="filterPeriod" 
              class="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">すべて</option>
              <option value="today">今日</option>
              <option value="week">今週</option>
              <option value="month">今月</option>
              <option value="upcoming">今後</option>
            </select>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-700 mr-2">色:</label>
            <select 
              v-model="filterColor" 
              class="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="">すべて</option>
              <option value="blue">ブルー</option>
              <option value="green">グリーン</option>
              <option value="red">レッド</option>
              <option value="yellow">イエロー</option>
              <option value="purple">パープル</option>
              <option value="gray">グレー</option>
            </select>
          </div>
          
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 予定名で検索..."
              class="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
        </div>
      </div>
  
      <!-- 読み込み中 -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">📄 予定を読み込み中...</div>
      </div>
  
      <!-- 予定一覧 -->
      <div v-else-if="filteredSchedules.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">📅</div>
        <div class="text-gray-500 mb-4">
          {{ searchQuery || filterPeriod !== 'all' || filterColor ? '条件に一致する予定がありません' : '予定がまだありません' }}
        </div>
        <NuxtLink 
          to="/schedule/new"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          最初の予定を作成しましょう
        </NuxtLink>
      </div>
  
      <!-- 予定リスト -->
      <div v-else class="space-y-4">
        <div 
          v-for="schedule in filteredSchedules" 
          :key="schedule.id"
          :class="[
            'bg-white rounded-lg shadow-sm border-l-4 p-4 hover:shadow-md transition-shadow cursor-pointer',
            getBorderColorClass(schedule.color)
          ]"
          @click="editSchedule(schedule.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <!-- 予定タイトル -->
              <h3 class="font-semibold text-gray-800 mb-2 flex items-center">
                <span class="mr-2">{{ getScheduleIcon(schedule) }}</span>
                {{ schedule.title }}
                <span 
                  v-if="isUpcoming(schedule)" 
                  class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                >
                  予定あり
                </span>
                <span 
                  v-if="isPast(schedule)" 
                  class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  完了
                </span>
              </h3>
  
              <!-- 日時情報 -->
              <div class="text-sm text-gray-600 mb-2">
                <span class="mr-4">
                  📅 {{ formatDate(schedule.start) }}
                </span>
                <span>
                  🕐 {{ getTimeText(schedule) }}
                </span>
              </div>
  
              <!-- 説明 -->
              <div v-if="schedule.description" class="text-sm text-gray-600 mb-2">
                💬 {{ schedule.description }}
              </div>
  
              <!-- 参加者 -->
              <div v-if="schedule.participants" class="text-sm text-gray-600">
                👥 {{ schedule.participants }}
              </div>
            </div>
  
            <!-- アクション -->
            <div class="flex space-x-2 ml-4">
              <button
                @click.stop="editSchedule(schedule.id)"
                class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="編集"
              >
                ✏️
              </button>
              <button
                @click.stop="confirmDelete(schedule)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="削除"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- ページネーション（将来的に実装） -->
      <div v-if="filteredSchedules.length > 0" class="text-center py-4 text-sm text-gray-500">
        {{ filteredSchedules.length }}件の予定を表示中
      </div>
  
      <!-- 削除確認ダイアログ -->
      <div 
        v-if="scheduleToDelete" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="scheduleToDelete = null"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            🗑️ 予定を削除しますか？
          </h3>
          <p class="text-gray-600 mb-6">
            「{{ scheduleToDelete.title }}」を削除します。<br>
            この操作は取り消せません。
          </p>
          <div class="flex space-x-4">
            <button
              @click="deleteSchedule"
              :disabled="isDeleting"
              class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              <span v-if="isDeleting">削除中...</span>
              <span v-else>削除する</span>
            </button>
            <button
              @click="scheduleToDelete = null"
              :disabled="isDeleting"
              class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-semibold"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // ページのメタ情報を設定
  useHead({
    title: '予定一覧 | 社内予定表',
    meta: [
      { name: 'description', content: '全ての予定を一覧表示します' }
    ]
  })
  
  // Composableを使用
  const { 
    schedules, 
    fetchSchedules, 
    deleteSchedule: removeSchedule,
    loading 
  } = useSchedules()
  
  // フィルター関連
  const filterPeriod = ref('all')
  const filterColor = ref('')
  const searchQuery = ref('')
  
  // 削除関連
  const scheduleToDelete = ref(null)
  const isDeleting = ref(false)
  
  // 初期化
  onMounted(async () => {
    await fetchSchedules()
  })
  
  // 統計情報の計算
  const totalSchedules = computed(() => schedules.value.length)
  
  const todaySchedules = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return schedules.value.filter(schedule => {
      const scheduleDate = new Date(schedule.start)
      scheduleDate.setHours(0, 0, 0, 0)
      return scheduleDate.getTime() === today.getTime()
    }).length
  })
  
  const upcomingSchedules = computed(() => {
    const now = new Date()
    return schedules.value.filter(schedule => schedule.start > now).length
  })
  
  const thisMonthSchedules = computed(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    
    return schedules.value.filter(schedule => {
      const scheduleDate = new Date(schedule.start)
      return scheduleDate.getFullYear() === year && scheduleDate.getMonth() === month
    }).length
  })
  
  // フィルタリングされた予定
  const filteredSchedules = computed(() => {
    let filtered = [...schedules.value]
    
    // 期間フィルター
    if (filterPeriod.value !== 'all') {
      const now = new Date()
      const today = new Date(now)
      today.setHours(0, 0, 0, 0)
      
      switch (filterPeriod.value) {
        case 'today':
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          filtered = filtered.filter(schedule => {
            const scheduleDate = new Date(schedule.start)
            scheduleDate.setHours(0, 0, 0, 0)
            return scheduleDate.getTime() === today.getTime()
          })
          break
          
        case 'week':
          const weekEnd = new Date(today)
          weekEnd.setDate(weekEnd.getDate() + 7)
          filtered = filtered.filter(schedule => schedule.start >= today && schedule.start <= weekEnd)
          break
          
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
          filtered = filtered.filter(schedule => schedule.start >= monthStart && schedule.start <= monthEnd)
          break
          
        case 'upcoming':
          filtered = filtered.filter(schedule => schedule.start > now)
          break
      }
    }
    
    // 色フィルター
    if (filterColor.value) {
      filtered = filtered.filter(schedule => schedule.color === filterColor.value)
    }
    
    // 検索フィルター
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(schedule => 
        schedule.title.toLowerCase().includes(query) ||
        (schedule.description && schedule.description.toLowerCase().includes(query)) ||
        (schedule.participants && schedule.participants.toLowerCase().includes(query))
      )
    }
    
    // 日時順でソート
    return filtered.sort((a, b) => a.start - b.start)
  })
  
  // ユーティリティ関数
  const formatDate = (date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }
  
  const getTimeText = (schedule) => {
    if (schedule.allDay) return '終日'
    
    const startTime = schedule.start.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    const endTime = schedule.end.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    return `${startTime} - ${endTime}`
  }
  
  const getScheduleIcon = (schedule) => {
    if (schedule.allDay) return '📅'
    
    const hour = schedule.start.getHours()
    if (hour < 12) return '🌅'
    if (hour < 18) return '☀️'
    return '🌙'
  }
  
  const getBorderColorClass = (color) => {
    const colorMap = {
      blue: 'border-blue-400',
      green: 'border-green-400',
      red: 'border-red-400',
      yellow: 'border-yellow-400',
      purple: 'border-purple-400',
      gray: 'border-gray-400'
    }
    return colorMap[color] || colorMap.blue
  }
  
  const isUpcoming = (schedule) => {
    const now = new Date()
    return schedule.start > now
  }
  
  const isPast = (schedule) => {
    const now = new Date()
    return schedule.end < now
  }
  
  // アクション
  const editSchedule = (id) => {
    navigateTo(`/schedule/${id}`)
  }
  
  const confirmDelete = (schedule) => {
    scheduleToDelete.value = schedule
  }
  
  const deleteSchedule = async () => {
    if (!scheduleToDelete.value) return
    
    try {
      isDeleting.value = true
      const result = await removeSchedule(scheduleToDelete.value.id)
      
      if (result.success) {
        scheduleToDelete.value = null
      }
    } catch (err) {
      console.error('削除エラー:', err)
    } finally {
      isDeleting.value = false
    }
  }
  </script>