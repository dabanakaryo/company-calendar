<template>
    <div class="bg-white rounded-lg shadow-sm">
      <!-- 曜日ヘッダー -->
      <div class="grid grid-cols-7 border-b border-gray-200">
        <div 
          v-for="day in weekDays" 
          :key="day"
          class="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50"
        >
          {{ day }}
        </div>
      </div>
  
      <!-- カレンダーグリッド -->
      <div class="grid grid-cols-7">
        <div
          v-for="date in calendarDates"
          :key="date.dateString"
          :class="[
            'min-h-24 p-2 border-b border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
            date.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
            date.isToday ? 'bg-blue-50' : '',
            'relative'
          ]"
          @click="onDateClick(date)"
        >
          <!-- 日付表示 -->
          <div 
            :class="[
              'text-sm font-medium mb-1',
              date.isCurrentMonth ? 'text-gray-800' : 'text-gray-400',
              date.isToday ? 'text-blue-600 font-bold' : ''
            ]"
          >
            {{ date.day }}
          </div>
  
          <!-- 今日のマーカー -->
          <div 
            v-if="date.isToday" 
            class="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"
          ></div>
  
          <!-- 実際の予定表示 -->
          <div class="space-y-1">
            <div 
              v-for="schedule in getSchedulesForDate(date.date)" 
              :key="schedule.id"
              :class="[
                'text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:shadow-sm transition-shadow',
                getColorClass(schedule.color)
              ]"
              :title="`${schedule.title}\n${getScheduleTimeText(schedule)}\n${schedule.description || ''}`"
              @click.stop="onScheduleClick(schedule)"
            >
              <div class="flex items-center">
                <span class="mr-1">{{ getScheduleIcon(schedule) }}</span>
                <span class="truncate">{{ schedule.title }}</span>
              </div>
            </div>
            
            <!-- 予定が多い場合の省略表示 -->
            <div 
              v-if="getSchedulesForDate(date.date).length > 3"
              class="text-xs text-gray-500 text-center"
            >
              +{{ getSchedulesForDate(date.date).length - 3 }}件
            </div>
          </div>
  
          <!-- 予定がない日のプラスボタン -->
          <div 
            v-if="date.isCurrentMonth && getSchedulesForDate(date.date).length === 0"
            class="absolute bottom-1 right-1 opacity-0 hover:opacity-100 transition-opacity"
          >
            <button
              @click.stop="onAddScheduleClick(date)"
              class="w-5 h-5 bg-gray-200 hover:bg-blue-200 rounded-full flex items-center justify-center text-xs text-gray-600 hover:text-blue-600"
              title="予定を追加"
            >
              +
            </button>
          </div>
        </div>
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
  const emit = defineEmits(['date-click', 'schedule-click', 'add-schedule-click'])
  
  // 予定データを取得
  const { schedules, fetchSchedules, getSchedulesForDate: getSchedulesForDateFromComposable } = useSchedules()
  
  // 曜日の配列
  const weekDays = ['日', '月', '火', '水', '木', '金', '土']
  
  // コンポーネントがマウントされた時に予定データを取得
  onMounted(async () => {
    await fetchSchedules()
  })
  
  // 現在の月が変更された時に予定データを再取得
  watch(() => props.currentDate, async () => {
    await fetchSchedules()
  })
  
  // カレンダーの日付データを計算
  const calendarDates = computed(() => {
    const dates = []
    const year = props.currentDate.getFullYear()
    const month = props.currentDate.getMonth()
    
    // 月の最初の日と最後の日を取得
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    // カレンダーの開始日（月の最初の週の日曜日）
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay())
    
    // カレンダーの終了日（月の最後の週の土曜日）
    const endDate = new Date(lastDay)
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()))
    
    // 今日の日付
    const today = new Date()
    const todayString = today.toDateString()
    
    // 日付を生成
    const currentDateIter = new Date(startDate)
    while (currentDateIter <= endDate) {
      const dateObj = {
        date: new Date(currentDateIter),
        day: currentDateIter.getDate(),
        dateString: currentDateIter.toDateString(),
        isCurrentMonth: currentDateIter.getMonth() === month,
        isToday: currentDateIter.toDateString() === todayString
      }
      dates.push(dateObj)
      currentDateIter.setDate(currentDateIter.getDate() + 1)
    }
    
    return dates
  })
  
  // 特定の日の予定を取得
  const getSchedulesForDate = (date) => {
    return getSchedulesForDateFromComposable(date).slice(0, 3) // 最大3件まで表示
  }
  
  // 予定の色クラスを取得
  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border border-blue-200',
      green: 'bg-green-100 text-green-800 border border-green-200',
      red: 'bg-red-100 text-red-800 border border-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border border-purple-200',
      gray: 'bg-gray-100 text-gray-800 border border-gray-200'
    }
    return colorMap[color] || colorMap.blue
  }
  
  // 予定のアイコンを取得
  const getScheduleIcon = (schedule) => {
    if (schedule.allDay) return '📅'
    
    const hour = schedule.start.getHours()
    if (hour < 12) return '🌅'
    if (hour < 18) return '☀️'
    return '🌙'
  }
  
  // 予定の時間テキストを取得
  const getScheduleTimeText = (schedule) => {
    if (schedule.allDay) return '終日'
    
    const startTime = schedule.start.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    const endTime = schedule.end.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    return `${startTime} - ${endTime}`
  }
  
  // イベントハンドラー
  const onDateClick = (date) => {
    emit('date-click', date)
  }
  
  const onScheduleClick = (schedule) => {
    emit('schedule-click', schedule)
  }
  
  const onAddScheduleClick = (date) => {
    emit('add-schedule-click', date)
  }
  </script>