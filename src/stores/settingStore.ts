import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { settingsAPI } from '../utils/supabase'
import type { AppSettings, Theme } from '../types'

// 기본 설정값
const DEFAULT_SETTINGS: AppSettings = {
    theme: {
        name: 'default',
        colors: {
            primary: '#ec4899',
            secondary: '#f59e0b',
            background: '#fdf2f8',
            surface: '#ffffff',
            text: '#1f2937'
        }
    },
    fontSize: 'md',
    language: 'ko',
    notifications: true,
    autoSave: true,
    showMoodInCalendar: true,
    enableSearchSuggestions: true,
    enableSpellCheck: true,
    showWordCount: true,
    exportIncludeMood: true,
    exportIncludeMetadata: false,
    defaultExportFormat: 'json',
    calendarStartsMonday: false,
    showWeekends: true,
    showOtherMonths: true,
    autoBackup: false,
    backupInterval: 24,
    maxBackups: 10,
    enablePassword: false,
    sessionTimeout: 30,
    dailyReminder: false,
    reminderTime: '09:00',
    defaultMood: 'normal',
    privateModeDefault: false,
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    debugMode: false,
    enableAnalytics: false,
    betaFeatures: false
}

interface SettingsStore {
    settings: AppSettings
    isLoading: boolean
    hasChanges: boolean
    error: string | null

    // Actions
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
    updateTheme: (theme: Theme) => void
    resetSettings: () => void
    saveSettings: (userId?: string) => Promise<boolean>
    loadSettings: (userId: string) => Promise<void>
    exportSettings: () => string
    importSettings: (data: string) => Promise<boolean>
    setError: (error: string | null) => void
    clearChanges: () => void
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            settings: DEFAULT_SETTINGS,
            isLoading: false,
            hasChanges: false,
            error: null,

            updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
                set((state) => ({
                    settings: { ...state.settings, [key]: value },
                    hasChanges: true,
                    error: null
                }))
            },

            updateTheme: (theme: Theme) => {
                set((state) => ({
                    settings: { ...state.settings, theme },
                    hasChanges: true,
                    error: null
                }))
            },

            resetSettings: () => {
                set({
                    settings: DEFAULT_SETTINGS,
                    hasChanges: true,
                    error: null
                })
            },

            saveSettings: async (userId?: string) => {
                const { settings } = get()

                if (!userId) {
                    // 로컬 저장만
                    set({ hasChanges: false })
                    return true
                }

                set({ isLoading: true, error: null })

                try {
                    await settingsAPI.saveSettings(userId, settings)
                    set({ isLoading: false, hasChanges: false })
                    return true
                } catch (error) {
                    console.error('설정 저장 실패:', error)
                    set({
                        isLoading: false,
                        error: '설정 저장에 실패했습니다.'
                    })
                    return false
                }
            },

            loadSettings: async (userId: string) => {
                set({ isLoading: true, error: null })

                try {
                    const settings = await settingsAPI.getSettings(userId)
                    if (settings) {
                        set({
                            settings: { ...DEFAULT_SETTINGS, ...settings },
                            isLoading: false,
                            hasChanges: false
                        })
                    } else {
                        set({ isLoading: false })
                    }
                } catch (error) {
                    console.error('설정 로드 실패:', error)
                    set({
                        isLoading: false,
                        error: '설정을 불러오는데 실패했습니다.'
                    })
                }
            },

            exportSettings: () => {
                const { settings } = get()
                return JSON.stringify(settings, null, 2)
            },

            importSettings: async (data: string) => {
                try {
                    const importedSettings = JSON.parse(data)

                    // 기본 유효성 검사
                    if (typeof importedSettings !== 'object') {
                        throw new Error('올바른 설정 형식이 아닙니다.')
                    }

                    set((state) => ({
                        settings: { ...state.settings, ...importedSettings },
                        hasChanges: true,
                        error: null
                    }))

                    return true
                } catch (error) {
                    console.error('설정 가져오기 실패:', error)
                    set({ error: '설정 가져오기에 실패했습니다.' })
                    return false
                }
            },

            setError: (error: string | null) => {
                set({ error })
            },

            clearChanges: () => {
                set({ hasChanges: false })
            }
        }),
        {
            name: 'app-settings',
            partialize: (state) => ({
                settings: state.settings
            })
        }
    )
)

interface NotificationItem {
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    title?: string
    message: string
    duration?: number
    persistent?: boolean
    action?: {
        label: string
        onClick: () => void
    }
}

interface UIStore {
    // 사이드바 상태
    sidebarCollapsed: boolean
    setSidebarCollapsed: (collapsed: boolean) => void

    // 모달 상태
    modals: Record<string, boolean>
    openModal: (modalId: string) => void
    closeModal: (modalId: string) => void

    // 알림 상태
    notifications: NotificationItem[]
    addNotification: (notification: Omit<NotificationItem, 'id'>) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void

    // 로딩 상태
    loadingStates: Record<string, boolean>
    setLoading: (key: string, loading: boolean) => void
    isLoading: (key: string) => boolean

    // 전역 상태
    online: boolean
    setOnline: (online: boolean) => void

    // 키보드 단축키 활성화
    keyboardShortcutsEnabled: boolean
    setKeyboardShortcutsEnabled: (enabled: boolean) => void

    // 포커스 관리
    focusedElement: string | null
    setFocusedElement: (element: string | null) => void

    // 스크롤 위치 저장
    scrollPositions: Record<string, number>
    saveScrollPosition: (key: string, position: number) => void
    getScrollPosition: (key: string) => number

    // 드래그 앤 드롭 상태
    dragData: any
    setDragData: (data: any) => void
    clearDragData: () => void

    // 검색 상태
    searchQuery: string
    setSearchQuery: (query: string) => void
    searchHistory: string[]
    addToSearchHistory: (query: string) => void
    clearSearchHistory: () => void

    // 최근 작업 히스토리
    recentActions: Array<{
        type: string
        timestamp: string
        data: any
    }>
    addRecentAction: (action: { type: string; data: any }) => void
    clearRecentActions: () => void

    // 개발자 모드
    devMode: boolean
    setDevMode: (enabled: boolean) => void
}

export const useUIStore = create<UIStore>((set, get) => ({
    // 사이드바 상태
    sidebarCollapsed: false,
    setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed })
    },

    // 모달 상태
    modals: {},
    openModal: (modalId: string) => {
        set((state) => ({
            modals: { ...state.modals, [modalId]: true }
        }))
    },
    closeModal: (modalId: string) => {
        set((state) => ({
            modals: { ...state.modals, [modalId]: false }
        }))
    },

    // 알림 상태
    notifications: [],
    addNotification: (notification) => {
        const id = Date.now().toString()
        const newNotification = { ...notification, id }

        set((state) => ({
            notifications: [...state.notifications, newNotification]
        }))

        // 자동 제거 (persistent가 아닌 경우)
        if (!notification.persistent) {
            setTimeout(() => {
                get().removeNotification(id)
            }, notification.duration || 3000)
        }
    },
    removeNotification: (id: string) => {
        set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
        }))
    },
    clearNotifications: () => {
        set({ notifications: [] })
    },

    // 로딩 상태
    loadingStates: {},
    setLoading: (key: string, loading: boolean) => {
        set((state) => ({
            loadingStates: { ...state.loadingStates, [key]: loading }
        }))
    },
    isLoading: (key: string) => {
        return get().loadingStates[key] || false
    },

    // 전역 상태
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    setOnline: (online: boolean) => {
        set({ online })
    },

    // 키보드 단축키
    keyboardShortcutsEnabled: true,
    setKeyboardShortcutsEnabled: (enabled: boolean) => {
        set({ keyboardShortcutsEnabled: enabled })
    },

    // 포커스 관리
    focusedElement: null,
    setFocusedElement: (element: string | null) => {
        set({ focusedElement: element })
    },

    // 스크롤 위치
    scrollPositions: {},
    saveScrollPosition: (key: string, position: number) => {
        set((state) => ({
            scrollPositions: { ...state.scrollPositions, [key]: position }
        }))
    },
    getScrollPosition: (key: string) => {
        return get().scrollPositions[key] || 0
    },

    // 드래그 앤 드롭
    dragData: null,
    setDragData: (data: any) => {
        set({ dragData: data })
    },
    clearDragData: () => {
        set({ dragData: null })
    },

    // 검색 상태
    searchQuery: '',
    setSearchQuery: (query: string) => {
        set({ searchQuery: query })
    },
    searchHistory: [],
    addToSearchHistory: (query: string) => {
        if (!query.trim()) return

        set((state) => {
            const history = state.searchHistory.filter(item => item !== query)
            return {
                searchHistory: [query, ...history].slice(0, 10) // 최대 10개
            }
        })
    },
    clearSearchHistory: () => {
        set({ searchHistory: [] })
    },

    // 최근 작업 히스토리
    recentActions: [],
    addRecentAction: (action) => {
        const newAction = {
            ...action,
            timestamp: new Date().toISOString()
        }

        set((state) => ({
            recentActions: [newAction, ...state.recentActions].slice(0, 50) // 최대 50개
        }))
    },
    clearRecentActions: () => {
        set({ recentActions: [] })
    },

    // 개발자 모드
    devMode: typeof window !== 'undefined' && window.location.hostname === 'localhost',
    setDevMode: (enabled: boolean) => {
        set({ devMode: enabled })
    }
}))