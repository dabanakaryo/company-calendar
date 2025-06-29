<template>
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- ページヘッダー -->
      <div class="flex items-center space-x-4">
        <NuxtLink 
          to="/calendar"
          class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span class="mr-2">←</span>
          カレンダーに戻る
        </NuxtLink>
        <h2 class="text-2xl font-bold text-gray-800">
          📝 新しい予定を作成
        </h2>
      </div>
  
      <!-- エラーメッセージ -->
      <div 
        v-if="error" 
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
      >
        ❌ {{ error }}
      </div>
  
      <!-- 予定作成フォーム -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="createSchedule" class="space-y-6">
          <!-- 予定名 -->
          <div>
            <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
              予定名 <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              placeholder="例: チーム会議"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
  
          <!-- 日時設定 -->
          <div class="grid md:grid-cols-2 gap-4">
            <!-- 開始日時 -->
            <div>
              <label for="startDate" class="block text-sm font-semibold text-gray-700 mb-2">
                開始日時 <span class="text-red-500">*</span>
              </label>
              <input
                id="startDate"
                v-model="formData.startDate"
                type="datetime-local"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
  
            <!-- 終了日時 -->
            <div>
              <label for="endDate" class="block text-sm font-semibold text-gray-700 mb-2">
                終了日時 <span class="text-red-500">*</span>
              </label>
              <input
                id="endDate"
                v-model="formData.endDate"
                type="datetime-local"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
  
          <!-- 終日フラグ -->
          <div class="flex items-center space-x-3">
            <input
              id="allDay"
              v-model="formData.allDay"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              @change="onAllDayChange"
            />
            <label for="allDay" class="text-sm font-medium text-gray-700">
              終日の予定
            </label>
          </div>
  
          <!-- 説明 -->
          <div>
            <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
              説明
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              placeholder="予定の詳細を入力してください..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            ></textarea>
          </div>
  
          <!-- 参加者 -->
          <div>
            <label for="participants" class="block text-sm font-semibold text-gray-700 mb-2">
              参加者
            </label>
            <input
              id="participants"
              v-model="formData.participants"
              type="text"
              placeholder="例: 田中さん、佐藤さん、山田さん"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p class="text-sm text-gray-500 mt-1">
              参加者の名前をカンマで区切って入力してください
            </p>
          </div>
  
          <!-- 色分け -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              色分け
            </label>
            <div class="flex flex-wrap gap-3">
              <label 
                v-for="color in colorOptions" 
                :key="color.value"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  v-model="formData.color"
                  :value="color.value"
                  type="radio"
                  name="color"
                  class="sr-only"
                />
                <div 
                  :class="[
                    'w-8 h-8 rounded-full border-2 transition-all',
                    color.class,
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  ]"
                ></div>
                <span class="text-sm text-gray-700">{{ color.label }}</span>
              </label>
            </div>
          </div>
  
          <!-- 送信ボタン -->
          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              <span v-if="isSubmitting">保存中...</span>
              <span v-else>📅 予定を保存</span>
            </button>
            <NuxtLink
              to="/calendar"
              class="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center"
            >
              キャンセル
            </NuxtLink>
          </div>
        </form>
      </div>
  
      <!-- 保存完了メッセージ -->
      <div 
        v-if="showSuccessMessage" 
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <span>✅ 予定が正常に保存されました！</span>
          <NuxtLink 
            to="/calendar"
            class="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            カレンダーで確認
          </NuxtLink>
        </div>
      </div>
  
      <!-- 開発用デバッグ情報 -->
      <div 
        v-if="isDev && formData.title" 
        class="bg-gray-100 border border-gray-300 rounded-lg p-4"
      >
        <h4 class="font-semibold text-gray-800 mb-2">🔧 デバッグ情報</h4>
        <pre class="text-xs text-gray-600 overflow-auto">{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
  </template>
  
  <script setup>
  // ページのメタ情報を設定
  useHead({
    title: '新規予定作成 | 社内予定表',
    meta: [
      { name: 'description', content: '新しい予定を作成します' }
    ]
  })
  
  // Composableを使用
  const { createSchedule: saveSchedule, loading, error: scheduleError } = useSchedules()
  
  // URLクエリパラメータを取得（カレンダーから日時指定で来た場合）
  const route = useRoute()
  
  // フォームデータ
  const formData = ref({
    title: '',
    startDate: '',
    endDate: '',
    allDay: false,
    description: '',
    participants: '',
    color: 'blue'
  })
  
  // 色の選択肢
  const colorOptions = [
    { value: 'blue', label: 'ブルー', class: 'bg-blue-500 border-blue-500' },
    { value: 'green', label: 'グリーン', class: 'bg-green-500 border-green-500' },
    { value: 'red', label: 'レッド', class: 'bg-red-500 border-red-500' },
    { value: 'yellow', label: 'イエロー', class: 'bg-yellow-500 border-yellow-500' },
    { value: 'purple', label: 'パープル', class: 'bg-purple-500 border-purple-500' },
    { value: 'gray', label: 'グレー', class: 'bg-gray-500 border-gray-500' }
  ]
  
  // 状態管理
  const isSubmitting = ref(false)
  const showSuccessMessage = ref(false)
  const error = ref(null)
  const isDev = ref(import.meta.env.DEV)
  
  // 初期値の設定
  onMounted(() => {
    // URLクエリパラメータから日時を取得
    const queryDate = route.query.date
    const queryTime = route.query.time
  
    if (queryDate) {
      // カレンダーから指定された日付がある場合
      const selectedDate = new Date(queryDate)
      
      if (queryTime) {
        // 時間も指定されている場合
        const [hour, minute] = queryTime.split(':')
        selectedDate.setHours(parseInt(hour), parseInt(minute || 0), 0, 0)
        
        // 終了時刻は1時間後に設定
        const endDate = new Date(selectedDate)
        endDate.setHours(endDate.getHours() + 1)
        
        formData.value.startDate = formatDateTimeLocal(selectedDate)
        formData.value.endDate = formatDateTimeLocal(endDate)
      } else {
        // 日付のみ指定されている場合、デフォルト時間を設定
        selectedDate.setHours(10, 0, 0, 0) // 10:00開始
        const endDate = new Date(selectedDate)
        endDate.setHours(11, 0, 0, 0) // 11:00終了
        
        formData.value.startDate = formatDateTimeLocal(selectedDate)
        formData.value.endDate = formatDateTimeLocal(endDate)
      }
    } else {
      // デフォルト値を設定（現在時刻から1時間後）
      const now = new Date()
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
      
      now.setMinutes(0, 0, 0)
      oneHourLater.setMinutes(0, 0, 0)
      
      formData.value.startDate = formatDateTimeLocal(now)
      formData.value.endDate = formatDateTimeLocal(oneHourLater)
    }
  })
  
  // 日時をinput[type="datetime-local"]用にフォーマット
  const formatDateTimeLocal = (date) => {
    return date.toISOString().slice(0, 16)
  }
  
  // 終日フラグが変更された時の処理
  const onAllDayChange = () => {
    if (formData.value.allDay) {
      // 終日の場合、時間を00:00-23:59に設定
      const startDate = new Date(formData.value.startDate)
      const endDate = new Date(formData.value.startDate)
      
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      
      formData.value.startDate = formatDateTimeLocal(startDate)
      formData.value.endDate = formatDateTimeLocal(endDate)
    }
  }
  
  // 予定作成処理
  const createSchedule = async () => {
    try {
      isSubmitting.value = true
      error.value = null
      
      // バリデーション
      if (!formData.value.title.trim()) {
        error.value = '予定名を入力してください'
        return
      }
      
      if (new Date(formData.value.startDate) >= new Date(formData.value.endDate)) {
        error.value = '終了日時は開始日時より後に設定してください'
        return
      }
      
      // Firestoreに保存
      const result = await saveSchedule(formData.value)
      
      if (result.success) {
        // 成功メッセージを表示
        showSuccessMessage.value = true
        
        // フォームをリセット
        formData.value = {
          title: '',
          startDate: '',
          endDate: '',
          allDay: false,
          description: '',
          participants: '',
          color: 'blue'
        }
        
        // 初期値を再設定
        const now = new Date()
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
        now.setMinutes(0, 0, 0)
        oneHourLater.setMinutes(0, 0, 0)
        formData.value.startDate = formatDateTimeLocal(now)
        formData.value.endDate = formatDateTimeLocal(oneHourLater)
        
        // 3秒後にメッセージを非表示
        setTimeout(() => {
          showSuccessMessage.value = false
        }, 5000)
        
      } else {
        error.value = result.error || '予定の保存に失敗しました'
      }
      
    } catch (err) {
      console.error('予定作成エラー:', err)
      error.value = '予期しないエラーが発生しました'
    } finally {
      isSubmitting.value = false
    }
  }
  
  // エラーメッセージの監視
  watch(scheduleError, (newError) => {
    if (newError) {
      error.value = newError
    }
  })
  </script>