
import { formatDateForDisplay, isDateToday } from '../../utils/dateUtils';

interface EmptyDiaryStateProps {
    date: string;
    onStartWriting: () => void;
}
export const EmptyDiaryState = ({
    date,
    onStartWriting,
}: EmptyDiaryStateProps) => {
    const isToday = isDateToday(date);

    const motivationalMessages = [
        "오늘의 순간들을 기록해보세요",
        "작은 일상도 소중한 추억이 됩니다",
        "당신의 이야기를 들려주세요",
        "감정을 글로 표현해보세요",
        "하루를 돌아보는 시간을 가져보세요",
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    return (
        <div className="empty-state animate-fade-in">
            <div className="empty-state-icon">
                <div className="relative">
                    <svg className="w-16 h-16 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <div className="absolute -top-2 -right-2 animate-gentle-bounce">
                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                </div>
            </div>

            <h2 className="empty-state-title">
                {isToday ? '오늘의 일기를 시작해보세요' : '새로운 일기를 작성하세요'}
            </h2>

            <p className="empty-state-description">
                {randomMessage}
            </p>

            <div className="mb-6 flex items-center justify-center gap-2 text-pink-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">{formatDateForDisplay(date)}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>

            <button
                onClick={onStartWriting}
                className="btn-primary transform hover:scale-105 shadow-glow"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isToday ? '일기 쓰기' : '일기 작성'}
            </button>

            <div className="mt-4 text-xs text-pink-400">
                💡 {isToday ? '오늘 하루는 어떠셨나요?' : '그날의 기억을 되살려보세요'}
            </div>
        </div>
    );
};