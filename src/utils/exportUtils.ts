import type { DiaryEntry, ExportOptions } from '../types';
import { formatDateForDisplay } from './dateUtils';
import { getMoodEmoji } from './consts';

// JSON 내보내기
export const exportToJSON = (entries: DiaryEntry[], options: ExportOptions): string => {
    const filteredEntries = filterEntriesByDateRange(entries, options.dateRange);

    const exportData = {
        exportDate: new Date().toISOString(),
        dateRange: options.dateRange,
        totalEntries: filteredEntries.length,
        entries: filteredEntries.map(entry => ({
            date: entry.date,
            content: entry.content,
            mood: options.includeMood ? entry.mood : undefined,
            ...(options.includeMetadata && {
                created_at: entry.created_at,
                updated_at: entry.updated_at
            })
        }))
    };

    return JSON.stringify(exportData, null, 2);
};

// CSV 내보내기
export const exportToCSV = (entries: DiaryEntry[], options: ExportOptions): string => {
    const filteredEntries = filterEntriesByDateRange(entries, options.dateRange);

    const headers = ['날짜', '내용'];
    if (options.includeMood) headers.push('기분');
    if (options.includeMetadata) headers.push('작성일', '수정일');

    const csvRows = [headers.join(',')];

    filteredEntries.forEach(entry => {
        const row = [
            `"${formatDateForDisplay(entry.date)}"`,
            `"${entry.content.replace(/"/g, '""')}"`
        ];

        if (options.includeMood) {
            const mood = getMoodEmoji(entry.mood);
            row.push(`"${mood.emoji} ${mood.label}"`);
        }

        if (options.includeMetadata) {
            row.push(`"${new Date(entry.created_at).toLocaleString('ko-KR')}"`);
            row.push(`"${new Date(entry.updated_at).toLocaleString('ko-KR')}"`);
        }

        csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
};

// 텍스트 내보내기
export const exportToText = (entries: DiaryEntry[], options: ExportOptions): string => {
    const filteredEntries = filterEntriesByDateRange(entries, options.dateRange);

    const lines: string[] = [];
    lines.push('='.repeat(50));
    lines.push('나의 일기 내보내기');
    lines.push(`내보낸 날짜: ${new Date().toLocaleString('ko-KR')}`);
    lines.push(`기간: ${formatDateForDisplay(options.dateRange.start)} ~ ${formatDateForDisplay(options.dateRange.end)}`);
    lines.push(`총 ${filteredEntries.length}개의 일기`);
    lines.push('='.repeat(50));
    lines.push('');

    filteredEntries.forEach((entry, index) => {
        lines.push(`${index + 1}. ${formatDateForDisplay(entry.date)}`);

        if (options.includeMood) {
            const mood = getMoodEmoji(entry.mood);
            lines.push(`기분: ${mood.emoji} ${mood.label}`);
        }

        lines.push('');
        lines.push(entry.content);
        lines.push('');

        if (options.includeMetadata) {
            lines.push(`작성일: ${new Date(entry.created_at).toLocaleString('ko-KR')}`);
            lines.push(`수정일: ${new Date(entry.updated_at).toLocaleString('ko-KR')}`);
        }

        lines.push('-'.repeat(30));
        lines.push('');
    });

    return lines.join('\n');
};

// 날짜 범위로 필터링
const filterEntriesByDateRange = (entries: DiaryEntry[], dateRange: { start: string; end: string }): DiaryEntry[] => {
    return entries.filter(entry => entry.date >= dateRange.start && entry.date <= dateRange.end);
};

// 파일 다운로드
export const downloadFile = (content: string, filename: string, contentType: string): void => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// 내보내기 실행
export const exportDiaries = (entries: DiaryEntry[], options: ExportOptions): void => {
    const timestamp = new Date().toISOString().slice(0, 10);

    switch (options.format) {
        case 'json':
            const jsonContent = exportToJSON(entries, options);
            downloadFile(jsonContent, `diary-export-${timestamp}.json`, 'application/json');
            break;

        case 'csv':
            const csvContent = exportToCSV(entries, options);
            downloadFile(csvContent, `diary-export-${timestamp}.csv`, 'text/csv');
            break;

        case 'txt':
            const textContent = exportToText(entries, options);
            downloadFile(textContent, `diary-export-${timestamp}.txt`, 'text/plain');
            break;

        default:
            throw new Error('지원하지 않는 내보내기 형식입니다.');
    }
};

// src/hooks/useSearch.