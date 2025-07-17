
import { useCalendar } from '../../hooks/useCalendar';
import { useDiaryStore } from '../../stores/diaryStore';
import type { DiaryEntry } from '../../types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

interface CalendarViewProps {
  onDateSelect: (date: string) => void;
  onViewChange: (view: 'diary') => void;
}
export const CalendarView = ({ onDateSelect, onViewChange }: CalendarViewProps) => {
  const { entries } = useDiaryStore() as { entries: Record<string, DiaryEntry> };
  const { calendarData, goToNextMonth, goToPreviousMonth, goToToday } = useCalendar(entries);

  const handleDateClick = (dateString: string) => {
    onDateSelect(dateString);
    onViewChange('diary');
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="calendar-container">
        <CalendarHeader
          monthYear={calendarData.monthYear}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onTodayClick={goToToday}
          stats={calendarData.stats}
        />
        <CalendarGrid
          days={calendarData.days}
          onDateClick={handleDateClick}
        />
      </div>
    </div>
  );
};