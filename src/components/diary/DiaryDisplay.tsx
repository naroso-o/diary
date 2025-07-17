import { useState } from 'react';
import type { DiaryEntry } from '../../types';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { MoodDisplay } from '../mood/MoodDisplay';
import { Button } from '../ui/Button';

interface DiaryDisplayProps {
    entry: DiaryEntry;
    onEdit: () => void;
    onDelete: () => void;
    loading: boolean;
}

export const DiaryDisplay = ({
    entry,
    onEdit,
    onDelete,
    loading,
}: DiaryDisplayProps) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(entry.content);
            // 토스트 알림 (나중에 구현)
            console.log('내용이 복사되었습니다.');
        } catch (error) {
            console.error('복사 실패:', error);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${formatDateForDisplay(entry.date)} 일기`,
                    text: entry.content,
                });
            } catch (error) {
                console.error('공유 실패:', error);
            }
        } else {
            // 공유 API가 지원되지 않는 경우 클립보드 복사
            handleCopyContent();
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        onDelete();
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <div className="space-y-6">
            {/* 일기 카드 */}
            <div className="diary-card p-6">
                {/* 기분 표시 */}
                <div className="mb-4">
                    <MoodDisplay mood={entry.mood} />
                </div>

                {/* 구분선 */}
                <div className="border-t border-pink-100 pt-4 mb-4">
                    <div className="prose prose-pink max-w-none">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {entry.content}
                        </p>
                    </div>
                </div>

                {/* 메타데이터 */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-pink-50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDateForDisplay(entry.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {entry.updated_at && entry.updated_at !== entry.created_at
                                    ? `수정됨 ${new Date(entry.updated_at).toLocaleString('ko-KR')}`
                                    : `작성됨 ${new Date(entry.created_at).toLocaleString('ko-KR')}`
                                }
                            </span>
                        </div>
                    </div>
                    <div className="text-gray-400">
                        {entry.content.length.toLocaleString()}자
                    </div>
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
                <Button
                    onClick={onEdit}
                    disabled={loading}
                    variant="primary"
                    label="수정"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    }
                />

                <Button
                    onClick={handleCopyContent}
                    variant="secondary"
                    label="복사"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    }
                />

                <Button
                    onClick={handleShare}
                    variant="secondary"
                    label="공유"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                    }
                />

                <Button
                    onClick={handleDeleteClick}
                    disabled={loading}
                    variant="secondary"
                    label="삭제"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    }
                />
            </div>

            {/* 삭제 확인 모달 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-slide-in">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            일기 삭제 확인
                        </h3>
                        <p className="text-gray-600 mb-6">
                            정말로 이 일기를 삭제하시겠습니까? 삭제된 일기는 복구할 수 없습니다.
                        </p>
                        <div className="flex gap-2 justify-end">
                            <Button
                                onClick={cancelDelete}
                                variant="secondary"
                                label="취소"
                            />
                            <Button
                                onClick={confirmDelete}
                                variant="primary"
                                label="삭제"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};