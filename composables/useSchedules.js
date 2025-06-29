// 一時的な簡略版 - まず動作確認のため
export const useSchedules = () => {
    // 予定一覧を管理するリアクティブデータ
    const schedules = ref([])
    const loading = ref(false)
    const error = ref(null)
  
    /**
     * 新しい予定を作成（一時的にローカルストレージに保存）
     * @param {Object} scheduleData - 予定データ
     */
    const createSchedule = async (scheduleData) => {
      try {
        loading.value = true
        error.value = null
  
        console.log('📝 予定データを受信:', scheduleData)
  
        // 一時的にローカルストレージに保存
        const existingSchedules = JSON.parse(localStorage.getItem('schedules') || '[]')
        const newSchedule = {
          id: Date.now().toString(), // 簡易ID生成
          title: scheduleData.title,
          description: scheduleData.description || '',
          start: new Date(scheduleData.startDate),
          end: new Date(scheduleData.endDate),
          allDay: scheduleData.allDay || false,
          color: scheduleData.color || 'blue',
          participants: scheduleData.participants || '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
  
        existingSchedules.push(newSchedule)
        localStorage.setItem('schedules', JSON.stringify(existingSchedules))
        
        console.log('✅ 予定がローカルストレージに保存されました:', newSchedule)
        
        // 予定一覧を更新
        schedules.value = existingSchedules
        
        // 2秒間の擬似的な保存処理
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return { success: true, id: newSchedule.id }
        
      } catch (err) {
        console.error('❌ 予定の保存に失敗:', err)
        error.value = '予定の保存に失敗しました: ' + err.message
        return { success: false, error: err.message }
      } finally {
        loading.value = false
      }
    }
  
    /**
     * 予定一覧を取得（一時的にローカルストレージから取得）
     */
    const fetchSchedules = async () => {
      try {
        loading.value = true
        error.value = null
  
        // ローカルストレージから取得
        const existingSchedules = JSON.parse(localStorage.getItem('schedules') || '[]')
        
        // 日付文字列をDateオブジェクトに変換
        const processedSchedules = existingSchedules.map(schedule => ({
          ...schedule,
          start: new Date(schedule.start),
          end: new Date(schedule.end),
          createdAt: new Date(schedule.createdAt),
          updatedAt: new Date(schedule.updatedAt)
        }))
  
        schedules.value = processedSchedules
        console.log(`✅ ${processedSchedules.length}件の予定をローカルストレージから取得しました`)
        
        return processedSchedules
  
      } catch (err) {
        console.error('❌ 予定の取得に失敗:', err)
        error.value = '予定の取得に失敗しました: ' + err.message
        return []
      } finally {
        loading.value = false
      }
    }
  
    /**
     * 予定を更新（ローカルストレージ版）
     * @param {string} id - 予定ID
     * @param {Object} updateData - 更新データ
     */
    const updateSchedule = async (id, updateData) => {
      try {
        loading.value = true
        error.value = null
  
        console.log('📝 予定を更新:', id, updateData)
  
        // ローカルストレージから既存データを取得
        const existingSchedules = JSON.parse(localStorage.getItem('schedules') || '[]')
        const scheduleIndex = existingSchedules.findIndex(schedule => schedule.id === id)
  
        if (scheduleIndex === -1) {
          throw new Error('予定が見つかりません')
        }
  
        // データを更新
        const updatedSchedule = {
          ...existingSchedules[scheduleIndex],
          title: updateData.title,
          description: updateData.description || '',
          start: new Date(updateData.startDate),
          end: new Date(updateData.endDate),
          allDay: updateData.allDay || false,
          color: updateData.color || 'blue',
          participants: updateData.participants || '',
          updatedAt: new Date()
        }
  
        existingSchedules[scheduleIndex] = updatedSchedule
        localStorage.setItem('schedules', JSON.stringify(existingSchedules))
        
        console.log('✅ 予定が更新されました:', updatedSchedule)
        
        // 予定一覧を更新
        schedules.value = existingSchedules.map(schedule => ({
          ...schedule,
          start: new Date(schedule.start),
          end: new Date(schedule.end),
          createdAt: new Date(schedule.createdAt),
          updatedAt: new Date(schedule.updatedAt)
        }))
        
        // 1秒間の擬似的な更新処理
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return { success: true }
        
      } catch (err) {
        console.error('❌ 予定の更新に失敗:', err)
        error.value = '予定の更新に失敗しました: ' + err.message
        return { success: false, error: err.message }
      } finally {
        loading.value = false
      }
    }
  
    /**
     * 予定を削除（ローカルストレージ版）
     * @param {string} id - 予定ID
     */
    const deleteSchedule = async (id) => {
      try {
        loading.value = true
        error.value = null
  
        console.log('🗑️ 予定を削除:', id)
  
        // ローカルストレージから既存データを取得
        const existingSchedules = JSON.parse(localStorage.getItem('schedules') || '[]')
        const filteredSchedules = existingSchedules.filter(schedule => schedule.id !== id)
  
        if (existingSchedules.length === filteredSchedules.length) {
          throw new Error('削除する予定が見つかりません')
        }
  
        localStorage.setItem('schedules', JSON.stringify(filteredSchedules))
        
        console.log('✅ 予定が削除されました')
        
        // 予定一覧を更新
        schedules.value = filteredSchedules.map(schedule => ({
          ...schedule,
          start: new Date(schedule.start),
          end: new Date(schedule.end),
          createdAt: new Date(schedule.createdAt),
          updatedAt: new Date(schedule.updatedAt)
        }))
        
        // 1秒間の擬似的な削除処理
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return { success: true }
        
      } catch (err) {
        console.error('❌ 予定の削除に失敗:', err)
        error.value = '予定の削除に失敗しました: ' + err.message
        return { success: false, error: err.message }
      } finally {
        loading.value = false
      }
    }
  
    /**
     * 特定の予定を取得
     * @param {string} id - 予定ID
     */
    const getScheduleById = (id) => {
      return schedules.value.find(schedule => schedule.id === id) || null
    }
    const getSchedulesForDate = (date) => {
      const targetDate = new Date(date)
      targetDate.setHours(0, 0, 0, 0)
      
      return schedules.value.filter(schedule => {
        const scheduleDate = new Date(schedule.start)
        scheduleDate.setHours(0, 0, 0, 0)
        
        return scheduleDate.getTime() === targetDate.getTime()
      })
    }
  
    /**
     * 特定の月の予定を取得
     * @param {number} year - 年
     * @param {number} month - 月（0ベース）
     */
    const getSchedulesForMonth = (year, month) => {
      return schedules.value.filter(schedule => {
        const scheduleDate = new Date(schedule.start)
        return scheduleDate.getFullYear() === year && scheduleDate.getMonth() === month
      })
    }
  
    // 接続テスト用の関数
    const testConnection = async () => {
      try {
        console.log('🔄 ローカルストレージテスト開始...')
        await fetchSchedules()
        console.log('✅ ローカルストレージテスト成功!')
        return true
      } catch (err) {
        console.error('❌ ローカルストレージテスト失敗:', err)
        return false
      }
    }
  
    return {
      // データ
      schedules: readonly(schedules),
      loading: readonly(loading),
      error: readonly(error),
      
      // メソッド
      createSchedule,
      fetchSchedules,
      updateSchedule,
      deleteSchedule,
      getScheduleById,
      getSchedulesForDate,
      getSchedulesForMonth,
      testConnection
    }
  }