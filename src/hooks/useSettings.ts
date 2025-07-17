import { useState, useCallback, useEffect } from 'react';
import type { AppSettings, Theme } from '../types';
import { STORAGE_KEYS } from '../utils/consts';

const DEFAULT_SETTINGS: AppSettings = {
    theme: {
        name: 'default',
        colors: {
            primary: '#ec4899',
            secondary: '#f59e0b',
            background: '#fdf2f8',
            surface: '#ffffff',
            text: '#1f2937'
        }
    },
    language: 'ko',
    notifications: true,
    autoSave: true,
    fontSize: 'md'
};

export const useSettings = () => {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // 설정 로드
    useEffect(() => {
        const loadSettings = () => {
            try {
                const savedSettings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    setSettings({ ...DEFAULT_SETTINGS, ...parsed });
                }
            } catch (error) {
                console.error('설정 로드 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, []);

    // 설정 저장
    const saveSettings = useCallback((newSettings: AppSettings) => {
        try {
            localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('설정 저장 실패:', error);
        }
    }, []);

    // 개별 설정 업데이트
    const updateSetting = useCallback(<K extends keyof AppSettings>(
        key: K,
        value: AppSettings[K]
    ) => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
    }, [settings, saveSettings]);

    // 테마 변경
    const updateTheme = useCallback((theme: Theme) => {
        updateSetting('theme', theme);
    }, [updateSetting]);

    // 설정 초기화
    const resetSettings = useCallback(() => {
        saveSettings(DEFAULT_SETTINGS);
    }, [saveSettings]);

    return {
        settings,
        isLoading,
        updateSetting,
        updateTheme,
        resetSettings,
        saveSettings
    };
};