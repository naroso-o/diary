import { useState, useMemo } from 'react';
import { generateCalendarGrid, navigateCalendar, getMonthlyStats } from '../utils/calendarUtils';
import { formatMonthYear } from '../utils/dateUtils';
import type { DiaryEntry } from '../types';

export const useCalendar = (entries: Record<string, DiaryEntry>) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        return {
            year,
            month,
            monthYear: formatMonthYear(currentDate),
            days: generateCalendarGrid(year, month, entries),
            stats: getMonthlyStats(year, month, entries),
        };
    }, [currentDate, entries]);

    const goToNextMonth = () => {
        setCurrentDate(current => navigateCalendar(current, 'next'));
    };

    const goToPreviousMonth = () => {
        setCurrentDate(current => navigateCalendar(current, 'prev'));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const goToSpecificMonth = (year: number, month: number) => {
        setCurrentDate(new Date(year, month));
    };

    return {
        currentDate,
        calendarData,
        goToNextMonth,
        goToPreviousMonth,
        goToToday,
        goToSpecificMonth,
    };
};