import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Heart } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { validateEmail, validatePassword } from '../../utils/validationUtils'
import { LoadingSpinner } from '../layout/LoadingSpinner'

type AuthMode = 'login' | 'signup' | 'reset'

export const AuthView = () => {
    const { signIn, signUp, resetPassword, loading, error } = useAuth()
    const [mode, setMode] = useState<AuthMode>('login')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // 실시간 유효성 검사
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        // 이메일 검증
        const emailValidation = validateEmail(formData.email)
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.error!
        }

        // 비밀번호 검증 (로그인이 아닌 경우)
        if (mode !== 'reset') {
            const passwordValidation = validatePassword(formData.password)
            if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.error!
            }
        }

        // 회원가입 추가 검증
        if (mode === 'signup') {
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
            }

            if (!formData.displayName.trim()) {
                newErrors.displayName = '이름을 입력해주세요.'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            switch (mode) {
                case 'login':
                    await signIn(formData.email, formData.password)
                    break
                case 'signup':
                    await signUp(formData.email, formData.password, formData.displayName)
                    break
                case 'reset':
                    await resetPassword(formData.email)
                    setMode('login')
                    break
            }
        } catch (error) {
            console.error('Auth error:', error)
        }
    }

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            displayName: ''
        })
        setErrors({})
    }

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode)
        resetForm()
    }

    return (
        <div className="min-h-screen bg-warm-gradient flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200 p-8 w-full max-w-md">
                {/* 로고 및 타이틀 */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gradient mb-2">나의 일기</h1>
                    <p className="text-pink-600">
                        {mode === 'login' && '다시 만나서 반갑습니다!'}
                        {mode === 'signup' && '새로운 여정을 시작해보세요'}
                        {mode === 'reset' && '비밀번호를 재설정해드릴게요'}
                    </p>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm font-medium text-pink-800 mb-1">
                            이메일
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors ${errors.email ? 'border-red-400' : 'border-pink-200'
                                    }`}
                                placeholder="이메일을 입력하세요"
                                disabled={loading}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* 비밀번호 (재설정 모드가 아닌 경우) */}
                    {mode !== 'reset' && (
                        <div>
                            <label className="block text-sm font-medium text-pink-800 mb-1">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors ${errors.password ? 'border-red-400' : 'border-pink-200'
                                        }`}
                                    placeholder="비밀번호를 입력하세요"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>
                    )}

                    {/* 회원가입 추가 필드 */}
                    {mode === 'signup' && (
                        <>
                            {/* 비밀번호 확인 */}
                            <div>
                                <label className="block text-sm font-medium text-pink-800 mb-1">
                                    비밀번호 확인
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors ${errors.confirmPassword ? 'border-red-400' : 'border-pink-200'
                                            }`}
                                        placeholder="비밀번호를 다시 입력하세요"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* 이름 */}
                            <div>
                                <label className="block text-sm font-medium text-pink-800 mb-1">
                                    이름
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors ${errors.displayName ? 'border-red-400' : 'border-pink-200'
                                            }`}
                                        placeholder="이름을 입력하세요"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.displayName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-base font-medium"
                    >
                        {loading ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <>
                                {mode === 'login' && '로그인'}
                                {mode === 'signup' && '회원가입'}
                                {mode === 'reset' && '재설정 이메일 전송'}
                            </>
                        )}
                    </button>
                </form>

                {/* 모드 전환 링크 */}
                <div className="mt-6 text-center space-y-2">
                    {mode === 'login' && (
                        <>
                            <button
                                onClick={() => switchMode('signup')}
                                className="text-pink-600 hover:text-pink-700 text-sm"
                            >
                                계정이 없으신가요? 회원가입
                            </button>
                            <br />
                            <button
                                onClick={() => switchMode('reset')}
                                className="text-pink-500 hover:text-pink-600 text-sm"
                            >
                                비밀번호를 잊으셨나요?
                            </button>
                        </>
                    )}

                    {mode === 'signup' && (
                        <button
                            onClick={() => switchMode('login')}
                            className="text-pink-600 hover:text-pink-700 text-sm"
                        >
                            이미 계정이 있으신가요? 로그인
                        </button>
                    )}

                    {mode === 'reset' && (
                        <button
                            onClick={() => switchMode('login')}
                            className="text-pink-600 hover:text-pink-700 text-sm"
                        >
                            로그인으로 돌아가기
                        </button>
                    )}
                </div>

                {/* 푸터 */}
                <div className="mt-8 pt-6 border-t border-pink-100 text-center">
                    <p className="text-xs text-pink-500">
                        나의 일기와 함께 특별한 하루를 기록해보세요 💖
                    </p>
                </div>
            </div>
        </div>
    )
}