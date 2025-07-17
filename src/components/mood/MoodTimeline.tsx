import type { DiaryEntry, MoodType } from '../../types';
import { getMoodEmoji } from '../../utils/consts';
import { formatDateForDisplay } from '../../utils/dateUtils';
import clsx from 'clsx';

interface MoodTimelineProps {
    entries: DiaryEntry[];
    onEntryClick?: (entry: DiaryEntry) => void;
    maxItems?: number;
    className?: string;
}

export const MoodTimeline: React.FC<MoodTimelineProps> = ({
    entries,
    onEntryClick,
    maxItems = 7,
    className = '',
}) => {
    const recentEntries = entries
        .slice(0, maxItems)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const moodLevels: Record<MoodType, number> = {
        'very-happy': 10,
        'happy': 8,
        'good': 7,
        'normal': 5,
        'tired': 4,
        'sad': 3,
        'angry': 2,
        'sick': 1,
    };

    const getMoodColor = (mood: MoodType) => {
        const level = moodLevels[mood];
        if (level >= 8) return 'bg-green-100 border-green-300';
        if (level >= 6) return 'bg-yellow-100 border-yellow-300';
        if (level >= 4) return 'bg-orange-100 border-orange-300';
        return 'bg-red-100 border-red-300';
    };

    if (recentEntries.length === 0) {
        return (
            <div className={clsx('text-center py-8 text-gray-500', className)}>
                <p className="text-sm">최근 기분 기록이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className={clsx('space-y-3', className)}>
            <h3 className="text-lg font-semibold text-pink-800">최근 기분 변화</h3>

            <div className="space-y-2">
                {recentEntries.map((entry, index) => {
                    const mood = getMoodEmoji(entry.mood);
                    const isLatest = index === 0;

                    return (
                        <div
                            key={entry.id}
                            className={clsx(
                                'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer',
                                getMoodColor(entry.mood),
                                {
                                    'ring-2 ring-pink-300': isLatest,
                                    'hover:scale-105': onEntryClick,
                                }
                            )}
                            onClick={() => onEntryClick?.(entry)}
                        >
                            <div className="flex-shrink-0">
                                <span className="text-xl">{mood.emoji}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-800">
                                        {mood.label}
                                    </span>
                                    {isLatest && (
                                        <span className="px-2 py-1 bg-pink-500 text-white text-xs rounded-full">
                                            최근
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 truncate">
                                    {formatDateForDisplay(entry.date)}
                                </p>
                            </div>

                            <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {entries.length > maxItems && (
                <button className="w-full text-center text-sm text-pink-600 hover:text-pink-700 py-2">
                    더 보기 ({entries.length - maxItems}개 더)
                </button>
            )}
        </div>
    );
};
