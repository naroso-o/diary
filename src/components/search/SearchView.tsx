import { Search } from 'lucide-react'
import type { ViewType } from '../../types'

interface SearchViewProps {
    onDateSelect: (date: string) => void
    onViewChange: (view: ViewType) => void
}

export const SearchView = ({ onDateSelect, onViewChange }: SearchViewProps) => {
    return (
        <div className="p-6">
            <div className="text-center py-20">
                <Search className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-pink-800 mb-2">검색 기능</h2>
                <p className="text-pink-600">검색 기능이 곧 추가될 예정입니다.</p>
            </div>
        </div>
    )
}