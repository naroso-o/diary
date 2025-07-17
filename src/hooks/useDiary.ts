import { useState, useEffect } from 'react';
import { useDiaryStore } from '../stores/diaryStore';
import type { MoodType, DiaryFormData, DiaryFormErrors, DiaryEntry } from '../types';
import { DEFAULT_MOOD, APP_CONFIG } from '../utils/consts';

export const useDiary = (selectedDate: string) => {
    const { entries, loading, addEntry, updateEntry, deleteEntry } = useDiaryStore() as { entries: Record<string, DiaryEntry>; loading: boolean; addEntry: (date: string, content: string, mood: MoodType) => Promise<void>; updateEntry: (date: string, content: string, mood: MoodType) => Promise<void>; deleteEntry: (date: string) => Promise<void> };
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<DiaryFormData>({
        content: '',
        mood: DEFAULT_MOOD,
        date: selectedDate,
    });
    const [errors, setErrors] = useState<DiaryFormErrors>({});

    const currentEntry = entries[selectedDate];

    // 폼 데이터 초기화
    useEffect(() => {
        if (currentEntry) {
            setFormData({
                content: currentEntry.content,
                mood: currentEntry.mood,
                date: selectedDate,
            });
        } else {
            setFormData({
                content: '',
                mood: DEFAULT_MOOD,
                date: selectedDate,
            });
        }
        setErrors({});
    }, [currentEntry, selectedDate]);

    // 유효성 검사
    const validateForm = (): boolean => {
        const newErrors: DiaryFormErrors = {};

        if (!formData.content.trim()) {
            newErrors.content = '일기 내용을 입력해주세요.';
        } else if (formData.content.length > APP_CONFIG.MAX_DIARY_LENGTH) {
            newErrors.content = `일기 내용은 ${APP_CONFIG.MAX_DIARY_LENGTH}자 이하로 입력해주세요.`;
        }

        if (!formData.mood) {
            newErrors.mood = '기분을 선택해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 폼 데이터 업데이트
    const updateFormData = (field: keyof DiaryFormData, value: string | MoodType) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // 실시간 유효성 검사
        if (field === 'content' && errors.content) {
            const trimmedValue = (value as string).trim();
            if (trimmedValue && trimmedValue.length <= APP_CONFIG.MAX_DIARY_LENGTH) {
                setErrors(prev => ({ ...prev, content: undefined }));
            }
        }

        if (field === 'mood' && errors.mood) {
            setErrors(prev => ({ ...prev, mood: undefined }));
        }
    };

    // 저장
    const handleSave = async (): Promise<boolean> => {
        if (!validateForm()) return false;

        try {
            const trimmedContent = formData.content.trim();
            if (currentEntry) {
                await updateEntry(selectedDate, trimmedContent, formData.mood);
            } else {
                await addEntry(selectedDate, trimmedContent, formData.mood);
            }
            setIsEditing(false);
            return true;
        } catch (error) {
            console.error('일기 저장 실패:', error);
            return false;
        }
    };

    // 삭제
    const handleDelete = async (): Promise<boolean> => {
        if (!currentEntry) return false;

        try {
            await deleteEntry(selectedDate);
            setIsEditing(false);
            return true;
        } catch (error) {
            console.error('일기 삭제 실패:', error);
            return false;
        }
    };

    // 편집 시작
    const startEditing = () => {
        setIsEditing(true);
    };

    // 편집 취소
    const cancelEditing = () => {
        setIsEditing(false);
        if (currentEntry) {
            setFormData({
                content: currentEntry.content,
                mood: currentEntry.mood,
                date: selectedDate,
            });
        } else {
            setFormData({
                content: '',
                mood: DEFAULT_MOOD,
                date: selectedDate,
            });
        }
        setErrors({});
    };

    // 폼 리셋
    const resetForm = () => {
        setFormData({
            content: '',
            mood: DEFAULT_MOOD,
            date: selectedDate,
        });
        setErrors({});
    };

    return {
        currentEntry,
        isEditing,
        formData,
        errors,
        loading,
        setIsEditing,
        updateFormData,
        handleSave,
        handleDelete,
        startEditing,
        cancelEditing,
        validateForm,
        resetForm,
    };
};