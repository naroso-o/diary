import type { MoodType } from '../../types';
import { getMoodEmoji } from '../../utils/consts';
import clsx from 'clsx';

interface MoodDisplayProps {
    mood: MoodType;
    showLabel?: boolean;
    showTrend?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const MoodDisplay = ({
    mood,
    showLabel = true,
    showTrend = false,
    size = 'md',
    className = '',
}: MoodDisplayProps) => {
    const moodData = getMoodEmoji(mood);

    const sizeClasses = {
        sm: 'p-2 text-sm',
        md: 'p-3 text-lg',
        lg: 'p-4 text-xl',
    };

    const emojiSizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
    };

    // 기분 레벨 (1-10 스케일)
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

    const getMoodTrend = (currentMood: MoodType) => {
        const level = moodLevels[currentMood];
        if (level >= 8) return 'up';
        if (level <= 3) return 'down';
        return 'stable';
    };

    const trend = getMoodTrend(mood);

    const TrendIcon = () => {
        switch (trend) {
            case 'up':
                return (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                );
            case 'down':
                return (
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                );
        }
    };

    return (
        <div className={clsx('flex items-center gap-3', className)}>
            {/* 기분 아이콘 */}
            <div
                className={clsx(
                    'rounded-full flex items-center justify-center',
                    sizeClasses[size]
                )}
                style={{
                    background: `linear-gradient(135deg, ${moodData.color
                        .replace('from-', '')
                        .replace(' to-', ', ')})`,
                }}
            >
                <span className={emojiSizeClasses[size]}>{moodData.emoji}</span>
            </div>

            {/* 기분 정보 */}
            {showLabel && (
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-pink-800">{moodData.label}</p>
                        {showTrend && <TrendIcon />}
                    </div>
                    <p className="text-sm text-pink-600">오늘의 기분</p>
                </div>
            )}
        </div>
    );
};