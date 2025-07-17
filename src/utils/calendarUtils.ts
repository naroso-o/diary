import type { DiaryEntry } from '../types';
import { formatDateToString, getDaysInMonth, getDayOfWeek, isDateToday } from './dateUtils';

export interface CalendarDay {
    date: Date;
    dateString: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasEntry: boolean;
    entry?: DiaryEntry;
    isPreviousMonth: boolean;
    isNextMonth: boolean;
}

export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 캘린더 그리드용 날짜 배열 생성
 */
export const generateCalendarGrid = (
    year: number,
    month: number,
    entries: Record<string, DiaryEntry>
): CalendarDay[] => {
    const currentMonthDays = getDaysInMonth(year, month);
    // const firstDay = currentMonthDays[0];
    // const lastDay = currentMonthDays[currentMonthDays.length - 1];

    const startDayOfWeek = getDayOfWeek(currentMonthDays[0]);
    // const endDayOfWeek = getDayOfWeek(lastDay);

    const calendarDays: CalendarDay[] = [];

    // 이전 달의 마지막 날들
    const previousMonth = month === 0 ? 11 : month - 1;
    const previousYear = month === 0 ? year - 1 : year;
    const previousMonthDays = getDaysInMonth(previousYear, previousMonth);

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const date = previousMonthDays[previousMonthDays.length - 1 - i];
        const dateString = formatDateToString(date);

        calendarDays.push({
            date,
            dateString,
            dayNumber: date.getDate(),
            isCurrentMonth: false,
            isToday: isDateToday(dateString),
            hasEntry: !!entries[dateString],
            entry: entries[dateString],
            isPreviousMonth: true,
            isNextMonth: false,
        });
    }

    // 현재 달의 날들
    currentMonthDays.forEach(date => {
        const dateString = formatDateToString(date);

        calendarDays.push({
            date,
            dateString,
            dayNumber: date.getDate(),
            isCurrentMonth: true,
            isToday: isDateToday(dateString),
            hasEntry: !!entries[dateString],
            entry: entries[dateString],
            isPreviousMonth: false,
            isNextMonth: false,
        });
    });

    // 다음 달의 첫 번째 날들
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const nextMonthDays = getDaysInMonth(nextYear, nextMonth);

    const remainingDays = 42 - calendarDays.length; // 6주 * 7일 = 42개 셀

    for (let i = 0; i < remainingDays && i < nextMonthDays.length; i++) {
        const date = nextMonthDays[i];
        const dateString = formatDateToString(date);

        calendarDays.push({
            date,
            dateString,
            dayNumber: date.getDate(),
            isCurrentMonth: false,
            isToday: isDateToday(dateString),
            hasEntry: !!entries[dateString],
            entry: entries[dateString],
            isPreviousMonth: false,
            isNextMonth: true,
        });
    }

    return calendarDays;
};

/**
 * 특정 월의 다음 달로 이동
 */
export const getNextMonth = (currentDate: Date): Date => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
};

/**
 * 특정 월의 이전 달로 이동
 */
export const getPreviousMonth = (currentDate: Date): Date => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth;
};

/**
 * 특정 월의 일기 통계 계산
 */
export const getMonthlyStats = (
    year: number,
    month: number,
    entries: Record<string, DiaryEntry>
): {
    totalDays: number;
    daysWithEntries: number;
    completionRate: number;
    moodDistribution: Record<string, number>;
} => {
    const monthDays = getDaysInMonth(year, month);
    const totalDays = monthDays.length;

    let daysWithEntries = 0;
    const moodDistribution: Record<string, number> = {};

    monthDays.forEach(date => {
        const dateString = formatDateToString(date);
        const entry = entries[dateString];

        if (entry) {
            daysWithEntries++;
            moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
        }
    });

    const completionRate = Math.round((daysWithEntries / totalDays) * 100);

    return {
        totalDays,
        daysWithEntries,
        completionRate,
        moodDistribution,
    };
};

/**
 * 캘린더 네비게이션 헬퍼
 */
export const navigateCalendar = (currentDate: Date, direction: 'prev' | 'next'): Date => {
    return direction === 'prev' ? getPreviousMonth(currentDate) : getNextMonth(currentDate);
};

/**
 * 특정 날짜가 선택 가능한지 확인 (미래 날짜 제한 등)
 */
export const isDateSelectable = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();

    // 미래 날짜는 선택 불가
    return date <= today;
};

/**
 * 주별 그룹핑
 */
export const groupDaysByWeek = (days: CalendarDay[]): CalendarDay[][] => {
    const weeks: CalendarDay[][] = [];

    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return weeks;
};