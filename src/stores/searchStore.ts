import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { searchDiaries } from '../utils/searchUtils'
import type { SearchResult, SearchOptions } from '../utils/searchUtils'
import type { DiaryEntry, MoodType } from '../types'
import { STORAGE_KEYS } from '../utils/consts'

interface SearchStore {
    // 검색 상태
    query: string
    mood: MoodType | undefined
    startDate: string
    endDate: string
    sortBy: 'date' | 'relevance' | 'mood'
    sortOrder: 'asc' | 'desc'
    isSearching: boolean

    // 결과
    results: SearchResult[]
    suggestions: string[]
    totalResults: number

    // 히스토리
    searchHistory: string[]

    // Actions
    setQuery: (query: string) => void
    setMood: (mood: MoodType | undefined) => void
    setStartDate: (date: string) => void
    setEndDate: (date: string) => void
    setSortBy: (sort: 'date' | 'relevance' | 'mood') => void
    setSortOrder: (order: 'asc' | 'desc') => void
    setIsSearching: (searching: boolean) => void

    // 검색 실행
    search: (entries: DiaryEntry[]) => void
    clearSearch: () => void

    // 히스토리 관리
    addToHistory: (query: string) => void
    removeFromHistory: (query: string) => void
    clearHistory: () => void

    // 제안 업데이트
    updateSuggestions: (suggestions: string[]) => void

    // 필터 적용
    applyFilters: (filters: Partial<SearchOptions>) => void

    // 상태 확인
    hasActiveSearch: () => boolean
    hasResults: () => boolean
}

export const useSearchStore = create<SearchStore>()(
    persist(
        (set, get) => ({
            // 초기 상태
            query: '',
            mood: undefined,
            startDate: '',
            endDate: '',
            sortBy: 'relevance',
            sortOrder: 'desc',
            isSearching: false,

            results: [],
            suggestions: [],
            totalResults: 0,

            searchHistory: [],

            // 기본 setters
            setQuery: (query: string) => set({ query }),
            setMood: (mood: MoodType | undefined) => set({ mood }),
            setStartDate: (date: string) => set({ startDate: date }),
            setEndDate: (date: string) => set({ endDate: date }),
            setSortBy: (sortBy: 'date' | 'relevance' | 'mood') => set({ sortBy }),
            setSortOrder: (sortOrder: 'asc' | 'desc') => set({ sortOrder }),
            setIsSearching: (isSearching: boolean) => set({ isSearching }),

            // 검색 실행
            search: (entries: DiaryEntry[]) => {
                const state = get()
                const options: SearchOptions = {
                    query: state.query,
                    mood: state.mood,
                    startDate: state.startDate || undefined,
                    endDate: state.endDate || undefined,
                    sortBy: state.sortBy,
                    sortOrder: state.sortOrder
                }

                set({ isSearching: true })

                try {
                    const results = searchDiaries(entries, options)
                    set({
                        results,
                        totalResults: results.length,
                        isSearching: false
                    })

                    // 검색어가 있으면 히스토리에 추가
                    if (state.query.trim()) {
                        get().addToHistory(state.query)
                    }
                } catch (error) {
                    console.error('검색 실패:', error)
                    set({ isSearching: false })
                }
            },

            // 검색 초기화
            clearSearch: () => {
                set({
                    query: '',
                    mood: undefined,
                    startDate: '',
                    endDate: '',
                    results: [],
                    suggestions: [],
                    totalResults: 0,
                    isSearching: false
                })
            },

            // 히스토리 관리
            addToHistory: (query: string) => {
                if (!query.trim()) return

                set(state => {
                    const history = state.searchHistory.filter(item => item !== query)
                    return {
                        searchHistory: [query, ...history].slice(0, 20) // 최대 20개
                    }
                })
            },

            removeFromHistory: (query: string) => {
                set(state => ({
                    searchHistory: state.searchHistory.filter(item => item !== query)
                }))
            },

            clearHistory: () => {
                set({ searchHistory: [] })
            },

            // 제안 업데이트
            updateSuggestions: (suggestions: string[]) => {
                set({ suggestions })
            },

            // 필터 적용
            applyFilters: (filters: Partial<SearchOptions>) => {
                set(state => ({
                    ...state,
                    ...filters
                }))
            },

            // 상태 확인
            hasActiveSearch: () => {
                const state = get()
                return !!(state.query || state.mood || state.startDate || state.endDate)
            },

            hasResults: () => {
                return get().results.length > 0
            }
        }),
        {
            name: STORAGE_KEYS.SEARCH_HISTORY,
            partialize: (state) => ({
                searchHistory: state.searchHistory,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder
            })
        }
    )
)