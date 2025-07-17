/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_USE_MOCK: string
    readonly VITE_ENABLE_ANALYTICS: string
    readonly VITE_SENTRY_DSN: string
    readonly VITE_APP_VERSION: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// 글로벌 타입 확장
declare global {
    interface Window {
        supabase?: any
        diaryAPI?: any
        authAPI?: any
        gtag?: (...args: any[]) => void
    }
}

export { }