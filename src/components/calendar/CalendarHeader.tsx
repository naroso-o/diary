import React from 'react';

interface CalendarHeaderProps {
    monthYear: string;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onTodayClick: () => void;
    stats: {
        totalDays: number;
        daysWithEntries: number;
        completionRate: number;
    };
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    monthYear,
    onPreviousMonth,
    onNextMonth,
    onTodayClick,
    stats
}) => {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={onPreviousMonth}
                    className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                    aria-label="이전 달"
                >
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gradient mb-1">{monthYear}</h2>
                    <button
                        onClick={onTodayClick}
                        className="text-sm text-pink-600 hover:text-pink-700 transition-colors"
                    >
                        오늘로 이동
                    </button>
                </div>

                <button
                    onClick={onNextMonth}
                    className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                    aria-label="다음 달"
                >
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="bg-pink-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-pink-700">이번 달 일기</span>
                    </div>
                    <div className="text-pink-800 font-semibold">
                        {stats.daysWithEntries}/{stats.totalDays}일 ({stats.completionRate}%)
                    </div>
                </div>

                <div className="mt-2 bg-pink-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-pink-500 to-yellow-500 h-full transition-all duration-500"
                        style={{ width: `${stats.completionRate}%` }}
                    />
                </div>
            </div>
        </div>
    );
};