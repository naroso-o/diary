import { useState, useEffect } from 'react';
import { useDiaryStore } from '../../stores/diaryStore';
import { formatDateForDisplay } from '../../utils/dateUtils';
import type { DiaryEntry, MoodType } from '../../types';
import { DiaryEditor } from './DiaryEditor';
import { DiaryDisplay } from './DiaryDisplay';
import { EmptyDiaryState } from './EmptyDiaryState';

interface DiaryViewProps {
    selectedDate: string;
    onDateChange?: (date: string) => void;
}

export const DiaryView = ({ selectedDate, onDateChange }: DiaryViewProps) => {
    const { entries, loading, addEntry, updateEntry, deleteEntry } = useDiaryStore() as { entries: Record<string, DiaryEntry>; loading: boolean; addEntry: (date: string, content: string, mood: MoodType) => Promise<void>; updateEntry: (date: string, content: string, mood: MoodType) => Promise<void>; deleteEntry: (date: string) => Promise<void> } | { entries: Record<string, DiaryEntry>; loading: boolean; addEntry: (date: string, content: string, mood: MoodType) => Promise<void>; updateEntry: (date: string, content: string, mood: MoodType) => Promise<void>; deleteEntry: (date: string) => Promise<void> };
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        content: '',
        mood: 'normal' as MoodType,
    });
    const [errors, setErrors] = useState<{ content?: string; mood?: string }>({});

    const currentEntry = entries[selectedDate];

    // 폼 데이터 초기화
    useEffect(() => {
        if (currentEntry) {
            setFormData({
                content: currentEntry.content,
                mood: currentEntry.mood,
            });
        } else {
            setFormData({
                content: '',
                mood: 'normal',
            });
        }
        setErrors({});
    }, [currentEntry, selectedDate]);

    // 편집 모드 종료 시 폼 리셋
    useEffect(() => {
        if (!isEditing) {
            setErrors({});
        }
    }, [isEditing]);

    const validateForm = (): boolean => {
        const newErrors: { content?: string; mood?: string } = {};

        if (!formData.content.trim()) {
            newErrors.content = '일기 내용을 입력해주세요.';
        }

        if (formData.content.length > 5000) {
            newErrors.content = '일기 내용은 5000자 이하로 입력해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            if (currentEntry) {
                await updateEntry(selectedDate, formData.content.trim(), formData.mood);
            } else {
                await addEntry(selectedDate, formData.content.trim(), formData.mood);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('일기 저장 실패:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (currentEntry) {
            setFormData({
                content: currentEntry.content,
                mood: currentEntry.mood,
            });
        } else {
            setFormData({
                content: '',
                mood: 'normal',
            });
        }
        setErrors({});
    };

    const handleDelete = async () => {
        if (currentEntry && window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
            try {
                await deleteEntry(selectedDate);
                setIsEditing(false);
            } catch (error) {
                console.error('일기 삭제 실패:', error);
            }
        }
    };

    const handleFormChange = (field: string, value: string | MoodType) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // 실시간 유효성 검사
        if (field === 'content' && errors.content) {
            const trimmedValue = (value as string).trim();
            if (trimmedValue && trimmedValue.length <= 5000) {
                setErrors(prev => ({ ...prev, content: undefined }));
            }
        }
    };

    // 편집 모드
    if (isEditing) {
        return (
            <div className="p-6 animate-fade-in">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gradient mb-2">
                        {currentEntry ? '일기 수정' : '일기 작성'}
                    </h1>
                    <p className="text-pink-600">{formatDateForDisplay(selectedDate)}</p>
                </div>

                <DiaryEditor
                    content={formData.content}
                    mood={formData.mood}
                    errors={errors}
                    loading={loading}
                    onContentChange={(content: string) => handleFormChange('content', content)}
                    onMoodChange={(mood: MoodType) => handleFormChange('mood', mood)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={!!currentEntry}
                />
            </div>
        );
    }

    // 일기 표시 모드
    if (currentEntry) {
        return (
            <div className="p-6 animate-fade-in">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gradient mb-2">오늘의 일기</h1>
                    <p className="text-pink-600">{formatDateForDisplay(selectedDate)}</p>
                </div>

                <DiaryDisplay
                    entry={currentEntry}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                />
            </div>
        );
    }

    // 빈 상태
    return (
        <div className="p-6 flex items-center justify-center min-h-[80vh]">
            <EmptyDiaryState
                date={selectedDate}
                onStartWriting={() => setIsEditing(true)}
            />
        </div>
    );
};