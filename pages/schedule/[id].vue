<template>
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- ページヘッダー -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <NuxtLink 
            to="/calendar"
            class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span class="mr-2">←</span>
            カレンダーに戻る
          </NuxtLink>
          <h2 class="text-2xl font-bold text-gray-800">
            ✏️ 予定を編集
          </h2>
        </div>
        
        <!-- 削除ボタン -->
        <button
          @click="showDeleteConfirm = true"
          :disabled="isDeleting"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isDeleting">削除中...</span>
          <span v-else>🗑️ 削除</span>
        </button>
      </div>
  
      <!-- 読み込み中 -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="text-gray-500">📄 予定を読み込み中...</div>
      </div>
  
      <!-- 予定が見つからない場合 -->
      <div v-else-if="!schedule" class="text-center py-8">
        <div class="text-red-500 mb-4">❌ 予定が見つかりません</div>
        <NuxtLink 
          to="/calendar"
          class="text-blue-600 hover:text-blue-800"
        >
          カレンダーに戻る
        </NuxtLink>
      </div>
  
      <!-- エラーメッセージ -->
      <div 
        v-if="error" 
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
      >
        ❌ {{ error }}
      </div>
  
      <!-- 予定編集フォーム -->
      <div v-if="schedule" class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="updateSchedule" class="space-y-6">
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
              <span v-if="isSubmitting">更新中...</span>
              <span v-else">💾 変更を保存</span>
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
  
      <!-- 更新完了メッセージ -->
      <div 
        v-if="showSuccessMessage" 
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <span>✅ 予定が正常に更新されました！</span>
          <NuxtLink 
            to="/calendar"
            class="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            カレンダーで確認
          </NuxtLink>
        </div>
      </div>
  
      <!-- 削除確認ダイアログ -->
      <div 
        v-if="showDeleteConfirm" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showDeleteConfirm = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            🗑️ 予定を削除しますか？
          </h3>
          <p class="text-gray-600 mb-6">
            「{{ schedule?.title }}」を削除します。<br>
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
              @click="showDeleteConfirm = false"
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
    title: '予定編集 | 社内予定表',
    meta: [
      { name: 'description', content: '予定を編集します' }
    ]
  })
  
  // ルートパラメータを取得
  const route = useRoute()
  const scheduleId = route.params.id
  
  // Composableを使用
  const { 
    schedules, 
    fetchSchedules, 
    updateSchedule: saveUpdatedSchedule, 
    deleteSchedule: removeSchedule,
    getScheduleById,
    loading, 
    error: scheduleError 
  } = useSchedules()
  
  // リアクティブデータ
  const schedule = ref(null)
  const isLoading = ref(true)
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
  const isDeleting = ref(false)
  const showSuccessMessage = ref(false)
  const showDeleteConfirm = ref(false)
  const error = ref(null)
  
  // 初期化処理
  onMounted(async () => {
    try {
      // 予定データを取得
      await fetchSchedules()
      
      // 指定されたIDの予定を取得
      const foundSchedule = getScheduleById(scheduleId)
      
      if (!foundSchedule) {
        error.value = '指定された予定が見つかりません'
        isLoading.value = false
        return
      }
      
      schedule.value = foundSchedule
      
      // フォームデータに設定
      formData.value = {
        title: foundSchedule.title,
        startDate: formatDateTimeLocal(foundSchedule.start),
        endDate: formatDateTimeLocal(foundSchedule.end),
        allDay: foundSchedule.allDay,
        description: foundSchedule.description || '',
        participants: foundSchedule.participants || '',
        color: foundSchedule.color || 'blue'
      }
      
    } catch (err) {
      console.error('予定の取得に失敗:', err)
      error.value = '予定の取得に失敗しました'
    } finally {
      isLoading.value = false
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
  
  // 予定更新処理
  const updateSchedule = async () => {
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
      
      // 更新実行
      const result = await saveUpdatedSchedule(scheduleId, formData.value)
      
      if (result.success) {
        // 成功メッセージを表示
        showSuccessMessage.value = true
        
        // 予定データを更新
        const updatedSchedule = getScheduleById(scheduleId)
        if (updatedSchedule) {
          schedule.value = updatedSchedule
        }
        
        // 3秒後にメッセージを非表示
        setTimeout(() => {
          showSuccessMessage.value = false
        }, 3000)
        
      } else {
        error.value = result.error || '予定の更新に失敗しました'
      }
      
    } catch (err) {
      console.error('予定更新エラー:', err)
      error.value = '予期しないエラーが発生しました'
    } finally {
      isSubmitting.value = false
    }
  }
  
  // 予定削除処理
  const deleteSchedule = async () => {
    try {
      isDeleting.value = true
      error.value = null
      
      // 削除実行
      const result = await removeSchedule(scheduleId)
      
      if (result.success) {
        // カレンダーページに戻る
        await navigateTo('/calendar')
      } else {
        error.value = result.error || '予定の削除に失敗しました'
        showDeleteConfirm.value = false
      }
      
    } catch (err) {
      console.error('予定削除エラー:', err)
      error.value = '予期しないエラーが発生しました'
      showDeleteConfirm.value = false
    } finally {
      isDeleting.value = false
    }
  }
  
  // エラーメッセージの監視
  watch(scheduleError, (newError) => {
    if (newError) {
      error.value = newError
    }
  })
  </script>