
import type { CalendarDay as CalendarDayType } from '../../utils/calendarUtils';
import { DAYS_OF_WEEK } from '../../utils/consts';
import { CalendarDay } from './CalendarDay';

interface CalendarGridProps {
    days: CalendarDayType[];
    onDateClick: (dateString: string) => void;
}

export const CalendarGrid = ({ days, onDateClick }: CalendarGridProps) => {
    return (
        <div className="space-y-4">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="text-center p-2 font-semibold text-pink-700">
                        {day}
                    </div>
                ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                    <CalendarDay
                        key={`${day.dateString}-${index}`}
                        day={day}
                        onClick={() => onDateClick(day.dateString)}
                    />
                ))}
            </div>
        </div>
    );
};