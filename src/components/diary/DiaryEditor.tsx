import type { MoodType } from '../../types';
import { MoodSelector } from '../mood/MoodSelector';

interface DiaryEditorProps {
    content: string;
    mood: MoodType;
    errors: { content?: string; mood?: string };
    loading: boolean;
    onContentChange: (content: string) => void;
    onMoodChange: (mood: MoodType) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export const DiaryEditor = ({
    content,
    mood,
    errors,
    loading,
    onContentChange,
    onMoodChange,
    onSave,
    onCancel,
    isEditing = false,
}: DiaryEditorProps) => {
    const wordCount = content.length;
    const maxWords = 5000;
    const isOverLimit = wordCount > maxWords;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+Enter로 저장
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            onSave();
        }
        // Escape로 취소
        if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
    };

    return (
        <div className="space-y-6">
            {/* 기분 선택 */}
            <div>
                <MoodSelector
                    selectedMood={mood}
                    onMoodChange={onMoodChange}
                    error={errors.mood}
                />
            </div>

            {/* 일기 내용 작성 */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-pink-800">오늘의 이야기</h3>
                    <div className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-pink-600'}`}>
                        {wordCount.toLocaleString()} / {maxWords.toLocaleString()}자
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => onContentChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="오늘은 어떤 하루를 보내셨나요? 자유롭게 적어보세요..."
                        className={`input-field h-80 ${errors.content ? 'border-red-400 focus:border-red-500' : ''}`}
                        disabled={loading}
                    />

                    {/* 에러 메시지 */}
                    {errors.content && (
                        <p className="mt-2 text-sm text-red-500">{errors.content}</p>
                    )}

                    {/* 도움말 텍스트 */}
                    <p className="mt-2 text-xs text-pink-500">
                        💡 Ctrl+Enter로 저장, Escape로 취소할 수 있습니다.
                    </p>
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
                <button
                    onClick={onSave}
                    disabled={loading || isOverLimit || !content.trim()}
                    className="btn-primary"
                >
                    {loading ? (
                        <div className="loading-spinner" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                    )}
                    {isEditing ? '수정' : '저장'}
                </button>

                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="btn-secondary"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    취소
                </button>
            </div>
        </div>
    );
};