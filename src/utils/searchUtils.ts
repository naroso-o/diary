import type { DiaryEntry, MoodType } from '../types';
import { parseDate } from './dateUtils';

export interface SearchOptions {
    query: string;
    mood?: MoodType;
    startDate?: string;
    endDate?: string;
    sortBy?: 'date' | 'relevance' | 'mood';
    sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
    entry: DiaryEntry;
    relevance: number;
    matchedTerms: string[];
    highlightedContent: string;
}

// 텍스트 하이라이트
export const highlightText = (text: string, query: string): string => {
    if (!query.trim()) return text;

    const terms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    let highlightedText = text;

    terms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
};

// 검색 관련성 점수 계산
export const calculateRelevance = (entry: DiaryEntry, query: string): number => {
    const content = entry.content.toLowerCase();
    const queryLower = query.toLowerCase();
    const terms = queryLower.split(' ').filter(term => term.length > 0);

    let score = 0;
    const contentLength = content.length;

    terms.forEach(term => {
        // 정확한 매치
        const exactMatches = (content.match(new RegExp(term, 'g')) || []).length;
        score += exactMatches * 10;

        // 단어 시작 부분 매치
        const wordStartMatches = (content.match(new RegExp(`\\b${term}`, 'g')) || []).length;
        score += wordStartMatches * 5;

        // 부분 매치
        if (content.includes(term)) {
            score += 2;
        }
    });

    // 문서 길이로 정규화
    return score / Math.log(contentLength + 1);
};

// 일기 검색
export const searchDiaries = (entries: DiaryEntry[], options: SearchOptions): SearchResult[] => {
    let filteredEntries = entries;

    // 날짜 필터링
    if (options.startDate) {
        filteredEntries = filteredEntries.filter(entry => entry.date >= options.startDate!);
    }

    if (options.endDate) {
        filteredEntries = filteredEntries.filter(entry => entry.date <= options.endDate!);
    }

    // 기분 필터링
    if (options.mood) {
        filteredEntries = filteredEntries.filter(entry => entry.mood === options.mood);
    }

    // 텍스트 검색
    const results: SearchResult[] = [];

    if (options.query.trim()) {
        filteredEntries.forEach(entry => {
            const relevance = calculateRelevance(entry, options.query);
            const terms = options.query.toLowerCase().split(' ').filter(term => term.length > 0);
            const matchedTerms = terms.filter(term =>
                entry.content.toLowerCase().includes(term)
            );

            if (relevance > 0) {
                results.push({
                    entry,
                    relevance,
                    matchedTerms,
                    highlightedContent: highlightText(entry.content, options.query)
                });
            }
        });
    } else {
        // 쿼리가 없으면 모든 필터된 항목 반환
        filteredEntries.forEach(entry => {
            results.push({
                entry,
                relevance: 0,
                matchedTerms: [],
                highlightedContent: entry.content
            });
        });
    }

    // 정렬
    results.sort((a, b) => {
        if (options.sortBy === 'relevance') {
            return options.sortOrder === 'asc' ? a.relevance - b.relevance : b.relevance - a.relevance;
        } else {
            const dateA = parseDate(a.entry.date);
            const dateB = parseDate(b.entry.date);
            return options.sortOrder === 'asc'
                ? dateA.getTime() - dateB.getTime()
                : dateB.getTime() - dateA.getTime();
        }
    });

    return results;
};

// 검색 제안
export const getSearchSuggestions = (entries: DiaryEntry[], query: string): string[] => {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    entries.forEach(entry => {
        const words = entry.content.toLowerCase().split(/\s+/);
        words.forEach(word => {
            if (word.length > 2 && word.startsWith(queryLower)) {
                suggestions.add(word);
            }
        });
    });

    return Array.from(suggestions).slice(0, 10);
};
