import { useState, useEffect } from 'react'
import { CalendarView } from './components/calendar/CalendarView'
import { DiaryView } from './components/diary/DiaryView'
import { useAuth } from './hooks/useAuth'
import { useSettings } from './hooks/useSettings'
import { getCurrentDateString } from './utils/dateUtils'
import { AuthView } from './components/auth/AuthView'
import { SearchView } from './components/search/SearchView'
import { SettingsView } from './components/settings/SettingView'
import { NotificationProvider } from './components/ui/NotificationProvider'
import { LoadingSpinner } from './components/layout/LoadingSpinner'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { useDiaryStore } from './stores/diaryStore'
import type { ViewType } from './types'

// 메인 앱 컴포넌트
const App = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const { settings, isLoading: settingsLoading } = useSettings()
  const {
    selectedDate,
    currentView,
    setSelectedDate,
    setCurrentView,
    setUser,
    fetchEntries,
    loading: storeLoading
  } = useDiaryStore()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // 사용자 정보 스토어에 설정
  useEffect(() => {
    if (user) {
      setUser(user)
    }
  }, [user, setUser])

  // 사용자 인증 후 데이터 로드
  useEffect(() => {
    if (isAuthenticated && user && !isInitialized) {
      const initializeUserData = async () => {
        try {
          await fetchEntries()
          setIsInitialized(true)
        } catch (error) {
          console.error('Failed to initialize user data:', error)
        }
      }

      initializeUserData()
    }
  }, [isAuthenticated, user, fetchEntries, isInitialized])

  // 테마 적용
  useEffect(() => {
    if (settings.theme) {
      const root = document.documentElement
      const { colors } = settings.theme

      root.style.setProperty('--color-primary', colors.primary)
      root.style.setProperty('--color-secondary', colors.secondary)
      root.style.setProperty('--color-background', colors.background)
      root.style.setProperty('--color-surface', colors.surface)
      root.style.setProperty('--color-text', colors.text)

      // 다크 모드 클래스 적용
      if (settings.theme.name === 'dark') {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    }
  }, [settings.theme])

  // 폰트 크기 적용
  useEffect(() => {
    const root = document.documentElement
    const fontSizes = {
      sm: '14px',
      md: '16px',
      lg: '18px'
    }

    root.style.setProperty('--font-size-base', fontSizes[settings.fontSize])
  }, [settings.fontSize])

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault()
            setCurrentView('diary')
            setSelectedDate(getCurrentDateString())
            break
          case 'f':
            e.preventDefault()
            setCurrentView('search')
            break
          case 'c':
            e.preventDefault()
            setCurrentView('calendar')
            break
          case 't':
            e.preventDefault()
            setSelectedDate(getCurrentDateString())
            setCurrentView('diary')
            break
          case ',':
            e.preventDefault()
            setCurrentView('settings')
            break
        }
      }

      if (e.key === 'Escape') {
        // ESC 키로 사이드바 토글
        setSidebarCollapsed(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setCurrentView, setSelectedDate])

  // 뷰 변경 핸들러
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
  }

  // 날짜 선택 핸들러
  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setCurrentView('diary')
  }

  // 로딩 상태 처리
  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-warm-gradient flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-pink-600 font-medium">앱을 초기화하는 중...</p>
        </div>
      </div>
    )
  }

  // 인증되지 않은 사용자
  if (!isAuthenticated) {
    return (
      <NotificationProvider>
        <AuthView />
      </NotificationProvider>
    )
  }

  // 사용자 데이터 로딩 중
  if (storeLoading && !isInitialized) {
    return (
      <div className="min-h-screen bg-warm-gradient flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-pink-600 font-medium">일기를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 메인 앱 렌더링
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-warm-gradient">
        {/* 메인 레이아웃 */}
        <div className="flex h-screen overflow-hidden">
          {/* 사이드바 */}
          <Sidebar
            currentView={currentView}
            selectedDate={selectedDate}
            collapsed={sidebarCollapsed}
            onViewChange={handleViewChange}
            onDateSelect={handleDateSelect}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 헤더 */}
            <Header
              currentView={currentView}
              selectedDate={selectedDate}
              user={user}
              onViewChange={handleViewChange}
              onDateSelect={handleDateSelect}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* 메인 콘텐츠 */}
            <main className="flex-1 overflow-auto">
              {currentView === 'diary' && (
                <DiaryView
                  selectedDate={selectedDate}
                  onDateChange={handleDateSelect}
                />
              )}

              {currentView === 'calendar' && (
                <CalendarView
                  onDateSelect={handleDateSelect}
                  onViewChange={handleViewChange}
                />
              )}

              {currentView === 'search' && (
                <SearchView
                  onDateSelect={handleDateSelect}
                  onViewChange={handleViewChange}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView
                  onViewChange={handleViewChange}
                />
              )}
            </main>
          </div>
        </div>

        {/* 전역 키보드 단축키 안내 (개발 모드에서만) */}
        {import.meta.env.MODE === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-3 rounded-lg opacity-50 hover:opacity-100 transition-opacity">
            <div className="font-semibold mb-1">키보드 단축키:</div>
            <div>Ctrl+N: 새 일기</div>
            <div>Ctrl+F: 검색</div>
            <div>Ctrl+C: 캘린더</div>
            <div>Ctrl+T: 오늘</div>
            <div>Ctrl+,: 설정</div>
            <div>ESC: 사이드바 토글</div>
          </div>
        )}
      </div>
    </NotificationProvider>
  )
}

export default App