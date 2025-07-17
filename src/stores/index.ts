import { useDiaryStore } from './diaryStore'
import { useSearchStore } from './searchStore'
import { useUIStore } from './uiStore'
import { useSettingsStore } from './settingStore'

export { useDiaryStore } from './diaryStore'
export { useSettingsStore } from './settingStore'
export { useUIStore } from './uiStore'
export { useSearchStore } from './searchStore'

// 기본 설정 상수
const DEFAULT_SETTINGS = {
    theme: 'auto',
    language: 'ko',
    notifications: true,
    autoSave: true,
    privacyLevel: 'private',
    fontSize: 'medium',
    compactMode: false,
    soundEnabled: true,
    keyboardShortcuts: true,
    dataSync: true,
    backupFrequency: 'weekly',
    exportFormat: 'json',
    timezone: 'Asia/Seoul',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: '24h'
}

// 스토어 초기화 함수
export const initializeStores = async (userId: string) => {
    try {
        // 설정 로드
        const settingsStore = useSettingsStore.getState()
        await settingsStore.loadSettings(userId)

        // 일기 데이터 로드
        const diaryStore = useDiaryStore.getState()
        await diaryStore.fetchEntries()

        // 온라인 상태 감지
        const uiStore = useUIStore.getState()

        const handleOnline = () => {
            uiStore.setOnline(true)
            // 온라인 상태가 되면 데이터 동기화
            diaryStore.syncEntries()
        }

        const handleOffline = () => {
            uiStore.setOnline(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        console.log('Stores initialized successfully')
    } catch (error) {
        console.error('Store initialization failed:', error)
    }
}

// 스토어 리셋 함수 (로그아웃 시 사용)
export const resetStores = () => {
    useDiaryStore.getState().clearEntries()
    useSettingsStore.setState({ settings: DEFAULT_SETTINGS, hasChanges: false })
    useUIStore.setState({
        notifications: [],
        modals: {},
        searchQuery: '',
        recentActions: []
    })
    useSearchStore.getState().clearSearch()
}

// 개발자 도구 (개발 모드에서만)
if (import.meta.env.MODE === 'development') {
    (window as any).stores = {
        diary: useDiaryStore,
        settings: useSettingsStore,
        ui: useUIStore,
        search: useSearchStore
    }

        ; (window as any).initializeStores = initializeStores
        ; (window as any).resetStores = resetStores
}