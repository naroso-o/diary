import { useState } from 'react';
import type { MoodType } from '../../types';
import { MOOD_EMOJIS, getMoodEmoji } from '../../utils/consts';
import clsx from 'clsx';

interface MoodSelectorProps {
    selectedMood: MoodType;
    onMoodChange: (mood: MoodType) => void;
    error?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const MoodSelector = ({
    selectedMood,
    onMoodChange,
    error,
    disabled = false,
    size = 'md',
}: MoodSelectorProps) => {
    const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null);

    const sizeClasses = {
        sm: 'grid-cols-4 gap-2',
        md: 'grid-cols-4 gap-3',
        lg: 'grid-cols-2 gap-4',
    };

    const buttonSizeClasses = {
        sm: 'p-2 text-lg',
        md: 'p-3 text-2xl',
        lg: 'p-4 text-3xl',
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-xs',
        lg: 'text-sm',
    };

    const handleMoodClick = (mood: MoodType) => {
        if (!disabled) {
            onMoodChange(mood);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, mood: MoodType) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMoodClick(mood);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-pink-800">
                    오늘의 기분은 어떠세요?
                </h3>
                {hoveredMood && (
                    <div className="text-sm text-pink-600 animate-fade-in">
                        {getMoodEmoji(hoveredMood).label}
                    </div>
                )}
            </div>

            <div className={clsx('grid', sizeClasses[size])}>
                {MOOD_EMOJIS.map((mood) => {
                    const isSelected = selectedMood === mood.id;
                    const isHovered = hoveredMood === mood.id;

                    return (
                        <button
                            key={mood.id}
                            onClick={() => handleMoodClick(mood.id)}
                            onKeyDown={(e) => handleKeyDown(e, mood.id)}
                            onMouseEnter={() => setHoveredMood(mood.id)}
                            onMouseLeave={() => setHoveredMood(null)}
                            disabled={disabled}
                            className={clsx(
                                'mood-button',
                                buttonSizeClasses[size],
                                {
                                    'mood-button-active': isSelected,
                                    'mood-button-inactive': !isSelected,
                                    'opacity-50 cursor-not-allowed': disabled,
                                    'scale-110': isHovered && !disabled,
                                }
                            )}
                            style={
                                isSelected
                                    ? {
                                        background: `linear-gradient(135deg, ${mood.color
                                            .replace('from-', '')
                                            .replace(' to-', ', ')})`,
                                    }
                                    : {}
                            }
                            aria-label={`${mood.label} 기분 선택`}
                            aria-pressed={isSelected}
                        >
                            <div className="mb-1 transition-transform duration-200">
                                {mood.emoji}
                            </div>
                            <div
                                className={clsx(
                                    'font-medium transition-colors duration-200',
                                    textSizeClasses[size],
                                    {
                                        'text-white': isSelected,
                                        'text-gray-600': !isSelected,
                                    }
                                )}
                            >
                                {mood.label}
                            </div>
                        </button>
                    );
                })}
            </div>

            {error && (
                <p className="text-sm text-red-500 mt-2" role="alert">
                    {error}
                </p>
            )}

            <div className="text-xs text-pink-500 mt-2">
                💡 현재 기분을 선택하면 일기와 함께 저장됩니다.
            </div>
        </div>
    );
};