import { useState, useMemo, useCallback } from 'react';
import type { DiaryEntry, MoodType } from '../types';
import { searchDiaries, getSearchSuggestions } from '../utils/searchUtils';
import type { SearchOptions, SearchResult } from '../utils/searchUtils';
import { debounce } from '../utils/debounce';

export const useSearch = (entries: DiaryEntry[]) => {
    const [query, setQuery] = useState('');
    const [mood, setMood] = useState<MoodType | undefined>();
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [sortBy, setSortBy] = useState<'date' | 'relevance'>('relevance');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isSearching, setIsSearching] = useState(false);

    // 검색 옵션
    const searchOptions: SearchOptions = useMemo(() => ({
        query,
        mood,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
        sortOrder
    }), [query, mood, startDate, endDate, sortBy, sortOrder]);

    // 검색 결과
    const searchResults: SearchResult[] = useMemo(() => {
        if (!query.trim() && !mood && !startDate && !endDate) {
            return [];
        }

        return searchDiaries(entries, searchOptions);
    }, [entries, searchOptions]);

    // 검색 제안
    const suggestions = useMemo(() => {
        if (!query.trim()) return [];
        return getSearchSuggestions(entries, query);
    }, [entries, query]);

    // 디바운스된 검색
    const debouncedSearch = useCallback(
        debounce((searchQuery: string) => {
            setQuery(searchQuery);
            setIsSearching(false);
        }, 200),
        []
    );

    // 검색어 변경
    const handleQueryChange = useCallback((newQuery: string) => {
        setIsSearching(true);
        debouncedSearch(newQuery);
    }, [debouncedSearch]);

    // 검색 초기화
    const clearSearch = useCallback(() => {
        setQuery('');
        setMood(undefined);
        setStartDate('');
        setEndDate('');
        setSortBy('relevance');
        setSortOrder('desc');
        setIsSearching(false);
    }, []);

    // 필터 적용
    const applyFilters = useCallback((filters: Partial<SearchOptions>) => {
        if (filters.mood !== undefined) setMood(filters.mood);
        if (filters.startDate !== undefined) setStartDate(filters.startDate || '');
        if (filters.endDate !== undefined) setEndDate(filters.endDate || '');
        if (filters.sortBy) setSortBy(filters.sortBy);
        if (filters.sortOrder) setSortOrder(filters.sortOrder);
    }, []);

    // 검색 상태
    const hasActiveSearch = query.trim() || mood || startDate || endDate;
    const hasResults = searchResults.length > 0;

    return {
        // 상태
        query,
        mood,
        startDate,
        endDate,
        sortBy,
        sortOrder,
        isSearching,

        // 결과
        searchResults,
        suggestions,
        hasActiveSearch,
        hasResults,

        // 액션
        handleQueryChange,
        setMood,
        setStartDate,
        setEndDate,
        setSortBy,
        setSortOrder,
        applyFilters,
        clearSearch
    };
};
