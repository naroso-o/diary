export interface DiaryEntry {
    id: string;
    user_id: string;
    date: string;
    content: string;
    mood: MoodType;
    created_at: string;
    updated_at: string;
    word_count?: number;
    tags?: string[];
    attachments?: string[];
    is_favorite?: boolean;
    is_private?: boolean;
}

export type MoodType =
    | 'very-happy'
    | 'happy'
    | 'good'
    | 'normal'
    | 'tired'
    | 'sad'
    | 'angry'
    | 'sick';

export interface MoodEmoji {
    id: MoodType;
    emoji: string;
    label: string;
    color: string;
}

export interface DiaryStore {
    entries: Record<string, DiaryEntry>;
    loading: boolean;
    connected: boolean;
    error: string | null;
    currentUser: User | null;
    selectedDate: string;
    currentView: ViewType;
    draftEntries: Record<string, Partial<DiaryEntry>>;
    lastSyncTime: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setSelectedDate: (date: string) => void;
    setCurrentView: (view: ViewType) => void;
    setError: (error: string | null) => void;

    // Async actions
    fetchEntries: () => Promise<void>;
    addEntry: (date: string, content: string, mood: MoodType) => Promise<void>;
    updateEntry: (date: string, content: string, mood: MoodType) => Promise<void>;
    deleteEntry: (date: string) => Promise<void>;
    saveDraft: (date: string, draft: Partial<DiaryEntry>) => void;
    clearDraft: (date: string) => void;
    syncEntries: () => Promise<void>;
    clearEntries: () => void;

    // Computed
    getEntriesByDateRange: (start: string, end: string) => DiaryEntry[];
    getEntriesByMood: (mood: MoodType) => DiaryEntry[];
    getTotalEntries: () => number;
    getCurrentEntry: () => DiaryEntry | undefined;
    getDraft: (date: string) => Partial<DiaryEntry> | undefined;
}

export interface User {
    id: string
    email: string
    created_at: string
    updated_at: string
    display_name?: string
    avatar_url?: string
    timezone?: string
    locale?: string
    email_verified?: boolean
    profile_completed?: boolean
}

export type ViewType = 'diary' | 'calendar' | 'search' | 'stats' | 'settings';

export interface CalendarDay {
    date: Date;
    dateString: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasEntry: boolean;
    entry?: DiaryEntry;
    isPreviousMonth: boolean;
    isNextMonth: boolean;
    isSelectable: boolean;
    isWeekend: boolean;
    isHoliday?: boolean;
    events?: CalendarEvent[];
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'entry' | 'reminder' | 'milestone';
    color?: string;
}

export interface CalendarStats {
    totalDays: number;
    daysWithEntries: number;
    completionRate: number;
    moodDistribution: Record<MoodType, number>;
    streak: number;
    longestStreak: number;
    averageWordsPerDay: number;
    mostProductiveDay: string;
    favoriteWritingTime: string;
    totalWords: number;
    avgMoodScore: number;
}

export interface NotificationProps {
    id?: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
    duration?: number;
    persistent?: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
    onClose?: () => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    tooltip?: string;
    'data-testid'?: string;
}

export interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    showWordCount?: boolean;
    maxLength?: number;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
    autoHeight?: boolean;
    'data-testid'?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closable?: boolean;
    centered?: boolean;
    backdrop?: boolean;
    keyboard?: boolean;
    footer?: React.ReactNode;
    className?: string;
    'data-testid'?: string;
}

export interface TooltipProps {
    content: string;
    children: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    trigger?: 'hover' | 'click' | 'focus';
    delay?: number;
    disabled?: boolean;
    className?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
    data: T;
    error: string | null;
    message?: string;
    status: number;
    timestamp: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    offset?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
}

export interface DiaryFilter {
    startDate?: string;
    endDate?: string;
    mood?: MoodType;
    search?: string;
    tags?: string[];
    isFavorite?: boolean;
    isPrivate?: boolean;
    hasAttachments?: boolean;
}

// 폼 상태 타입
export interface DiaryFormData {
    content: string;
    mood: MoodType;
    date: string;
    tags?: string[];
    isFavorite?: boolean;
    isPrivate?: boolean;
}

export interface DiaryFormErrors {
    content?: string;
    mood?: string;
    date?: string;
    tags?: string;
    general?: string;
}

export interface AuthFormData {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
    rememberMe?: boolean;
}

export interface AuthFormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
    general?: string;
}

// 훅 반환 타입
export interface UseDiaryReturn {
    currentEntry: DiaryEntry | undefined;
    isEditing: boolean;
    formData: DiaryFormData;
    errors: DiaryFormErrors;
    loading: boolean;
    hasChanges: boolean;
    wordCount: number;

    // Actions
    setIsEditing: (editing: boolean) => void;
    setFormData: (data: Partial<DiaryFormData>) => void;
    handleSave: () => Promise<boolean>;
    handleDelete: () => Promise<boolean>;
    handleCancel: () => void;
    validateForm: () => boolean;
    resetForm: () => void;
    saveDraft: () => void;
    clearDraft: () => void;
    toggleFavorite: () => void;
    togglePrivate: () => void;
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
}

export interface UseCalendarReturn {
    currentDate: Date;
    selectedDate: string;
    calendarData: {
        year: number;
        month: number;
        monthYear: string;
        days: CalendarDay[];
        stats: CalendarStats;
        events: CalendarEvent[];
    };

    // Navigation
    goToNextMonth: () => void;
    goToPreviousMonth: () => void;
    goToToday: () => void;
    goToDate: (date: string) => void;
    goToSpecificMonth: (year: number, month: number) => void;

    // Selection
    selectDate: (date: string) => void;

    // View options
    showWeekends: boolean;
    showOtherMonths: boolean;
    setShowWeekends: (show: boolean) => void;
    setShowOtherMonths: (show: boolean) => void;
}

export interface UseSearchReturn {
    // State
    query: string;
    mood: MoodType | undefined;
    startDate: string;
    endDate: string;
    sortBy: 'date' | 'relevance' | 'mood';
    sortOrder: 'asc' | 'desc';
    isSearching: boolean;

    // Results
    searchResults: SearchResult[];
    suggestions: string[];
    searchHistory: string[];
    hasActiveSearch: boolean;
    hasResults: boolean;
    resultCount: number;

    // Actions
    setQuery: (query: string) => void;
    handleQueryChange: (query: string) => void;
    setMood: (mood: MoodType | undefined) => void;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    setSortBy: (sort: 'date' | 'relevance' | 'mood') => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    applyFilters: (filters: Partial<DiaryFilter>) => void;
    clearSearch: () => void;
    clearHistory: () => void;
    saveToHistory: (query: string) => void;
    removeFromHistory: (query: string) => void;
}

export interface UseSettingsReturn {
    settings: AppSettings;
    isLoading: boolean;
    hasChanges: boolean;

    // Actions
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
    updateTheme: (theme: Theme) => void;
    resetSettings: () => void;
    saveSettings: () => Promise<boolean>;
    exportSettings: () => string;
    importSettings: (data: string) => Promise<boolean>;
}

export interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isEmailVerified: boolean;

    // Actions
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<{ success: boolean; error?: string }>;
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
    resendVerification: () => Promise<{ success: boolean; error?: string }>;
    clearError: () => void;
}

// 이벤트 타입
export interface DiaryEvent {
    type: 'created' | 'updated' | 'deleted' | 'favorited' | 'unfavorited';
    entry: DiaryEntry;
    timestamp: string;
    userId: string;
    metadata?: Record<string, any>;
}

// 테마 타입
export interface Theme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        accent?: string;
        muted?: string;
        border?: string;
        error?: string;
        warning?: string;
        success?: string;
        info?: string;
    };
    typography?: {
        fontFamily?: string;
        fontSize?: string;
        lineHeight?: string;
    };
    spacing?: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    borderRadius?: {
        sm: string;
        md: string;
        lg: string;
    };
    shadows?: {
        sm: string;
        md: string;
        lg: string;
    };
}

// 설정 타입
export interface AppSettings {
    // 외관
    theme: Theme;
    fontSize: 'sm' | 'md' | 'lg';
    language: string;

    // 기능
    notifications: boolean;
    autoSave: boolean;
    showMoodInCalendar: boolean;
    enableSearchSuggestions: boolean;
    enableSpellCheck: boolean;
    showWordCount: boolean;

    // 내보내기
    exportIncludeMood: boolean;
    exportIncludeMetadata: boolean;
    defaultExportFormat: 'json' | 'csv' | 'txt' | 'pdf';

    // 캘린더
    calendarStartsMonday: boolean;
    showWeekends: boolean;
    showOtherMonths: boolean;

    // 백업
    autoBackup: boolean;
    backupInterval: number;
    maxBackups: number;

    // 보안
    enablePassword: boolean;
    sessionTimeout: number;

    // 개인화
    dailyReminder: boolean;
    reminderTime: string;
    defaultMood: MoodType;
    privateModeDefault: boolean;

    // 접근성
    highContrast: boolean;
    reduceMotion: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;

    // 개발자
    debugMode: boolean;
    enableAnalytics: boolean;
    betaFeatures: boolean;
}

// 통계 타입
export interface DiaryStats {
    totalEntries: number;
    totalWords: number;
    averageWordsPerEntry: number;
    longestEntry: number;
    shortestEntry: number;
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    writingDays: number;
    completionRate: number;

    // 기분 통계
    mostCommonMood: MoodType;
    averageMoodScore: number;
    moodDistribution: Record<MoodType, number>;
    moodTrends: Array<{ date: string; mood: MoodType; score: number }>;

    // 시간 통계
    entriesThisWeek: number;
    entriesThisMonth: number;
    entriesThisYear: number;
    weeklyActivity: number[];
    monthlyActivity: Array<{ month: string; count: number }>;
    yearlyActivity: Array<{ year: string; count: number }>;

    // 태그 통계
    topTags: Array<{ tag: string; count: number }>;
    tagDistribution: Record<string, number>;

    // 시간대 통계
    writingTimeDistribution: Record<string, number>;
    mostProductiveHour: number;
    mostProductiveDay: string;

    // 첨부파일 통계
    totalAttachments: number;
    attachmentTypes: Record<string, number>;

    // 즐겨찾기 통계
    favoriteEntries: number;
    favoriteRate: number;

    // 개인 정보
    privateEntries: number;
    privateRate: number;
}

// 검색 결과 타입
export interface SearchResult {
    entry: DiaryEntry;
    relevance: number;
    matchedTerms: string[];
    highlightedContent: string;
    score: number;
    type: 'content' | 'mood' | 'tag' | 'date';
}

// 내보내기 타입
export interface ExportOptions {
    format: 'json' | 'csv' | 'txt' | 'pdf';
    dateRange: {
        start: string;
        end: string;
    };
    includeMood: boolean;
    includeMetadata: boolean;
    includeTags: boolean;
    includeAttachments: boolean;
    includePrivate: boolean;
    template?: string;
    groupBy?: 'date' | 'mood' | 'tag' | 'month';
    sortBy?: 'date' | 'mood' | 'length';
    sortOrder?: 'asc' | 'desc';
}

// 백업 타입
export interface BackupData {
    version: string;
    exportDate: string;
    userId: string;
    entries: DiaryEntry[];
    settings: AppSettings;
    metadata: {
        totalEntries: number;
        dateRange: {
            start: string;
            end: string;
        };
        appVersion: string;
        deviceInfo: string;
        exportMethod: 'manual' | 'auto';
    };
}

// 가져오기 타입
export interface ImportOptions {
    format: 'json' | 'csv' | 'txt';
    overwrite: boolean;
    mergeDuplicates: boolean;
    preserveIds: boolean;
    validateData: boolean;
    backupBefore: boolean;
}

// 알림 타입
export interface NotificationSettings {
    enabled: boolean;
    types: {
        daily: boolean;
        weekly: boolean;
        achievements: boolean;
        reminders: boolean;
        system: boolean;
    };
    schedule: {
        daily: string;
        weekly: string;
    };
    sound: boolean;
    vibration: boolean;
    badge: boolean;
}

// 키보드 단축키 타입
export interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
}

// 플러그인 타입 (향후 확장용)
export interface Plugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    enabled: boolean;
    config: Record<string, any>;
    hooks: {
        beforeSave?: (entry: DiaryEntry) => DiaryEntry | Promise<DiaryEntry>;
        afterSave?: (entry: DiaryEntry) => void | Promise<void>;
        beforeDelete?: (entry: DiaryEntry) => boolean | Promise<boolean>;
        afterDelete?: (entry: DiaryEntry) => void | Promise<void>;
    };
}

// 에러 타입
export interface AppError {
    code: string;
    message: string;
    details?: string;
    timestamp: string;
    stack?: string;
    userId?: string;
    context?: Record<string, any>;
}

// 성능 메트릭 타입
export interface PerformanceMetrics {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
    bundleSize: number;
    apiResponseTime: number;
    errorRate: number;
    userInteractions: number;
    sessionDuration: number;
}

// 분석 이벤트 타입
export interface AnalyticsEvent {
    name: string;
    properties: Record<string, any>;
    timestamp: string;
    userId?: string;
    sessionId: string;
    page: string;
    userAgent: string;
    referrer?: string;
}

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
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    TOAST_DURATION: 3000,
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
    SELECTED_DATE: 'diary-selected-date',
    CURRENT_VIEW: 'diary-current-view',
    SIDEBAR_COLLAPSED: 'diary-sidebar-collapsed',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    SAVE_ERROR: '일기 저장에 실패했습니다.',
    LOAD_ERROR: '일기를 불러오는데 실패했습니다.',
    DELETE_ERROR: '일기 삭제에 실패했습니다.',
    VALIDATION_ERROR: '입력 내용을 확인해주세요.',
    PERMISSION_ERROR: '접근 권한이 없습니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
    SAVE_SUCCESS: '일기가 저장되었습니다.',
    UPDATE_SUCCESS: '일기가 수정되었습니다.',
    DELETE_SUCCESS: '일기가 삭제되었습니다.',
} as const;

// src/types/index.ts
export interface DiaryEntry {
    id: string;
    user_id: string;
    date: string;
    content: string;
    mood: MoodType;
    created_at: string;
    updated_at: string;
}

export interface MoodEmoji {
    id: MoodType;
    emoji: string;
    label: string;
    color: string;
}

export interface DiaryStore {
    entries: Record<string, DiaryEntry>;
    loading: boolean;
    connected: boolean;
    currentUser: User | null;
    selectedDate: string;
    currentView: ViewType;
    setUser: (user: User | null) => void;
    setSelectedDate: (date: string) => void;
    setCurrentView: (view: ViewType) => void;
    fetchEntries: () => Promise<void>;
    addEntry: (date: string, content: string, mood: MoodType) => Promise<void>;
    updateEntry: (date: string, content: string, mood: MoodType) => Promise<void>;
    deleteEntry: (date: string) => Promise<void>;
    clearEntries: () => void;
}

export interface User {
    id: string;
    email: string;
    created_at: string;
    display_name?: string;
    avatar_url?: string;
}


export interface CalendarDay {
    date: Date;
    dateString: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasEntry: boolean;
    entry?: DiaryEntry;
    isPreviousMonth: boolean;
    isNextMonth: boolean;
    isSelectable: boolean;
}

export interface CalendarStats {
    totalDays: number;
    daysWithEntries: number;
    completionRate: number;
    moodDistribution: Record<MoodType, number>;
    streak: number;
    longestStreak: number;
}

export interface NotificationProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
    onClose?: () => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    loading?: boolean;
    icon?: React.ReactNode;
}

export interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// API 응답 타입
export interface ApiResponse<T> {
    data: T;
    error: string | null;
    message?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
}

export interface DiaryFilter {
    startDate?: string;
    endDate?: string;
    mood?: MoodType;
    search?: string;
}

// 폼 상태 타입
export interface DiaryFormData {
    content: string;
    mood: MoodType;
    date: string;
}

export interface DiaryFormErrors {
    content?: string;
    mood?: string;
    date?: string;
}

// 훅 반환 타입
export interface UseDiaryReturn {
    currentEntry: DiaryEntry | undefined;
    isEditing: boolean;
    formData: DiaryFormData;
    errors: DiaryFormErrors;
    loading: boolean;
    setIsEditing: (editing: boolean) => void;
    setFormData: (data: Partial<DiaryFormData>) => void;
    handleSave: () => Promise<boolean>;
    handleDelete: () => Promise<boolean>;
    validateForm: () => boolean;
    resetForm: () => void;
}

export interface UseCalendarReturn {
    currentDate: Date;
    calendarData: {
        year: number;
        month: number;
        monthYear: string;
        days: CalendarDay[];
        stats: CalendarStats;
        events: CalendarEvent[];
    };
    goToNextMonth: () => void;
    goToPreviousMonth: () => void;
    goToToday: () => void;
    goToSpecificMonth: (year: number, month: number) => void;
}

// 이벤트 타입
export interface DiaryEvent {
    type: 'created' | 'updated' | 'deleted' | 'favorited' | 'unfavorited';
    entry: DiaryEntry;
    timestamp: string;
}

// 테마 타입
export interface Theme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        accent?: string;
        muted?: string;
        border?: string;
        error?: string;
        warning?: string;
        success?: string;
        info?: string;
    };
}

// 설정 타입
export interface AppSettings {
    theme: Theme;
    language: string;
    notifications: boolean;
    autoSave: boolean;
    fontSize: 'sm' | 'md' | 'lg';
}

// 통계 타입
export interface DiaryStats {
    totalEntries: number;
    currentStreak: number;
    longestStreak: number;
    averageWordsPerEntry: number;
    mostCommonMood: MoodType;
    entriesThisMonth: number;
    entriesThisYear: number;
    moodDistribution: Record<MoodType, number>;
    weeklyActivity: number[];
    monthlyActivity: { month: string; count: number }[];
}

// 검색 결과 타입
export interface SearchResult {
    entry: DiaryEntry;
    matches: {
        content: string[];
        highlight: string;
    };
    relevance: number;
}

// 내보내기 타입
export interface ExportOptions {
    format: 'json' | 'csv' | 'txt' | 'pdf';
    dateRange: {
        start: string;
        end: string;
    };
    includeMood: boolean;
    includeMetadata: boolean;
    includeTags: boolean;
    includeAttachments: boolean;
    includePrivate: boolean;
    template?: string;
    groupBy?: 'date' | 'mood' | 'tag' | 'month';
    sortBy?: 'date' | 'mood' | 'length';
    sortOrder?: 'asc' | 'desc';
}

// 백업 타입
export interface BackupData {
    version: string;
    exportDate: string;
    entries: DiaryEntry[];
    settings: AppSettings;
    metadata: {
        totalEntries: number;
        dateRange: {
            start: string;
            end: string;
        };
        appVersion: string;
        deviceInfo: string;
        exportMethod: 'manual' | 'auto';
    };
}