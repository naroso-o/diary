import type { MoodEmoji, MoodType } from '../types';

export const MOOD_EMOJIS: MoodEmoji[] = [
    { id: 'very-happy', emoji: '😊', label: '매우 행복', color: 'from-yellow-400 to-orange-400' },
    { id: 'happy', emoji: '😄', label: '행복', color: 'from-yellow-300 to-yellow-500' },
    { id: 'good', emoji: '🙂', label: '좋음', color: 'from-green-300 to-green-500' },
    { id: 'normal', emoji: '😐', label: '보통', color: 'from-gray-300 to-gray-500' },
    { id: 'tired', emoji: '😴', label: '피곤', color: 'from-blue-300 to-blue-500' },
    { id: 'sad', emoji: '😢', label: '슬픔', color: 'from-blue-400 to-indigo-500' },
    { id: 'angry', emoji: '😠', label: '화남', color: 'from-red-400 to-red-600' },
    { id: 'sick', emoji: '🤒', label: '아픔', color: 'from-purple-400 to-purple-600' }
];

export const DEFAULT_MOOD: MoodType = 'normal';

export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'yyyy년 M월 d일 EEEE';

// 기분 이모티콘 조회 함수
export const getMoodEmoji = (moodId: MoodType): MoodEmoji => {
    return MOOD_EMOJIS.find(mood => mood.id === moodId) || MOOD_EMOJIS[3];
};

// 기분별 색상 조회 함수
export const getMoodColor = (moodId: MoodType): string => {
    const mood = getMoodEmoji(moodId);
    return mood.color;
};

// 애플리케이션 설정
export const APP_CONFIG = {
    MAX_DIARY_LENGTH: 5000,
    MIN_DIARY_LENGTH: 1,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    TOAST_DURATION: 3000,
    AUTO_SAVE_INTERVAL: 30000, // 30초
    SEARCH_SUGGESTIONS_LIMIT: 10,
    RECENT_ENTRIES_LIMIT: 7,
    PAGINATION_SIZE: 20,
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
    SELECTED_DATE: 'diary-selected-date',
    CURRENT_VIEW: 'diary-current-view',
    SIDEBAR_COLLAPSED: 'diary-sidebar-collapsed',
    APP_SETTINGS: 'diary-app-settings',
    SEARCH_HISTORY: 'diary-search-history',
    DRAFT_ENTRIES: 'diary-draft-entries',
    USER_PREFERENCES: 'diary-user-preferences',
    DIARY_STORE: 'diary-store',
    SEARCH_STORE: 'search-store',
    UI_STORE: 'ui-store',
    SETTINGS_STORE: 'settings-store',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    SAVE_ERROR: '일기 저장에 실패했습니다.',
    LOAD_ERROR: '일기를 불러오는데 실패했습니다.',
    DELETE_ERROR: '일기 삭제에 실패했습니다.',
    VALIDATION_ERROR: '입력 내용을 확인해주세요.',
    PERMISSION_ERROR: '접근 권한이 없습니다.',
    AUTH_ERROR: '인증에 실패했습니다.',
    EXPORT_ERROR: '내보내기에 실패했습니다.',
    IMPORT_ERROR: '가져오기에 실패했습니다.',
    SEARCH_ERROR: '검색에 실패했습니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
    SAVE_SUCCESS: '일기가 저장되었습니다.',
    UPDATE_SUCCESS: '일기가 수정되었습니다.',
    DELETE_SUCCESS: '일기가 삭제되었습니다.',
    EXPORT_SUCCESS: '내보내기가 완료되었습니다.',
    IMPORT_SUCCESS: '가져오기가 완료되었습니다.',
    SETTINGS_SAVED: '설정이 저장되었습니다.',
    LOGIN_SUCCESS: '로그인되었습니다.',
    LOGOUT_SUCCESS: '로그아웃되었습니다.',
    SIGNUP_SUCCESS: '회원가입이 완료되었습니다.',
} as const;

// 기본 테마
export const DEFAULT_THEMES = {
    default: {
        name: 'default',
        colors: {
            primary: '#ec4899',
            secondary: '#f59e0b',
            background: '#fdf2f8',
            surface: '#ffffff',
            text: '#1f2937'
        }
    },
    dark: {
        name: 'dark',
        colors: {
            primary: '#f472b6',
            secondary: '#fbbf24',
            background: '#1f2937',
            surface: '#374151',
            text: '#f9fafb'
        }
    },
    pastel: {
        name: 'pastel',
        colors: {
            primary: '#f8a2c2',
            secondary: '#fde68a',
            background: '#fef7f0',
            surface: '#ffffff',
            text: '#4a5568'
        }
    },
    nature: {
        name: 'nature',
        colors: {
            primary: '#48bb78',
            secondary: '#ed8936',
            background: '#f0fff4',
            surface: '#ffffff',
            text: '#2d3748'
        }
    }
} as const;

// 폰트 크기 설정
export const FONT_SIZES = {
    sm: {
        base: '14px',
        title: '20px',
        subtitle: '16px',
        small: '12px'
    },
    md: {
        base: '16px',
        title: '24px',
        subtitle: '18px',
        small: '14px'
    },
    lg: {
        base: '18px',
        title: '28px',
        subtitle: '20px',
        small: '16px'
    }
} as const;

// 언어 설정
export const LANGUAGES = {
    ko: '한국어',
    en: 'English',
    ja: '日本語'
} as const;

// 내보내기 형식
export const EXPORT_FORMATS = {
    json: 'JSON',
    csv: 'CSV',
    txt: 'Text',
    pdf: 'PDF'
} as const;

// 정렬 옵션
export const SORT_OPTIONS = {
    date: '날짜순',
    relevance: '관련성순',
    mood: '기분순'
} as const;

// 뷰 타입
export const VIEW_TYPES = {
    diary: '일기',
    calendar: '캘린더',
    search: '검색',
    stats: '통계',
    settings: '설정'
} as const;

// 알림 타입
export const NOTIFICATION_TYPES = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
} as const;

// 기본 설정 값
export const DEFAULT_SETTINGS = {
    theme: DEFAULT_THEMES.default,
    language: 'ko',
    notifications: true,
    autoSave: true,
    fontSize: 'md',
    showMoodInCalendar: true,
    enableSearchSuggestions: true,
    exportIncludeMood: true,
    exportIncludeMetadata: false,
    calendarStartsMonday: false,
    showWordCount: true,
    enableSpellCheck: true,
    autoBackup: false,
    backupInterval: 24, // 시간
} as const;

// 검색 설정
export const SEARCH_CONFIG = {
    minQueryLength: 2,
    maxSuggestions: 10,
    debounceDelay: 300,
    highlightClass: 'search-highlight',
    caseSensitive: false,
    wholeWords: false,
    useRegex: false,
} as const;

// 애니메이션 설정
export const ANIMATION_CONFIG = {
    duration: {
        fast: 150,
        normal: 300,
        slow: 500
    },
    easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
} as const;

// 미디어 쿼리 브레이크포인트
export const BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
} as const;

// 유효성 검사 규칙
export const VALIDATION_RULES = {
    diary: {
        content: {
            required: true,
            minLength: 1,
            maxLength: 5000
        }
    },
    auth: {
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        password: {
            required: true,
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
        }
    },
    search: {
        query: {
            minLength: 2,
            maxLength: 100
        }
    }
} as const;

// API 엔드포인트 (향후 확장용)
export const API_ENDPOINTS = {
    auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        logout: '/auth/logout',
        refresh: '/auth/refresh'
    },
    diary: {
        entries: '/diary/entries',
        entry: '/diary/entry',
        search: '/diary/search',
        export: '/diary/export',
        stats: '/diary/stats'
    },
    user: {
        profile: '/user/profile',
        settings: '/user/settings',
        preferences: '/user/preferences'
    }
} as const;

// 키보드 단축키
export const KEYBOARD_SHORTCUTS = {
    save: 'Ctrl+S',
    newEntry: 'Ctrl+N',
    search: 'Ctrl+F',
    cancel: 'Escape',
    submit: 'Ctrl+Enter',
    nextDay: 'ArrowRight',
    prevDay: 'ArrowLeft',
    today: 'Ctrl+T',
    calendar: 'Ctrl+C',
    settings: 'Ctrl+,'
} as const;

// 웹 접근성 설정
export const ACCESSIBILITY = {
    announcements: {
        entrySaved: '일기가 저장되었습니다.',
        entryDeleted: '일기가 삭제되었습니다.',
        searchCompleted: '검색이 완료되었습니다.',
        moodSelected: '기분이 선택되었습니다.',
        dateChanged: '날짜가 변경되었습니다.'
    },
    roles: {
        main: 'main',
        navigation: 'navigation',
        search: 'search',
        dialog: 'dialog',
        alert: 'alert',
        status: 'status'
    }
} as const;

// PWA 설정
export const PWA_CONFIG = {
    name: '나의 일기',
    shortName: '일기',
    description: '개인 일기 작성 및 관리 앱',
    themeColor: '#ec4899',
    backgroundColor: '#fdf2f8',
    display: 'standalone',
    orientation: 'portrait',
    startUrl: '/',
    scope: '/',
    icons: {
        sizes: ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'],
        purpose: ['any', 'maskable']
    }
} as const;

// 성능 최적화 설정
export const PERFORMANCE_CONFIG = {
    virtualScrolling: {
        enabled: true,
        itemHeight: 100,
        overscan: 5
    },
    lazyLoading: {
        enabled: true,
        threshold: 0.1,
        rootMargin: '50px'
    },
    caching: {
        enabled: true,
        maxSize: 100,
        ttl: 300000 // 5분
    }
} as const;

// 개발 모드 설정
export const DEV_CONFIG = {
    enableMockData: false,
    enableDebugMode: false,
    enablePerformanceMonitoring: false,
    mockDelay: 500,
    logLevel: 'info' as 'debug' | 'info' | 'warn' | 'error'
} as const;