import { format, isToday, isThisMonth, isThisYear, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'yyyy년 M월 d일 EEEE';
export const MONTH_YEAR_FORMAT = 'yyyy년 M월';

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 */
export const formatDateToString = (date: Date): string => {
    return format(date, DATE_FORMAT);
};

/**
 * 날짜를 한국어 형식으로 표시
 */
export const formatDateForDisplay = (dateString: string): string => {
    const date = parseISO(dateString);
    return format(date, DISPLAY_DATE_FORMAT, { locale: ko });
};

/**
 * 월/년 표시용 포맷
 */
export const formatMonthYear = (date: Date): string => {
    return format(date, MONTH_YEAR_FORMAT, { locale: ko });
};

/**
 * 오늘 날짜인지 확인
 */
export const isDateToday = (dateString: string): boolean => {
    const date = parseISO(dateString);
    return isToday(date);
};

/**
 * 이번 달인지 확인
 */
export const isDateThisMonth = (dateString: string): boolean => {
    const date = parseISO(dateString);
    return isThisMonth(date);
};

/**
 * 올해인지 확인
 */
export const isDateThisYear = (dateString: string): boolean => {
    const date = parseISO(dateString);
    return isThisYear(date);
};

/**
 * 현재 날짜 문자열 반환
 */
export const getCurrentDateString = (): string => {
    return formatDateToString(new Date());
};

/**
 * 날짜 문자열을 Date 객체로 변환
 */
export const parseDate = (dateString: string): Date => {
    return parseISO(dateString);
};

/**
 * 두 날짜 사이의 일수 계산
 */
export const getDaysBetween = (startDate: string, endDate: string): number => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return Math.abs(Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
};

/**
 * 특정 월의 모든 날짜 반환
 */
export const getDaysInMonth = (year: number, month: number): Date[] => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    return eachDayOfInterval({ start, end });
};

/**
 * 날짜의 요일 반환 (0: 일요일, 1: 월요일, ...)
 */
export const getDayOfWeek = (date: Date): number => {
    return getDay(date);
};