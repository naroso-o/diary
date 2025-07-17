import { useState, useEffect, useCallback } from 'react'
import type { User } from '../types'
import { supabase, authAPI } from '../utils/supabase'

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 사용자 상태 확인
    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await authAPI.getCurrentUser()
                setUser(currentUser)
                setError(null) // 성공 시 에러 상태 초기화
            } catch (error: any) {
                // AuthSessionMissingError는 로그인하지 않은 상태에서 발생하는 정상적인 에러
                if (error.message && (
                    error.message.includes('session_not_found') ||
                    error.message.includes('Auth session missing')
                )) {
                    setUser(null)
                    setError(null)
                } else {
                    console.error('사용자 확인 실패:', error)
                    setError('사용자 정보를 불러올 수 없습니다.')
                }
            } finally {
                setLoading(false)
            }
        }

        checkUser()

        // 인증 상태 변경 리스너
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    try {
                        const currentUser = await authAPI.getCurrentUser()
                        setUser(currentUser)
                        setError(null)
                    } catch (error: any) {
                        console.error('인증 상태 변경 시 사용자 정보 로드 실패:', error)
                        setError('사용자 정보를 불러올 수 없습니다.')
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setError(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // 로그인
    const signIn = useCallback(async (email: string, password: string) => {
        setLoading(true)
        setError(null)

        try {
            const { user } = await authAPI.signIn(email, password)
            setUser(user)
            return { success: true }
        } catch (error: any) {
            setError(error.message || '로그인에 실패했습니다.')
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }, [])

    // 회원가입
    const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
        setLoading(true)
        setError(null)

        try {
            const { user } = await authAPI.signUp(email, password, displayName)
            setUser(user)
            return { success: true }
        } catch (error: any) {
            setError(error.message || '회원가입에 실패했습니다.')
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }, [])

    // 로그아웃
    const signOut = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            await authAPI.signOut()
            setUser(null)
            return { success: true }
        } catch (error: any) {
            setError(error.message || '로그아웃에 실패했습니다.')
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }, [])

    // 비밀번호 재설정
    const resetPassword = useCallback(async (email: string) => {
        setLoading(true)
        setError(null)

        try {
            await authAPI.resetPassword(email)
            return { success: true }
        } catch (error: any) {
            setError(error.message || '비밀번호 재설정에 실패했습니다.')
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        isAuthenticated: !!user
    }
}