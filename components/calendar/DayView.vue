<template>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- 日付ヘッダー -->
      <div class="bg-gray-50 p-4 border-b border-gray-200">
        <div class="text-center">
          <div class="text-sm text-gray-500 mb-1">
            {{ dayInfo.dayName }}曜日
          </div>
          <div class="text-2xl font-bold text-gray-800">
            {{ dayInfo.day }}日
          </div>
          <div class="text-sm text-gray-600">
            {{ dayInfo.monthYear }}
          </div>
          
          <!-- その日の予定数 -->
          <div class="text-xs text-blue-600 mt-2">
            📅 {{ daySchedules.length }}件の予定
          </div>
        </div>
      </div>
  
      <!-- 1日のスケジュール -->
      <div class="max-h-96 overflow-y-auto">
        <div class="grid grid-cols-12">
          <!-- 時間軸 -->
          <div class="col-span-2 border-r border-gray-200">
            <div 
              v-for="hour in hours" 
              :key="hour"
              class="h-20 flex items-center justify-center text-sm text-gray-500 border-b border-gray-100"
            >
              {{ hour }}:00
            </div>
          </div>
  
          <!-- スケジュール表示エリア -->
          <div class="col-span-10">
            <div 
              v-for="hour in hours" 
              :key="hour"
              :class="[
                'h-20 border-b border-gray-100 p-2 cursor-pointer hover:bg-gray-50 transition-colors relative',
                isCurrentHour(hour) ? 'bg-yellow-50' : ''
              ]"
              @click="onTimeSlotClick(hour)"
            >
              <!-- 実際の予定表示 -->
              <div 
                v-for="schedule in getSchedulesForHour(hour)" 
                :key="schedule.id"
                :class="[
                  'absolute inset-2 rounded-lg p-3 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow',
                  getColorClass(schedule.color)
                ]"
                @click.stop="onScheduleClick(schedule)"
              >
                <div class="font-semibold text-sm">
                  {{ schedule.title }}
                </div>
                <div class="text-xs mt-1 text-gray-600">
                  {{ getScheduleTimeText(schedule) }}
                </div>
                <div v-if="schedule.description" class="text-xs mt-1 text-gray-600 truncate">
                  {{ schedule.description }}
                </div>
                <div v-if="schedule.participants" class="text-xs mt-1 text-gray-500 truncate">
                  👥 {{ schedule.participants }}
                </div>
              </div>
  
              <!-- 予定がない時間の表示 -->
              <div v-if="getSchedulesForHour(hour).length === 0" class="text-xs text-gray-400">
                {{ hour }}:00 - {{ hour + 1 }}:00
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 終日予定の表示 -->
      <div v-if="allDaySchedules.length > 0" class="p-4 bg-blue-50 border-t border-gray-200">
        <h4 class="text-sm font-semibold text-gray-800 mb-2">📅 終日の予定</h4>
        <div class="space-y-2">
          <div 
            v-for="schedule in allDaySchedules" 
            :key="schedule.id"
            :class="[
              'p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-sm transition-shadow',
              getColorClass(schedule.color)
            ]"
            @click="onScheduleClick(schedule)"
          >
            <div class="font-semibold text-sm">{{ schedule.title }}</div>
            <div v-if="schedule.description" class="text-xs mt-1 text-gray-600">
              {{ schedule.description }}
            </div>
            <div v-if="schedule.participants" class="text-xs mt-1 text-gray-500">
              👥 {{ schedule.participants }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- 予定追加ボタン -->
      <div class="p-4 bg-gray-50 border-t border-gray-200">
        <button
          @click="onAddEventClick"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          + この日に予定を追加
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  // プロパティの定義
  const props = defineProps({
    currentDate: {
      type: Date,
      required: true
    }
  })
  
  // イベントの定義
  const emit = defineEmits(['time-slot-click', 'add-event-click', 'schedule-click'])
  
  // 予定データを取得
  const { schedules, fetchSchedules, getSchedulesForDate } = useSchedules()
  
  // 時間の配列（8時から20時まで）
  const hours = Array.from({ length: 13 }, (_, i) => i + 8)
  
  // コンポーネントがマウントされた時に予定データを取得
  onMounted(async () => {
    await fetchSchedules()
  })
  
  // 現在の日付が変更された時に予定データを再取得
  watch(() => props.currentDate, async () => {
    await fetchSchedules()
  })
  
  // 日付情報を計算
  const dayInfo = computed(() => {
    const date = props.currentDate
    const dayNames = ['日', '月', '火', '水', '木', '金', '土']
    
    return {
      day: date.getDate(),
      dayName: dayNames[date.getDay()],
      monthYear: date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long' 
      })
    }
  })
  
  // その日の予定を取得
  const daySchedules = computed(() => {
    return getSchedulesForDate(props.currentDate)
  })
  
  // 終日予定を取得
  const allDaySchedules = computed(() => {
    return daySchedules.value.filter(schedule => schedule.allDay)
  })
  
  // 時間予定を取得
  const timeSchedules = computed(() => {
    return daySchedules.value.filter(schedule => !schedule.allDay)
  })
  
  // 現在の時間かどうかを判定
  const isCurrentHour = (hour) => {
    const now = new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const currentDate = new Date(props.currentDate)
    currentDate.setHours(0, 0, 0, 0)
    
    // 今日の場合のみ現在時刻をハイライト
    if (today.getTime() === currentDate.getTime()) {
      return now.getHours() === hour
    }
    
    return false
  }
  
  // 特定の時間の予定を取得
  const getSchedulesForHour = (hour) => {
    return timeSchedules.value.filter(schedule => {
      const scheduleHour = schedule.start.getHours()
      return scheduleHour === hour
    })
  }
  
  // 予定の色クラスを取得
  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-400',
      green: 'bg-green-50 border-green-400',
      red: 'bg-red-50 border-red-400',
      yellow: 'bg-yellow-50 border-yellow-400',
      purple: 'bg-purple-50 border-purple-400',
      gray: 'bg-gray-50 border-gray-400'
    }
    return colorMap[color] || colorMap.blue
  }
  
  // 予定の時間テキストを取得
  const getScheduleTimeText = (schedule) => {
    if (schedule.allDay) return '終日'
    
    const startTime = schedule.start.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    const endTime = schedule.end.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    return `${startTime} - ${endTime}`
  }
  
  // イベントハンドラー
  const onTimeSlotClick = (hour) => {
    emit('time-slot-click', { date: props.currentDate, hour })
  }
  
  const onAddEventClick = () => {
    emit('add-event-click', props.currentDate)
  }
  
  const onScheduleClick = (schedule) => {
    emit('schedule-click', schedule)
  }
  </script>