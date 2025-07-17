
import {
    Menu,
    ArrowLeft,
    ArrowRight,
    Calendar,
    Search,
    Bell,
    User,
    LogOut,
    Settings,
    Moon,
    Sun
} from 'lucide-react'
import { formatDateForDisplay, getCurrentDateString } from '../../utils/dateUtils'
import { useAuth } from '../../hooks/useAuth'
import { useSettings } from '../../hooks/useSettings'
import type { ViewType } from '../../types'
import type { User as UserType } from '../../types'
import { Button } from '../ui/Button'

interface HeaderProps {
    currentView: ViewType
    selectedDate: string
    user: UserType | null
    onViewChange: (view: ViewType) => void
    onDateSelect: (date: string) => void
    sidebarCollapsed: boolean
    onToggleSidebar: () => void
}
export const Header = ({
    currentView,
    selectedDate,
    user,
    onViewChange,
    onDateSelect,
    sidebarCollapsed,
    onToggleSidebar
}: HeaderProps) => {
    const { signOut } = useAuth()
    const { settings, updateSetting } = useSettings()

    const viewTitles = {
        diary: '일기',
        calendar: '캘린더',
        search: '검색',
        stats: '통계',
        settings: '설정'
    }



    const toggleTheme = () => {
        const currentTheme = settings.theme.name
        const newTheme = currentTheme === 'dark' ? 'default' : 'dark'
        // 여기서 실제로는 테마 객체를 업데이트해야 함
        console.log('Toggle theme to:', newTheme)
    }

    const handleSignOut = async () => {
        if (confirm('로그아웃하시겠습니까?')) {
            await signOut()
        }
    }

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* 왼쪽 섹션 */}
                <div className="flex items-center gap-4">
                    {/* 모바일 메뉴 버튼 */}
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-pink-50 transition-colors md:hidden"
                        aria-label="메뉴 열기"
                    >
                        <Menu className="w-5 h-5 text-pink-600" />
                    </button>

                    {/* 현재 뷰 제목 */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-pink-800">
                            {viewTitles[currentView]}
                        </h1>


                    </div>
                </div>

                {/* 오른쪽 섹션 */}
                <div className="flex items-center gap-2">

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-pink-50 transition-colors"
                        title="테마 변경"
                    >
                        {settings.theme.name === 'dark' ? (
                            <Sun className="w-4 h-4 text-pink-600" />
                        ) : (
                            <Moon className="w-4 h-4 text-pink-600" />
                        )}
                    </button>

                    {/* 구분선 */}
                    <div className="hidden md:block w-px h-6 bg-pink-200 mx-2" />

                    {/* 사용자 메뉴 */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.display_name || '사용자'}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-pink-800">
                                    {user?.display_name || '사용자'}
                                </p>
                                <p className="text-xs text-pink-600">
                                    {user?.email}
                                </p>
                            </div>
                        </button>

                        {/* 드롭다운 메뉴 */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="py-2">
                                <button
                                    onClick={() => onViewChange('settings')}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-pink-700 hover:bg-pink-50 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    설정
                                </button>

                                <div className="border-t border-pink-100 my-1" />

                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}