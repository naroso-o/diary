import { create } from 'zustand'
import type { NotificationProps } from '../types'

interface UIStore {
    // 사이드바 상태
    sidebarCollapsed: boolean
    setSidebarCollapsed: (collapsed: boolean) => void

    // 모달 상태
    modals: Record<string, boolean>
    openModal: (modalId: string) => void
    closeModal: (modalId: string) => void

    // 알림 상태
    notifications: Array<NotificationProps & { id: string }>
    addNotification: (notification: Omit<NotificationProps, 'id'>) => void
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
        set(state => ({
            modals: { ...state.modals, [modalId]: true }
        }))
    },
    closeModal: (modalId: string) => {
        set(state => ({
            modals: { ...state.modals, [modalId]: false }
        }))
    },

    // 알림 상태
    notifications: [],
    addNotification: (notification) => {
        const id = Date.now().toString()
        const newNotification = { ...notification, id }

        set(state => ({
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
        set(state => ({
            notifications: state.notifications.filter(n => n.id !== id)
        }))
    },
    clearNotifications: () => {
        set({ notifications: [] })
    },

    // 로딩 상태
    loadingStates: {},
    setLoading: (key: string, loading: boolean) => {
        set(state => ({
            loadingStates: { ...state.loadingStates, [key]: loading }
        }))
    },
    isLoading: (key: string) => {
        return get().loadingStates[key] || false
    },

    // 전역 상태
    online: navigator.onLine,
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
        set(state => ({
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

        set(state => {
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

        set(state => ({
            recentActions: [newAction, ...state.recentActions].slice(0, 50) // 최대 50개
        }))
    },
    clearRecentActions: () => {
        set({ recentActions: [] })
    },

    // 개발자 모드
    devMode: import.meta.env.MODE === 'development',
    setDevMode: (enabled: boolean) => {
        set({ devMode: enabled })
    }
}))
