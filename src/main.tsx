import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)

    // 에러 리포팅 서비스로 전송 (실제 프로덕션에서)
    if (import.meta.env.PROD) {
      // 예: Sentry.captureException(error, { extra: errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              앗! 문제가 발생했습니다
            </h1>
            <p className="text-gray-600 mb-6">
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-yellow-600 transition-all"
            >
              새로고침
            </button>
            {import.meta.env.MODE === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  개발자 정보
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 성능 측정
const measurePerformance = () => {
  if (import.meta.env.MODE === 'development') {
    // First Paint, First Contentful Paint 측정
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`Performance: ${entry.name} - ${entry.startTime}ms`)
      })
    })

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })

    // 페이지 로드 완료 후 메모리 사용량 측정
    window.addEventListener('load', () => {
      setTimeout(() => {
        if ('memory' in performance) {
          const memory = (performance as any).memory
          console.log('Memory usage:', {
            used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
            total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
            limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
          })
        }
      }, 1000)
    })
  }
}

// 앱 초기화
const initializeApp = async () => {
  try {
    // Supabase 초기화
    const { initializeSupabase } = await import('./utils/supabase')
    await initializeSupabase()

    // 성능 측정 시작
    measurePerformance()

    // 서비스 워커 등록 (PWA)
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration)
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error)
          })
      })
    }

    // 온라인/오프라인 상태 감지
    window.addEventListener('online', () => {
      console.log('App is online')
      // 온라인 상태 알림 또는 데이터 동기화
    })

    window.addEventListener('offline', () => {
      console.log('App is offline')
      // 오프라인 상태 알림
    })

    console.log('App initialized successfully')
  } catch (error) {
    console.error('App initialization failed:', error)
  }
}

// 앱 렌더링
const renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
}

// 앱 시작
initializeApp().then(() => {
  renderApp()
})

// 개발 모드에서 HMR 지원
if (import.meta.env.MODE === 'development' && import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    renderApp()
  })
}