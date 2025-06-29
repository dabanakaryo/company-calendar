<template>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- 時間軸とヘッダー -->
      <div class="grid grid-cols-8 border-b border-gray-200">
        <!-- 時間列のヘッダー -->
        <div class="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50 border-r border-gray-200">
          時間
        </div>
        
        <!-- 日付ヘッダー -->
        <div 
          v-for="date in weekDates" 
          :key="date.dateString"
          :class="[
            'p-3 text-center border-r border-gray-200 bg-gray-50',
            date.isToday ? 'bg-blue-50' : ''
          ]"
        >
          <div class="text-xs text-gray-500">{{ date.dayName }}</div>
          <div 
            :class="[
              'text-lg font-semibold',
              date.isToday ? 'text-blue-600' : 'text-gray-800'
            ]"
          >
            {{ date.day }}
          </div>
        </div>
      </div>
  
      <!-- 週のスケジュールグリッド -->
      <div class="max-h-96 overflow-y-auto">
        <div class="grid grid-cols-8">
          <!-- 時間軸 -->
          <div class="border-r border-gray-200">
            <div 
              v-for="hour in hours" 
              :key="hour"
              class="h-16 flex items-center justify-center text-xs text-gray-500 border-b border-gray-100"
            >
              {{ hour }}:00
            </div>
          </div>
  
          <!-- 各日のスケジュール -->
          <div 
            v-for="date in weekDates" 
            :key="date.dateString"
            class="border-r border-gray-200"
          >
            <div 
              v-for="hour in hours" 
              :key="`${date.dateString}-${hour}`"
              :class="[
                'h-16 border-b border-gray-100 p-1 cursor-pointer hover:bg-gray-50 transition-colors relative',
                date.isToday ? 'bg-blue-25' : ''
              ]"
              @click="onTimeSlotClick(date, hour)"
            >
              <!-- サンプル予定（後でFirebaseから取得したデータに置き換え） -->
              <div 
                v-if="getSampleEvent(date, hour)" 
                :class="[
                  'absolute inset-1 rounded text-xs p-1',
                  getSampleEvent(date, hour).color
                ]"
              >
                {{ getSampleEvent(date, hour).title }}
              </div>
            </div>
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
  const emit = defineEmits(['time-slot-click'])
  
  // 時間の配列（9時から18時まで）
  const hours = Array.from({ length: 10 }, (_, i) => i + 9)
  
  // 週の日付データを計算
  const weekDates = computed(() => {
    const dates = []
    const startOfWeek = new Date(props.currentDate)
    
    // その週の日曜日を取得
    const dayOfWeek = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)
    
    // 今日の日付
    const today = new Date()
    const todayString = today.toDateString()
    
    // 7日分の日付を生成
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      
      const dayNames = ['日', '月', '火', '水', '木', '金', '土']
      
      dates.push({
        date: date,
        day: date.getDate(),
        dayName: dayNames[date.getDay()],
        dateString: date.toDateString(),
        isToday: date.toDateString() === todayString
      })
    }
    
    return dates
  })
  
  // サンプル予定データ（後でFirebaseから取得）
  const getSampleEvent = (date, hour) => {
    // 今日の14時にサンプル会議
    if (date.isToday && hour === 14) {
      return {
        title: 'チーム会議',
        color: 'bg-blue-100 text-blue-800'
      }
    }
    
    // 明日の10時にサンプル打合せ
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (date.dateString === tomorrow.toDateString() && hour === 10) {
      return {
        title: 'プロジェクト打合せ',
        color: 'bg-green-100 text-green-800'
      }
    }
    
    return null
  }
  
  // 時間スロットクリック時の処理
  const onTimeSlotClick = (date, hour) => {
    emit('time-slot-click', { date, hour })
  }
  </script>