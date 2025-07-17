import type { DiaryEntry } from "../../types"
import { formatDateForDisplay } from "../../utils/dateUtils"
import { MoodDisplay } from "../mood/MoodDisplay"

interface DiaryCardProps {
    entry: DiaryEntry
}

export const DiaryCard = ({ entry }: DiaryCardProps) => {
    return (
        <div className="diary-card p-6">
            {/* 기분 표시 */}
            <div className="mb-4">
                <MoodDisplay mood={entry.mood} />
            </div>

            {/* 구분선 */}
            <div className="border-t border-pink-100 pt-4 mb-4">
                <div className="prose prose-pink max-w-none">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                    </p>
                </div>
            </div>

            {/* 메타데이터 */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-pink-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDateForDisplay(entry.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                            {entry.updated_at && entry.updated_at !== entry.created_at
                                ? `수정됨 ${new Date(entry.updated_at).toLocaleString('ko-KR')}`
                                : `작성됨 ${new Date(entry.created_at).toLocaleString('ko-KR')}`
                            }
                        </span>
                    </div>
                </div>
                <div className="text-gray-400">
                    {entry.content.length.toLocaleString()}자
                </div>
            </div>
        </div>
    )
}