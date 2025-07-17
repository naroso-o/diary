import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { diaryAPI } from '../utils/supabase'
import { getCurrentDateString } from '../utils/dateUtils'
import type { DiaryEntry, MoodType, User, ViewType } from '../types'
import { STORAGE_KEYS } from '../utils/consts'

interface DiaryStore {
    // 상태
    entries: Record<string, DiaryEntry>
    loading: boolean
    connected: boolean
    error: string | null
    currentUser: User | null
    selectedDate: string
    currentView: ViewType
    draftEntries: Record<string, Partial<DiaryEntry>>
    lastSyncTime: string | null

    // 기본 액션
    setUser: (user: User | null) => void
    setSelectedDate: (date: string) => void
    setCurrentView: (view: ViewType) => void
    setError: (error: string | null) => void

    // 비동기 액션
    fetchEntries: () => Promise<void>
    addEntry: (date: string, content: string, mood: MoodType) => Promise<void>
    updateEntry: (date: string, content: string, mood: MoodType) => Promise<void>
    deleteEntry: (date: string) => Promise<void>

    // 드래프트 관리
    saveDraft: (date: string, draft: Partial<DiaryEntry>) => void
    clearDraft: (date: string) => void

    // 동기화
    syncEntries: () => Promise<void>
    clearEntries: () => void

    // 컴퓨티드 값들
    getEntriesByDateRange: (start: string, end: string) => DiaryEntry[]
    getEntriesByMood: (mood: MoodType) => DiaryEntry[]
    getTotalEntries: () => number
    getCurrentEntry: () => DiaryEntry | undefined
    getDraft: (date: string) => Partial<DiaryEntry> | undefined
}

export const useDiaryStore = create<DiaryStore>()(
    persist(
        (set, get) => ({
            // 초기 상태
            entries: {},
            loading: false,
            connected: true,
            error: null,
            currentUser: null,
            selectedDate: getCurrentDateString(),
            currentView: 'diary',
            draftEntries: {},
            lastSyncTime: null,

            // 기본 액션
            setUser: (user: User | null) => {
                set({ currentUser: user })
            },

            setSelectedDate: (date: string) => {
                set({ selectedDate: date })
            },

            setCurrentView: (view: ViewType) => {
                set({ currentView: view })
            },

            setError: (error: string | null) => {
                set({ error })
            },

            // 비동기 액션
            fetchEntries: async () => {
                const { currentUser } = get()
                if (!currentUser) return

                set({ loading: true, error: null })

                try {
                    const { entries } = await diaryAPI.fetchEntries(currentUser.id)
                    const entriesObj = entries.reduce<Record<string, DiaryEntry>>((acc, entry) => {
                        acc[entry.date] = entry
                        return acc
                    }, {})

                    set({
                        entries: entriesObj,
                        loading: false,
                        connected: true,
                        lastSyncTime: new Date().toISOString()
                    })
                } catch (error) {
                    console.error('일기 조회 실패:', error)
                    set({
                        loading: false,
                        connected: false,
                        error: '일기를 불러오는데 실패했습니다.'
                    })
                }
            },

            addEntry: async (date: string, content: string, mood: MoodType) => {
                const { currentUser } = get()
                if (!currentUser) return

                set({ loading: true, error: null })

                try {
                    const newEntry = await diaryAPI.createEntry(currentUser.id, date, content, mood)

                    set(state => ({
                        entries: { ...state.entries, [date]: newEntry },
                        loading: false,
                        connected: true,
                        lastSyncTime: new Date().toISOString()
                    }))

                    // 드래프트 제거
                    get().clearDraft(date)
                } catch (error) {
                    console.error('일기 생성 실패:', error)
                    set({
                        loading: false,
                        connected: false,
                        error: '일기 저장에 실패했습니다.'
                    })
                    throw error
                }
            },

            updateEntry: async (date: string, content: string, mood: MoodType) => {
                const { currentUser } = get()
                if (!currentUser) return

                set({ loading: true, error: null })

                try {
                    const updatedEntry = await diaryAPI.updateEntry(currentUser.id, date, content, mood)

                    set(state => ({
                        entries: { ...state.entries, [date]: updatedEntry },
                        loading: false,
                        connected: true,
                        lastSyncTime: new Date().toISOString()
                    }))

                    // 드래프트 제거
                    get().clearDraft(date)
                } catch (error) {
                    console.error('일기 수정 실패:', error)
                    set({
                        loading: false,
                        connected: false,
                        error: '일기 수정에 실패했습니다.'
                    })
                    throw error
                }
            },

            deleteEntry: async (date: string) => {
                const { currentUser } = get()
                if (!currentUser) return

                set({ loading: true, error: null })

                try {
                    await diaryAPI.deleteEntry(currentUser.id, date)

                    set(state => {
                        const newEntries = { ...state.entries }
                        delete newEntries[date]
                        return {
                            entries: newEntries,
                            loading: false,
                            connected: true,
                            lastSyncTime: new Date().toISOString()
                        }
                    })

                    // 드래프트도 제거
                    get().clearDraft(date)
                } catch (error) {
                    console.error('일기 삭제 실패:', error)
                    set({
                        loading: false,
                        connected: false,
                        error: '일기 삭제에 실패했습니다.'
                    })
                    throw error
                }
            },

            // 드래프트 관리
            saveDraft: (date: string, draft: Partial<DiaryEntry>) => {
                set(state => ({
                    draftEntries: { ...state.draftEntries, [date]: draft }
                }))
            },

            clearDraft: (date: string) => {
                set(state => {
                    const newDrafts = { ...state.draftEntries }
                    delete newDrafts[date]
                    return { draftEntries: newDrafts }
                })
            },

            // 동기화
            syncEntries: async () => {
                const { currentUser } = get()
                if (!currentUser) return

                try {
                    await get().fetchEntries()
                } catch (error) {
                    console.error('동기화 실패:', error)
                }
            },

            // 초기화
            clearEntries: () => {
                set({
                    entries: {},
                    draftEntries: {},
                    error: null,
                    lastSyncTime: null
                })
            },

            // 컴퓨티드 값들
            getEntriesByDateRange: (start: string, end: string) => {
                const { entries } = get()
                return Object.values(entries).filter(entry =>
                    entry.date >= start && entry.date <= end
                )
            },

            getEntriesByMood: (mood: MoodType) => {
                const { entries } = get()
                return Object.values(entries).filter(entry => entry.mood === mood)
            },

            getTotalEntries: () => {
                const { entries } = get()
                return Object.keys(entries).length
            },

            getCurrentEntry: () => {
                const { entries, selectedDate } = get()
                return entries[selectedDate]
            },

            getDraft: (date: string) => {
                const { draftEntries } = get()
                return draftEntries[date]
            }
        }),
        {
            name: STORAGE_KEYS.DIARY_STORE || 'diary-store',
            partialize: (state) => ({
                selectedDate: state.selectedDate,
                currentView: state.currentView,
                draftEntries: state.draftEntries
            })
        }
    )
)