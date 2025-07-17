import type { MoodType } from '../../types';
import { MOOD_EMOJIS } from '../../utils/consts';
import clsx from 'clsx';

interface MoodStatsProps {
    moodDistribution: Record<MoodType, number>;
    totalEntries: number;
    className?: string;
}

export const MoodStats = ({
    moodDistribution,
    totalEntries,
    className = '',
}: MoodStatsProps) => {
    const sortedMoods = MOOD_EMOJIS.map(mood => ({
        ...mood,
        count: moodDistribution[mood.id] || 0,
        percentage: totalEntries > 0 ? ((moodDistribution[mood.id] || 0) / totalEntries) * 100 : 0,
    })).sort((a, b) => b.count - a.count);

    const topMood = sortedMoods[0];

    return (
        <div className={clsx('space-y-4', className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-pink-800">기분 통계</h3>
                {topMood && topMood.count > 0 && (
                    <div className="flex items-center gap-2 text-sm text-pink-600">
                        <span>최다 기분</span>
                        <span className="text-base">{topMood.emoji}</span>
                        <span className="font-medium">{topMood.label}</span>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                {sortedMoods.map(mood => (
                    <div key={mood.id} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-[100px]">
                            <span className="text-lg">{mood.emoji}</span>
                            <span className="text-sm text-gray-700">{mood.label}</span>
                        </div>

                        <div className="flex-1 relative">
                            <div className="bg-pink-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full transition-all duration-500 rounded-full"
                                    style={{
                                        width: `${mood.percentage}%`,
                                        background: `linear-gradient(135deg, ${mood.color
                                            .replace('from-', '')
                                            .replace(' to-', ', ')})`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 min-w-[60px] text-right">
                            {mood.count}회 ({mood.percentage.toFixed(1)}%)
                        </div>
                    </div>
                ))}
            </div>

            {totalEntries === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">아직 기분 데이터가 없습니다.</p>
                    <p className="text-xs mt-1">일기를 작성하여 기분을 기록해보세요!</p>
                </div>
            )}
        </div>
    );
};
