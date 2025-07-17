import type { CalendarDay as CalendarDayType } from '../../utils/calendarUtils';
import { getMoodEmoji } from '../../utils/consts';
import { isDateSelectable } from '../../utils/calendarUtils';
import clsx from 'clsx';

interface CalendarDayProps {
    day: CalendarDayType;
    onClick: () => void;
}

export const CalendarDay = ({ day, onClick }: CalendarDayProps) => {
    const isSelectable = isDateSelectable(day.dateString);
    const moodEmoji = day.entry ? getMoodEmoji(day.entry.mood) : null;

    const handleClick = () => {
        if (isSelectable) {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={!isSelectable}
            className={clsx(
                'calendar-day relative min-h-[3rem] flex flex-col items-center justify-center',
                {
                    // 현재 월의 날짜
                    'calendar-day-with-entry': day.isCurrentMonth && day.hasEntry,
                    'calendar-day-empty': day.isCurrentMonth && !day.hasEntry,

                    // 이전/다음 달 날짜
                    'calendar-day-other-month': !day.isCurrentMonth,

                    // 오늘 날짜
                    'calendar-day-today': day.isToday,

                    // 선택 불가능한 날짜 (미래)
                    'calendar-day-disabled': !isSelectable,

                    // 호버 효과 (선택 가능한 날짜만)
                    'hover:scale-105': isSelectable,
                }
            )}
            aria-label={`${day.dateString} ${day.hasEntry ? '일기 있음' : '일기 없음'}`}
        >
            {/* 날짜 숫자 */}
            <div className={clsx('text-sm font-medium', {
                'text-white': day.isCurrentMonth && day.hasEntry,
                'text-pink-700': day.isCurrentMonth && !day.hasEntry,
                'text-pink-300': !day.isCurrentMonth,
                'text-gray-400': !isSelectable,
            })}>
                {day.dayNumber}
            </div>

            {/* 기분 이모티콘 */}
            {moodEmoji && (
                <div className="absolute -top-1 -right-1 text-xs animate-gentle-bounce">
                    {moodEmoji.emoji}
                </div>
            )}

            {/* 일기 작성 표시 점 */}
            {day.hasEntry && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
            )}
        </button>
    );
};