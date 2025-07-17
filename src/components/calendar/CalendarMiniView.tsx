import React from 'react';
import { useCalendar } from '../../hooks/useCalendar';
import { useDiaryStore } from '../../stores/diaryStore';
import { DAYS_OF_WEEK } from '../../utils/consts';
import clsx from 'clsx';
import type { DiaryEntry } from '../../types';

interface CalendarMiniViewProps {
    onDateSelect: (date: string) => void;
    selectedDate?: string;
}

export const CalendarMiniView = ({
    onDateSelect,
    selectedDate
}: CalendarMiniViewProps) => {
    const { entries } = useDiaryStore() as { entries: Record<string, DiaryEntry> };
    const { calendarData, goToNextMonth, goToPreviousMonth } = useCalendar(entries);

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-pink-100">
            {/* 미니 헤더 */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={goToPreviousMonth}
                    className="p-1 rounded hover:bg-pink-100 transition-colors"
                >
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h3 className="text-sm font-semibold text-pink-800">
                    {calendarData.monthYear}
                </h3>

                <button
                    onClick={goToNextMonth}
                    className="p-1 rounded hover:bg-pink-100 transition-colors"
                >
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* 미니 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="text-center text-xs text-pink-600 font-medium">
                        {day}
                    </div>
                ))}
            </div>

            {/* 미니 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1">
                {calendarData.days.map((day, index) => (
                    <button
                        key={`${day.dateString}-${index}`}
                        onClick={() => onDateSelect(day.dateString)}
                        className={clsx(
                            'text-xs p-1 rounded transition-colors relative',
                            {
                                'bg-gradient-to-br from-pink-400 to-yellow-400 text-white font-semibold':
                                    day.isCurrentMonth && day.hasEntry,
                                'hover:bg-pink-50 text-pink-700':
                                    day.isCurrentMonth && !day.hasEntry,
                                'text-pink-300': !day.isCurrentMonth,
                                'ring-2 ring-pink-500': day.dateString === selectedDate,
                                'bg-pink-200': day.isToday && day.dateString !== selectedDate,
                            }
                        )}
                    >
                        {day.dayNumber}
                        {day.hasEntry && (
                            <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* 미니 통계 */}
            <div className="mt-3 pt-3 border-t border-pink-100">
                <div className="flex justify-between text-xs text-pink-600">
                    <span>이번 달</span>
                    <span>{calendarData.stats.daysWithEntries}/{calendarData.stats.totalDays}일</span>
                </div>
                <div className="mt-1 bg-pink-200 rounded-full h-1 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-pink-500 to-yellow-500 h-full transition-all duration-300"
                        style={{ width: `${calendarData.stats.completionRate}%` }}
                    />
                </div>
            </div>
        </div>
    );
};