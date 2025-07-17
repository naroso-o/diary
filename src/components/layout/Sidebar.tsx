import {
    Calendar,
    Edit3,
    Search,
    Settings,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react'
import { CalendarMiniView } from '../calendar/CalendarMiniView'
import { useDiaryStore } from '../../stores/diaryStore'
import type { ViewType } from '../../types'

interface SidebarProps {
    currentView: ViewType
    selectedDate: string
    collapsed: boolean
    onViewChange: (view: ViewType) => void
    onDateSelect: (date: string) => void
    onToggleCollapse: () => void
}

export const Sidebar = ({
    currentView,
    selectedDate,
    collapsed,
    onViewChange,
    onDateSelect,
    onToggleCollapse
}: SidebarProps) => {
    const { entries } = useDiaryStore()

    const menuItems = [
        { id: 'diary' as ViewType, icon: Edit3, label: '오늘의 일기', shortcut: 'Ctrl+N' },
        { id: 'calendar' as ViewType, icon: Calendar, label: '캘린더', shortcut: 'Ctrl+C' },
        { id: 'search' as ViewType, icon: Search, label: '검색', shortcut: 'Ctrl+F' },
        { id: 'stats' as ViewType, icon: BarChart3, label: '통계', shortcut: 'Ctrl+B' },
        { id: 'settings' as ViewType, icon: Settings, label: '설정', shortcut: 'Ctrl+,' }
    ]

    return (
        <>
            {/* 모바일 오버레이 */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onToggleCollapse}
                />
            )}

            {/* 사이드바 */}
            <div className={`
        fixed md:relative top-0 left-0 h-full bg-white/80 backdrop-blur-sm shadow-lg border-r border-pink-200 z-50
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        ${collapsed ? 'translate-x-0' : 'translate-x-0'}
        md:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between p-4 border-b border-pink-100">
                        {!collapsed && (
                            <h1 className="text-xl font-bold text-gradient">나의 일기</h1>
                        )}
                        <button
                            onClick={onToggleCollapse}
                            className="p-2 rounded-lg hover:bg-pink-50 transition-colors"
                            aria-label={collapsed ? '사이드바 열기' : '사이드바 접기'}
                        >
                            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* 네비게이션 메뉴 */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = currentView === item.id

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onViewChange(item.id)}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer
                    ${isActive
                                            ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-md'
                                            : 'text-pink-700 hover:bg-pink-50'
                                        }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                                    title={collapsed ? `${item.label} (${item.shortcut})` : undefined}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="font-medium">{item.label}</span>
                                    )}
                                </button>
                            )
                        })}
                    </nav>

                    {/* 미니 캘린더 (접혀있지 않을 때만) */}
                    {!collapsed && (
                        <div className="p-4 border-t border-pink-100">
                            <CalendarMiniView
                                onDateSelect={onDateSelect}
                                selectedDate={selectedDate}
                            />
                        </div>
                    )}

                    {/* 푸터 */}
                    <div className="p-4 border-t border-pink-100">
                        {!collapsed && (
                            <div className="text-center">
                                <p className="text-xs text-pink-500 mb-2">
                                    총 {Object.keys(entries).length}개의 일기
                                </p>
                                <div className="text-xs text-pink-400">
                                    v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
