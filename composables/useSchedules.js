// Firebase Firestore操作用のComposable（本格版）
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore'

export const useSchedules = () => {
  // Firestoreデータベースを取得
  const { $db } = useNuxtApp()
  
  // 予定一覧を管理するリアクティブデータ
  const schedules = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * 新しい予定を作成
   * @param {Object} scheduleData - 予定データ
   */
  const createSchedule = async (scheduleData) => {
    try {
      loading.value = true
      error.value = null

      console.log('📝 予定をFirestoreに保存:', scheduleData)

      // 日時をFirestoreのTimestamp形式に変換
      const processedData = {
        title: scheduleData.title,
        description: scheduleData.description || '',
        start: Timestamp.fromDate(new Date(scheduleData.startDate)),
        end: Timestamp.fromDate(new Date(scheduleData.endDate)),
        allDay: scheduleData.allDay || false,
        color: scheduleData.color || 'blue',
        participants: scheduleData.participants || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      // Firestoreに保存
      const docRef = await addDoc(collection($db, 'schedules'), processedData)
      
      console.log('✅ 予定がFirestoreに保存されました。ID:', docRef.id)
      
      // 予定一覧を再取得
      await fetchSchedules()
      
      return { success: true, id: docRef.id }
      
    } catch (err) {
      console.error('❌ Firestore保存エラー:', err)
      error.value = 'Firestoreへの保存に失敗しました: ' + err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 予定一覧を取得
   * @param {Date} startDate - 取得開始日（オプション）
   * @param {Date} endDate - 取得終了日（オプション）
   */
  const fetchSchedules = async (startDate = null, endDate = null) => {
    try {
      loading.value = true
      error.value = null

      console.log('📄 Firestoreから予定を取得中...')

      let q = collection($db, 'schedules')

      // 日付範囲でフィルタリング（指定された場合）
      if (startDate && endDate) {
        q = query(
          collection($db, 'schedules'),
          where('start', '>=', Timestamp.fromDate(startDate)),
          where('start', '<=', Timestamp.fromDate(endDate)),
          orderBy('start', 'asc')
        )
      } else {
        q = query(collection($db, 'schedules'), orderBy('start', 'asc'))
      }

      const querySnapshot = await getDocs(q)
      const fetchedSchedules = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedSchedules.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          start: data.start.toDate(), // TimestampをDateに変換
          end: data.end.toDate(),
          allDay: data.allDay,
          color: data.color,
          participants: data.participants,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        })
      })

      schedules.value = fetchedSchedules
      console.log(`✅ Firestoreから${fetchedSchedules.length}件の予定を取得しました`)
      
      return fetchedSchedules

    } catch (err) {
      console.error('❌ Firestore取得エラー:', err)
      error.value = 'Firestoreからの取得に失敗しました: ' + err.message
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * 予定を更新
   * @param {string} id - 予定ID
   * @param {Object} updateData - 更新データ
   */
  const updateSchedule = async (id, updateData) => {
    try {
      loading.value = true
      error.value = null

      console.log('📝 Firestoreで予定を更新:', id, updateData)

      // 日時をFirestoreのTimestamp形式に変換
      const processedData = {
        title: updateData.title,
        description: updateData.description || '',
        start: Timestamp.fromDate(new Date(updateData.startDate)),
        end: Timestamp.fromDate(new Date(updateData.endDate)),
        allDay: updateData.allDay || false,
        color: updateData.color || 'blue',
        participants: updateData.participants || '',
        updatedAt: Timestamp.now()
      }

      // Firestoreのドキュメントを更新
      const scheduleRef = doc($db, 'schedules', id)
      await updateDoc(scheduleRef, processedData)

      console.log('✅ Firestoreで予定が更新されました。ID:', id)
      
      // 予定一覧を再取得
      await fetchSchedules()
      
      return { success: true }

    } catch (err) {
      console.error('❌ Firestore更新エラー:', err)
      error.value = 'Firestoreでの更新に失敗しました: ' + err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 予定を削除
   * @param {string} id - 予定ID
   */
  const deleteSchedule = async (id) => {
    try {
      loading.value = true
      error.value = null

      console.log('🗑️ Firestoreから予定を削除:', id)

      // Firestoreからドキュメントを削除
      await deleteDoc(doc($db, 'schedules', id))

      console.log('✅ Firestoreから予定が削除されました。ID:', id)
      
      // 予定一覧を再取得
      await fetchSchedules()
      
      return { success: true }

    } catch (err) {
      console.error('❌ Firestore削除エラー:', err)
      error.value = 'Firestoreでの削除に失敗しました: ' + err.message
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

  /**
   * 特定の日の予定を取得
   * @param {Date} date - 対象日
   */
  const getSchedulesForDate = (date) => {
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    
    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

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
      console.log('🔄 Firebase接続テスト開始...')
      await fetchSchedules()
      console.log('✅ Firebase接続テスト成功!')
      return true
    } catch (err) {
      console.error('❌ Firebase接続テスト失敗:', err)
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