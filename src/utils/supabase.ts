// src/utils/supabase.ts - 에러 수정된 버전
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { DiaryEntry, MoodType, User } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
})

// 데이터베이스 테이블 타입 정의
export interface DatabaseDiaryEntry {
    id: string
    user_id: string
    date: string
    content: string
    mood: MoodType
    word_count?: number
    tags?: string[]
    is_favorite?: boolean
    is_private?: boolean
    created_at: string
    updated_at: string
}

export interface DatabaseUser {
    id: string
    email: string
    display_name?: string
    avatar_url?: string
    timezone?: string
    locale?: string
    created_at: string
    updated_at: string
}

// 에러 처리 클래스
class SupabaseError extends Error {
    public code?: string
    public details?: any

    constructor(
        message: string,
        code?: string,
        details?: any
    ) {
        super(message)
        this.name = 'SupabaseError'
        this.code = code
        this.details = details
    }
}

const handleSupabaseError = (error: any, context: string): never => {
    console.error(`Supabase error in ${context}:`, error)

    if (error?.code === 'PGRST116') {
        throw new SupabaseError('데이터를 찾을 수 없습니다.', error.code, error)
    }

    if (error?.code === '23505') {
        throw new SupabaseError('이미 존재하는 데이터입니다.', error.code, error)
    }

    if (error?.code === '42501') {
        throw new SupabaseError('접근 권한이 없습니다.', error.code, error)
    }

    throw new SupabaseError(
        error?.message || '알 수 없는 오류가 발생했습니다.',
        error?.code,
        error
    )
}

// 인증 관련 API
export const authAPI = {
    // 현재 사용자 조회
    async getCurrentUser(): Promise<User | null> {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()

            if (error) {
                // AuthSessionMissingError는 로그인하지 않은 상태에서 발생하는 정상적인 에러
                if (error.message.includes('session_not_found') ||
                    error.message.includes('Auth session missing')) {
                    return null
                }
                handleSupabaseError(error, 'getCurrentUser')
            }

            if (!user) return null

            // 사용자 프로필 정보 가져오기
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileError && profileError.code !== 'PGRST116') {
                console.warn('Profile fetch failed:', profileError)
            }

            return {
                id: user.id,
                email: user.email!,
                created_at: user.created_at,
                updated_at: profile?.updated_at || user.created_at,
                display_name: profile?.display_name || undefined,
                avatar_url: profile?.avatar_url || undefined,
                timezone: profile?.timezone || undefined,
                locale: profile?.locale || undefined,
                email_verified: user.email_confirmed_at !== null,
                profile_completed: !!profile?.display_name
            }
        } catch (error) {
            console.error('Error getting current user:', error)
            return null
        }
    },

    // 로그인
    async signIn(email: string, password: string): Promise<{ user: User }> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                handleSupabaseError(error, 'signIn')
            }

            if (!data.user) {
                throw new SupabaseError('로그인에 실패했습니다.')
            }

            const user = await authAPI.getCurrentUser()
            if (!user) {
                throw new SupabaseError('사용자 정보를 불러올 수 없습니다.')
            }

            return { user }
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'signIn')
        }
    },

    // 회원가입
    async signUp(email: string, password: string, displayName?: string): Promise<{ user: User }> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName
                    }
                }
            })

            if (error) {
                handleSupabaseError(error, 'signUp')
            }

            if (!data.user) {
                throw new SupabaseError('회원가입에 실패했습니다.')
            }

            // 사용자 프로필 생성 (이미 존재하는 경우 무시)
            const { error: profileError } = await supabase
                .from('user_profiles')
                .upsert([{
                    id: data.user.id,
                    email: data.user.email,
                    display_name: displayName || null,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: navigator.language
                }], {
                    onConflict: 'id',
                    ignoreDuplicates: false
                })

            if (profileError) {
                console.warn('Profile creation failed:', profileError)
                // 프로필 생성 실패가 회원가입 실패를 의미하지는 않으므로 계속 진행
            }

            const user = await authAPI.getCurrentUser()
            if (!user) {
                throw new SupabaseError('사용자 정보를 불러올 수 없습니다.')
            }

            return { user }
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'signUp')
        }
    },

    // 로그아웃
    async signOut(): Promise<void> {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {
                handleSupabaseError(error, 'signOut')
            }
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'signOut')
        }
    },

    // 비밀번호 재설정
    async resetPassword(email: string): Promise<void> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            if (error) {
                handleSupabaseError(error, 'resetPassword')
            }
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'resetPassword')
        }
    }
}

// 일기 관련 API
export const diaryAPI = {
    // 모든 일기 조회
    async fetchEntries(userId: string): Promise<{ entries: DiaryEntry[]; total: number }> {
        try {
            const { data, error, count } = await supabase
                .from('diary_entries')
                .select('*', { count: 'exact' })
                .eq('user_id', userId)
                .order('date', { ascending: false })

            if (error) {
                handleSupabaseError(error, 'fetchEntries')
            }

            return {
                entries: data || [],
                total: count || 0
            }
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'fetchEntries')
        }
    },

    // 특정 날짜 일기 조회
    async getEntryByDate(userId: string, date: string): Promise<DiaryEntry | null> {
        try {
            const { data, error } = await supabase
                .from('diary_entries')
                .select('*')
                .eq('user_id', userId)
                .eq('date', date)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return null
                }
                handleSupabaseError(error, 'getEntryByDate')
            }

            return data
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'getEntryByDate')
        }
    },

    // 일기 생성
    async createEntry(
        userId: string,
        date: string,
        content: string,
        mood: MoodType,
        options: {
            tags?: string[]
            isFavorite?: boolean
            isPrivate?: boolean
        } = {}
    ): Promise<DiaryEntry> {
        try {
            const wordCount = content.trim().split(/\s+/).length

            const { data, error } = await supabase
                .from('diary_entries')
                .insert([{
                    user_id: userId,
                    date,
                    content,
                    mood,
                    word_count: wordCount,
                    tags: options.tags || [],
                    is_favorite: options.isFavorite || false,
                    is_private: options.isPrivate || false
                }])
                .select()
                .single()

            if (error) {
                handleSupabaseError(error, 'createEntry')
            }

            return data
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'createEntry')
        }
    },

    // 일기 수정
    async updateEntry(
        userId: string,
        date: string,
        content: string,
        mood: MoodType,
        options: {
            tags?: string[]
            isFavorite?: boolean
            isPrivate?: boolean
        } = {}
    ): Promise<DiaryEntry> {
        try {
            const wordCount = content.trim().split(/\s+/).length

            const updateData: Partial<DatabaseDiaryEntry> = {
                content,
                mood,
                word_count: wordCount,
                updated_at: new Date().toISOString()
            }

            if (options.tags !== undefined) updateData.tags = options.tags
            if (options.isFavorite !== undefined) updateData.is_favorite = options.isFavorite
            if (options.isPrivate !== undefined) updateData.is_private = options.isPrivate

            const { data, error } = await supabase
                .from('diary_entries')
                .update(updateData)
                .eq('user_id', userId)
                .eq('date', date)
                .select()
                .single()

            if (error) {
                handleSupabaseError(error, 'updateEntry')
            }

            return data
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'updateEntry')
        }
    },

    // 일기 삭제
    async deleteEntry(userId: string, date: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('diary_entries')
                .delete()
                .eq('user_id', userId)
                .eq('date', date)

            if (error) {
                handleSupabaseError(error, 'deleteEntry')
            }
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'deleteEntry')
        }
    }
}

// 설정 관련 API
export const settingsAPI = {
    // 사용자 설정 조회
    async getSettings(userId: string): Promise<Record<string, any> | null> {
        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return null
                }
                handleSupabaseError(error, 'getSettings')
            }

            return data?.settings || null
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'getSettings')
        }
    },

    // 사용자 설정 저장
    async saveSettings(userId: string, settings: Record<string, any>): Promise<void> {
        try {
            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: userId,
                    settings,
                    updated_at: new Date().toISOString()
                })

            if (error) {
                handleSupabaseError(error, 'saveSettings')
            }
        } catch (error) {
            if (error instanceof SupabaseError) throw error
            handleSupabaseError(error, 'saveSettings')
        }
    }
}

// 환경 변수 검증
export const validateEnvironment = (): void => {
    const requiredEnvVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY'
    ]

    const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName])

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
    }

    // URL 형식 검증
    try {
        new URL(import.meta.env.VITE_SUPABASE_URL)
    } catch {
        throw new Error('VITE_SUPABASE_URL is not a valid URL')
    }
}

// 초기화 함수
export const initializeSupabase = async (): Promise<void> => {
    try {
        validateEnvironment()
        console.log('Supabase initialized successfully')
    } catch (error) {
        console.error('Failed to initialize Supabase:', error)
        throw error
    }
}

export default supabase