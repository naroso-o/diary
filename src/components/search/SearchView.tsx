import type { DiaryEntry, MoodType, ViewType } from '../../types'
import { useSearch } from '../../hooks/useSearch'
import { useDiaryStore } from '../../stores/diaryStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useEffect, useState } from 'react'
import { getMoodEmoji } from '../../utils/consts'
import { SearchCard } from './SearchCard'
import { SearchParaph } from './SearchParaph'

interface SearchViewProps {
    onDateSelect: (date: string) => void
    onViewChange: (view: ViewType) => void
}

export const SearchView = ({ onDateSelect, onViewChange }: SearchViewProps) => {

    const { entries } = useDiaryStore() as { entries: Record<string, DiaryEntry> }
    const { searchResults, handleQueryChange, query } = useSearch(Object.values(entries) as DiaryEntry[])

    const [inputValue, setInputValue] = useState(query)

    useEffect(() => {
        handleQueryChange(inputValue)
    }, [inputValue])

    return (
        <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Input placeholder="Search" value={inputValue} onChange={setInputValue} />
            </div>

            <div className="flex flex-col gap-2">
                {searchResults.map((result) => (
                    <SearchParaph key={result.entry.date} entry={result.entry} />
                ))}
            </div>
            {/* <div className="text-center py-20">
                <Search className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-pink-800 mb-2">검색 기능</h2>
                <p className="text-pink-600">검색 기능이 곧 추가될 예정입니다.</p>
            </div> */}

            {searchResults.length === 0 && <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-pink-800">모든 일기</h2>
                {Object.values(entries).map((entry) => (
                    <SearchCard key={entry.date} entry={entry} />
                ))}
            </div>}
        </div>
    )
}